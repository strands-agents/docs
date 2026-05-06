"""AWS Lambda handler that wraps a Strands evaluator as an AgentCore
code-based evaluator.

This sample shows how to deploy an evaluator from the Strands Evals SDK
(``strands-agents-evals``) behind an AWS Lambda function that Amazon
Bedrock AgentCore Evaluations invokes with the code-based evaluator
contract. The handler parses the AgentCore request, runs a Strands
evaluator against the mapped session, and returns a response that
conforms to the AgentCore response schema.

The companion docs page walks through the code region by region:
``src/content/docs/user-guide/evals-sdk/how-to/agentcore-code-evaluators.mdx``.

Snippet references in that page resolve to this file via
``--8<-- "user-guide/evals-sdk/how-to/agentcore_code_evaluator_handler.py:<region>"``.
"""

# --8<-- [start:imports]
import json
import logging
import os
from typing import Any

from strands_evals.evaluators import HelpfulnessEvaluator
from strands_evals.mappers import StrandsInMemorySessionMapper
from strands_evals.types import EvaluationData, EvaluationOutput

logger = logging.getLogger(__name__)

# AgentCore code-based evaluator contract version echoed in responses.
SCHEMA_VERSION = "1.0"

# Env var used to override the pass/fail threshold at deploy time.
PASS_THRESHOLD_ENV = "STRANDS_EVAL_PASS_THRESHOLD"

# Default pass threshold when the evaluator does not set ``test_pass``.
DEFAULT_PASS_THRESHOLD = 0.5

# AgentCore ``evaluationLevel`` values, per the AgentCore contract:
# https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-based-evaluators.html
AGENTCORE_LEVEL_TOOL_CALL = "TOOL_CALL"
AGENTCORE_LEVEL_TRACE = "TRACE"
AGENTCORE_LEVEL_SESSION = "SESSION"
# --8<-- [end:imports]

# --8<-- [start:handler]
# Module-level evaluator instance reused across Lambda invocations so
# warm starts don't re-initialize the judge-model client on every call.
_EVALUATOR = HelpfulnessEvaluator()


def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    """Entry point AgentCore Evaluations invokes for each scored unit.

    Parses the AgentCore request, runs the configured Strands evaluator,
    and returns a schema-valid AgentCore response. All failure modes are
    converted into schema-valid responses so AgentCore never observes an
    unhandled Lambda error. ``LevelMismatchError`` and ``_error_response``
    are defined alongside the other error-handling helpers below.
    """
    try:
        evaluation_data, level = _parse_payload(event)
        evaluation_output = _invoke_evaluator(
            _EVALUATOR, evaluation_data, level
        )
        return _build_response(event, evaluation_output, status="OK")
    except LevelMismatchError as exc:
        return _error_response(event, exc, label="NOT_RUN")
    except Exception as exc:  # noqa: BLE001 - graceful failure response
        logger.exception("Evaluator invocation failed")
        return _error_response(event, exc, label="ERROR")
# --8<-- [end:handler]

# --8<-- [start:parse_payload]
def _parse_payload(
    event: dict[str, Any],
) -> tuple[EvaluationData, str]:
    """Translate an AgentCore request into Strands evaluator input.

    Returns the ``EvaluationData`` the evaluator will score and the
    ``evaluationLevel`` string from the request so the caller can
    compare it against the evaluator's declared level.
    """
    # Version check. Unknown versions are logged but not fatal; the
    # request may still carry fields we know how to read.
    schema_version = event.get("schemaVersion")
    if schema_version is None:
        logger.warning("AgentCore request is missing schemaVersion")
    elif schema_version != SCHEMA_VERSION:
        logger.warning(
            "Unexpected schemaVersion %r (handler expects %r)",
            schema_version,
            SCHEMA_VERSION,
        )

    # ``evaluationLevel`` is required to pick the right evaluator path.
    # The outer handler converts ValueError into an ERROR response that
    # AgentCore can surface to the reader.
    evaluation_level = event.get("evaluationLevel")
    if not evaluation_level:
        raise ValueError(
            "AgentCore request is missing required 'evaluationLevel'"
        )

    # Convert the OTel-style session spans into a Strands ``Session``.
    evaluation_input = event.get("evaluationInput") or {}
    session_spans = evaluation_input.get("sessionSpans") or []
    mapper = StrandsInMemorySessionMapper()
    session = mapper.map(session_spans)

    # Optional passthroughs. AgentCore only sends these fields when the
    # evaluation configuration references them.
    reference_inputs = event.get("evaluationReferenceInputs")
    evaluation_target = event.get("evaluationTarget")

    # Illustrative defaults: recover the prompt from the root span's
    # attributes and treat the final assistant message as the output.
    # Adjust these helpers to match the span and message shape your
    # agent actually records.
    input_text = _recover_prompt(session)
    actual_output = _recover_final_output(session)

    evaluation_data = EvaluationData(
        input=input_text,
        actual_output=actual_output,
        trajectory=session,
        reference_input=reference_inputs,
    )

    # ``evaluation_target`` is accepted for future use (for example
    # logging the target agent version alongside the score) but is not
    # consumed by ``EvaluationData`` today.
    _ = evaluation_target

    return evaluation_data, evaluation_level


def _recover_prompt(session: Any) -> str:
    """Pull the user prompt out of the mapped session.

    Illustrative: reads the root span's attributes. Real deployments
    should adapt this to match the span schema their agent emits.
    """
    root_span = getattr(session, "root_span", None)
    attributes = getattr(root_span, "attributes", {}) or {}
    return str(
        attributes.get("input") or attributes.get("prompt") or ""
    )


def _recover_final_output(session: Any) -> str:
    """Pull the final assistant message out of the mapped session.

    Illustrative: reads the last message on the session. Real
    deployments should adapt this to match the message shape their
    agent records.
    """
    messages = getattr(session, "messages", []) or []
    if not messages:
        return ""
    last = messages[-1]
    return str(getattr(last, "content", last) or "")
# --8<-- [end:parse_payload]

# --8<-- [start:invoke_evaluator]
# Strands evaluators expose their native level as a string. The sample
# wraps ``HelpfulnessEvaluator``, which is a ``TRACE_LEVEL`` evaluator.
STRANDS_OUTPUT_LEVEL = "OUTPUT_LEVEL"
STRANDS_TRACE_LEVEL = "TRACE_LEVEL"
STRANDS_SESSION_LEVEL = "SESSION_LEVEL"

# How each AgentCore ``evaluationLevel`` maps to a Strands level.
_AGENTCORE_TO_STRANDS_LEVEL = {
    AGENTCORE_LEVEL_TOOL_CALL: STRANDS_OUTPUT_LEVEL,
    AGENTCORE_LEVEL_TRACE: STRANDS_TRACE_LEVEL,
    AGENTCORE_LEVEL_SESSION: STRANDS_SESSION_LEVEL,
}


def _invoke_evaluator(
    evaluator: Any,
    evaluation_data: EvaluationData,
    level: str,
) -> EvaluationOutput:
    """Run the evaluator when the request level matches its Strands level.

    Raises ``LevelMismatchError`` when the incoming AgentCore level does
    not correspond to the evaluator's declared Strands level. The outer
    handler converts that into a schema-valid "not-run" response so
    AgentCore never observes an unhandled Lambda error. The
    ``LevelMismatchError`` class is defined in the error-handling region
    below; Python resolves the forward reference at call time.
    """
    # Every Strands evaluator declares the level at which it operates.
    # ``HelpfulnessEvaluator`` is ``TRACE_LEVEL``; ``OutputEvaluator`` is
    # ``OUTPUT_LEVEL``; ``TrajectoryEvaluator`` is ``SESSION_LEVEL``.
    # The fallback matches this sample's default evaluator.
    evaluator_level = getattr(evaluator, "level", STRANDS_TRACE_LEVEL)

    # ``.get(...)`` returns ``None`` for unknown AgentCore levels, which
    # never matches ``evaluator_level`` and so raises the mismatch error.
    expected_strands_level = _AGENTCORE_TO_STRANDS_LEVEL.get(level)
    if expected_strands_level != evaluator_level:
        raise LevelMismatchError(
            f"Evaluator level {evaluator_level!r} does not support "
            f"AgentCore evaluationLevel {level!r}"
        )

    return evaluator.evaluate(evaluation_data)
# --8<-- [end:invoke_evaluator]

# --8<-- [start:build_response]
def _build_response(
    event: dict[str, Any],
    evaluation_output: EvaluationOutput,
    status: str,
) -> dict[str, Any]:
    """Assemble an AgentCore response from a Strands evaluator output.

    ``status`` is accepted for symmetry with ``_error_response(label=...)``
    so the docs can explain the two response helpers in parallel. The
    happy path always derives ``label`` from ``passed`` (or an explicit
    evaluator label), so the flag is not consumed here.
    """
    _ = status  # reserved for parity with _error_response

    # Pass threshold for turning numeric scores into pass/fail booleans.
    # Read per-invocation so tests and deploys can override via env var.
    try:
        threshold = float(
            os.environ.get(PASS_THRESHOLD_ENV, DEFAULT_PASS_THRESHOLD)
        )
    except (TypeError, ValueError):
        threshold = DEFAULT_PASS_THRESHOLD

    score = getattr(evaluation_output, "score", None)
    reason = getattr(evaluation_output, "reason", None)

    # Strands evaluators may set ``test_pass`` directly (deterministic
    # evaluators often do); otherwise fall back to the threshold compare.
    explicit_pass = getattr(evaluation_output, "test_pass", None)
    if explicit_pass is not None:
        passed = bool(explicit_pass)
    else:
        passed = score is not None and score >= threshold

    # Prefer an evaluator-provided label when one exists; otherwise map
    # the boolean into the AgentCore ``PASS`` / ``FAIL`` vocabulary.
    explicit_label = getattr(evaluation_output, "label", None)
    label = explicit_label if explicit_label else (
        "PASS" if passed else "FAIL"
    )

    return {
        "schemaVersion": event.get("schemaVersion", SCHEMA_VERSION),
        "results": [
            {
                "evaluatorId": event.get("evaluatorId"),
                "evaluatorName": event.get("evaluatorName"),
                "evaluationLevel": event.get("evaluationLevel"),
                "score": score,
                "passed": passed,
                "label": label,
                "reason": reason,
            }
        ],
    }
# --8<-- [end:build_response]

# --8<-- [start:error_handling]
class LevelMismatchError(Exception):
    """Raised when AgentCore's ``evaluationLevel`` does not map to the
    wrapped evaluator's declared Strands level.

    The outer ``try/except`` in ``lambda_handler`` catches this and
    converts it into a schema-valid "not-run" response (``score=None``,
    ``passed=False``, ``label="NOT_RUN"``) so AgentCore surfaces a
    graceful result instead of an unhandled Lambda error.
    """


def _error_response(
    event: dict[str, Any],
    exc: Exception,
    label: str,
) -> dict[str, Any]:
    """Build a schema-valid AgentCore response for a failed invocation.

    ``label`` is ``"NOT_RUN"`` for level-mismatch failures (the
    evaluator is healthy but cannot score this ``evaluationLevel``) and
    ``"ERROR"`` for everything else (validation failure, evaluator
    raise, Bedrock error). ``score`` is ``None`` and ``passed`` is
    ``False`` in both cases so AgentCore can distinguish a missing
    score from a real ``0.0``. ``reason`` carries a short summary
    (exception class and message); full tracebacks go to CloudWatch
    via ``logger.exception(...)`` in ``lambda_handler``.
    """
    reason = f"{type(exc).__name__}: {exc}"
    return {
        "schemaVersion": event.get("schemaVersion", SCHEMA_VERSION),
        "results": [
            {
                "evaluatorId": event.get("evaluatorId"),
                "evaluatorName": event.get("evaluatorName"),
                "evaluationLevel": event.get("evaluationLevel"),
                "score": None,
                "passed": False,
                "label": label,
                "reason": reason,
            }
        ],
    }
# --8<-- [end:error_handling]
