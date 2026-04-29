# Multimodal Image-to-Text Evaluation Support

**Status**: Proposed
**Date**: 2026-03-17
**Issue**: https://github.com/strands-agents/evals/issues/128

## Context

Strands-evals SDK evaluates text-based outputs using LLM-as-a-Judge, but cannot assess multimodal outputs. A developer building a vision agent hits this wall today:

```
from strands_evals import Case, Experiment
from strands_evals.evaluators import OutputEvaluator

evaluator = OutputEvaluator(rubric="Is the caption accurate?")
case = Case(
    name="image-caption-001",
    input="Describe this image.",  *# No way to carry image data*
    expected_output="A dog playing fetch in a park.",
)
# The judge never sees the image — it cannot detect visual hallucinations*
experiment = Experiment(cases=[case], evaluators=[evaluator])
```

There are three gaps: (1) no image-aware evaluation — judge prompts are text-only, (2) no multimodal prompt construction — no mechanism to combine image content blocks with text in a judge call, and (3) no dimension-specific rubrics for visual tasks (correctness, faithfulness, hallucination detection).

## Decision

New `MultimodalOutputEvaluator(OutputEvaluator[MultimodalInput, str])` class for media-in, text-out evaluation using MLLM-as-a-Judge. `InputT=MultimodalInput` (a TypedDict) carries `{"media": ..., "instruction": ...}`, `OutputT=str`.
**Scope:** Image/document-to-text task output evaluation.
**Out of scope**: text-to-image, audio, video, trajectory evaluation.

### Evaluation dimensions

|Priority	|Metric	|Scale	|Core Question	|
|---	|---	|---	|---	|
|P0	|Overall Quality	|Likert-5	|How good is the response overall?	|
|P0	|Correctness	|Binary (Yes/No)	|Is the response factually accurate and complete?	|
|P1	|Faithfulness	|Binary (Yes/No)	|Is the response grounded in the image without hallucinations?	|
|P1	|Instruction Following	|Binary (Yes/No)	|Does the response address the query's requirements?	|

### Core API

```
from strands import Agent
from strands_evals.evaluators import OutputEvaluator
from strands_evals.types import EvaluationData, EvaluationOutput, MultimodalInput

class MultimodalOutputEvaluator(OutputEvaluator[MultimodalInput, str]):
    """MLLM-as-a-Judge evaluator for multimodal tasks."""
    def __init__(self, rubric: str, model: Union[Model, str, None] = None,
                 include_media: bool = True, include_inputs: bool = True,
                 system_prompt: Union[str, None] = None,
                 ref_rubric: Union[str, None] = None):
        super().__init__(rubric=rubric, model=model,
                         system_prompt=system_prompt or MLLM_JUDGE_SYSTEM_PROMPT,
                         include_inputs=include_inputs)
        self.include_media = include_media
        self.ref_rubric = ref_rubric

    def _select_rubric(self, evaluation_case):
        """Auto-select reference-based rubric when expected_output is present."""
        if self.ref_rubric and evaluation_case.expected_output is not None:
            return self.ref_rubric
        return self.rubric

    def evaluate(self, eval_case: EvaluationData[MultimodalInput, str]) -> list[EvaluationOutput]:
        effective_rubric = self._select_rubric(eval_case)
        # Build multimodal evaluation prompt
        prompt = compose_multimodal_test_prompt(
            eval_case, rubric=effective_rubric,
            include_inputs=self.include_inputs, include_media=self.include_media,
        )
        # Create judge agent and call with structured output
        judge = Agent(model=self.model, system_prompt=self.system_prompt, callback_handler=None)
        result = judge(prompt, structured_output_model=EvaluationOutput)
        return [cast(EvaluationOutput, result.structured_output)]

        # compose_multimodal_test_prompt returns either:
        #   list[ContentBlock] when include_media=True and media is present:
        #     [{"image": {"format": "jpeg", "source": {"bytes": b"..."}}},
        #      {"text": "<Input>...</Input><Output>...</Output><Rubric>...</Rubric>"}]
        #   str when include_media=False or no media key (text-only LLM mode)
```

**Key design choices:**

* **Extends `OutputEvaluator`**: Inherits `rubric`, `model`, `system_prompt`, `include_inputs` management, and `to_dict()` serialization. We override `evaluate()` completely — no risk of breaking the text-focused parent. This is the same subclassing pattern used by other evaluators in the SDK.
* **Same Agent invocation pattern as parent**: Uses `Agent.__call__(prompt, structured_output_model=...)` which accepts both `str` and `list[ContentBlock]` inputs, maintaining consistency with the parent `OutputEvaluator`.
* **Strands ContentBlock format:** Media blocks use `{"image": {"format": "jpeg", "source": {"bytes": b"..."}}}` — the native strands SDK format.
* **Reference-based vs. reference-free:** When `expected_output` is provided and `ref_rubric` is configured, `_select_rubric()` automatically switches to the reference-based rubric. When `None`, the judge evaluates from media alone (reference-free).
* **Built-in rubric templates:** Ships with `OVERALL_QUALITY_RUBRIC_V0`, `CORRECTNESS_RUBRIC_V0`, `FAITHFULNESS_RUBRIC_V0`, `INSTRUCTION_FOLLOWING_RUBRIC_V0` (plus `*_V0_REF` reference-based variants). Users can also provide custom rubrics.
* **Convenience subclasses:** `MultimodalOverallQualityEvaluator`, `MultimodalCorrectnessEvaluator`, `MultimodalFaithfulnessEvaluator`, `MultimodalInstructionFollowingEvaluator` — each pre-configures the appropriate rubric and its reference-based variant.
* **Modality-generic naming**: Uses `include_media`, `media` field, and `MultimodalInput` to support future modalities (documents, audio, video) without API changes.

## Developer Experience

### Basic usage

```
from strands_evals import Case, Experiment
from strands_evals.evaluators import MultimodalCorrectnessEvaluator
from strands_evals.types import ImageData, MultimodalInput

# Define cases with media data in input dict
cases = [Case[MultimodalInput, str](
    input={"media": ImageData(source="chart.png"), "instruction": "What is the revenue trend?"},
)]

# Standard workflow
evaluator = MultimodalCorrectnessEvaluator()
experiment = Experiment[MultimodalInput, str](cases=cases, evaluators=[evaluator])
reports = experiment.run_evaluations(task=lambda case: my_model(case.input))
```

```
# Reference-based evaluation by providing expected_output (automatic rubric selection)
case = Case[MultimodalInput, str](
    input={"media": ImageData(source="scene.jpg"), "instruction": "Describe this image."},
    expected_output="A sunny park with a dog playing fetch.",  # triggers ref-based rubric
)
```

```
# Custom rubric via the base evaluator
from strands_evals.evaluators import MultimodalOutputEvaluator

medical_rubric = """Rate diagnostic accuracy on a 3-point scale:
- Completely (1.0): All findings correctly identified with proper terminology.
- Partially (0.5): Key findings identified but with imprecise terminology.
- Not at all (0.0): Critical findings missed or misidentified."""

evaluator = MultimodalOutputEvaluator(rubric=medical_rubric)
```

```
# LLM-only mode (text without media)
evaluator = MultimodalCorrectnessEvaluator(include_media=False)
```

### Error handling

* Image not found: `ValueError` with supported sources listed
* Missing `"media"` key with `include_media=True`: falls back to text-only with `UserWarning`
* Empty media list with `include_media=True`: falls back to text-only with `UserWarning`
* Remote sources: HTTP/HTTPS URLs auto-fetched via `urllib.request` (stdlib); S3 URIs auto-fetched if `boto3` is installed, `ImportError` with guidance otherwise
* Supported image formats: JPEG, PNG, GIF, WebP
* Supported local sources: file paths, base64 strings, data URLs, raw bytes, PIL Images

## Alternatives Considered

1. **Modify `OutputEvaluator` directly** — Rejected: adding media handling into the text-focused class overloads its API and risks breaking existing usage. Subclassing `OutputEvaluator` as `MultimodalOutputEvaluator` keeps the parent untouched while reusing its infrastructure (`rubric`, `model`, `system_prompt`, `to_dict()`).
2. **Extend `Evaluator` directly** (not `OutputEvaluator`) — Rejected: would require duplicating all the rubric, model, and system_prompt management that `OutputEvaluator` already provides. Since we override `evaluate()` completely, subclassing `OutputEvaluator` carries no risk of text-focused logic leaking through.
3. **Media data in `Case.metadata`** — Rejected: `metadata` is for auxiliary info (human scores, labels), not primary inputs. Non-obvious pattern, impossible to type-check.
4. **Separate class per dimension** (e.g., `CorrectnessEvaluator`) — Adopted as convenience subclasses: `MultimodalCorrectnessEvaluator`, `MultimodalFaithfulnessEvaluator`, etc. Core logic lives in `MultimodalOutputEvaluator`; each subclass only pre-configures its rubric and reference-based rubric variant.
5. **Using `Agent.structured_output()` instead of `Agent.__call__()`** — Rejected: `Agent.__call__` accepts both `str` and `list[ContentBlock]` inputs, so we use the same invocation pattern as the parent `OutputEvaluator` for consistency.
6. **Using `"image"` as the input dict key** — Rejected in favor of `"media"`: the `"media"` key is modality-generic and supports future extension to documents, audio, and video without API changes.

## Consequences

**Easier:**

* Same `Case` → `Experiment` → `Report` workflow for multimodal evaluation
* Reference-based and reference-free supported via `expected_output` with automatic rubric selection
* Built-in rubrics for four dimensions adapted from experimentally validated prompts; custom rubrics for domain-specific needs
* `include_media=False` enables LLM-as-a-Judge comparison experiments with zero code change
* Same `Agent.__call__` invocation pattern as parent `OutputEvaluator`

**Trade-offs:**

* `InputT=MultimodalInput` (TypedDict) provides partial typing but is not enforced at runtime
* Multimodal judge calls are more expensive/slower than text-only (image tokens cost more)
* S3 URI support requires `boto3` as an optional dependency

## Willingness to Implement

Yes