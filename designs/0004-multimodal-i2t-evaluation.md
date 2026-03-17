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

New `MultimodalOutputEvaluator(OutputEvaluator[dict, str])` class for image-in, text-out evaluation using MLLM-as-a-Judge. `InputT=dict` carries `{"image": ..., "instruction": ...}`, `OutputT=str`.
**Scope:** Image/document-to-text task output evaluation.
**Out of scope**: text-to-image, audio, video, trajectory evaluation.

### Evaluation dimensions

|Priority	|Metric	|Scale	|Core Question	|
|---	|---	|---	|---	|
|P0	|Correctness	|Likert-5	|Is the response factually accurate and complete?	|
|P1	|Faithfulness	|Likert-5	|Is the response grounded in the image without hallucinations?	|
|P1	|Instruction Following	|Binary (Yes/No)	|Does the response address the query's requirements?	|
|P2	|Answerability	|Binary (Yes/No)	|Is the query valid and answerable given the image?	|

### Core API

```
from strands import Agent
from strands_evals.evaluators import OutputEvaluator
from strands_evals.types import EvaluationData, EvaluationOutput

class MultimodalOutputEvaluator(OutputEvaluator[dict, str]):
    """MLLM-as-a-Judge evaluator for image-to-text tasks."""
    def __init__(self, rubric: str, model: Union[Model, str, None] = None,
                 system_prompt: str = MLLM_JUDGE_SYSTEM_PROMPT,
                 include_image: bool = True, include_inputs: bool = True):
        super().__init__(rubric=rubric, model=model,
                         system_prompt=system_prompt, include_inputs=include_inputs)
        self.include_image = include_image

    def evaluate(self, eval_case: EvaluationData[dict, str]) -> list[EvaluationOutput]:
        # Build multimodal evaluation prompt
        prompt = compose_multimodal_test_prompt(
            eval_case, rubric=self.rubric,
            include_inputs=self.include_inputs, include_image=self.include_image,
        )
        # Create judge agent and call with structured output
        judge = Agent(model=self.model, system_prompt=self.system_prompt, callback_handler=None)
        result = judge(prompt, structured_output_model=EvaluationOutput)
        return [cast(EvaluationOutput, result.structured_output)]

        # compose_multimodal_test_prompt returns either:
        #   list[ContentBlock] when include_image=True and image is present:
        #     [{"image": {"format": "jpeg", "source": {"bytes": b"..."}}},
        #      {"text": "<Input>...</Input><Output>...</Output><Rubric>...</Rubric>"}]
        #   str when include_image=False or no image key (text-only LLM mode)
```

**Key design choices:**

* **Extends `OutputEvaluator`**: Inherits `rubric`, `model`, `system_prompt`, `include_inputs` management, and `to_dict()` serialization. We override `evaluate()` completely — no risk of breaking the text-focused parent. This is the same subclassing pattern used by other evaluators in the SDK.
* **Strands ContentBlock format:** Image blocks use `{"image": {"format": "jpeg", "source": {"bytes": b"..."}}}` — the native strands SDK format.
* **Reference-based vs. reference-free:** When `expected_output` is provided, the prompt includes `<ExpectedOutput>` for comparison; when `None`, the judge evaluates from image alone.
* **Built-in rubric templates:** Ships with `CORRECTNESS_RUBRIC`, `FAITHFULNESS_RUBRIC`, `INSTRUCTION_FOLLOWING_RUBRIC`, `ANSWERABILITY_RUBRIC`. Users can also provide custom rubrics.
* **Convenience subclasses:** `MultimodalCorrectnessEvaluator`, `MultimodalFaithfulnessEvaluator`, `MultimodalInstructionFollowingEvaluator`, `MultimodalAnswerabilityEvaluator` — each pre-configures the appropriate rubric.

## Developer Experience

### Basic usage

```
from strands_evals import Case, Experiment
from strands_evals.evaluators import MultimodalCorrectnessEvaluator
from strands_evals.types import ImageData

# Define cases with image data in input dict
cases = [Case[dict, str](
    input={"image": ImageData(source="chart.png"), "instruction": "What is the revenue trend?"},
)]

# Standard workflow
evaluator = MultimodalCorrectnessEvaluator()
experiment = Experiment[dict, str](cases=cases, evaluators=[evaluator])
reports = experiment.run_evaluations(task=lambda case: my_model(case.input))
```

```
# Reference-based evaluation by providing expected_output
case = Case[dict, str](
    input={"image": ImageData(source="scene.jpg"), "instruction": "Describe this image."},
    expected_output="A sunny park with a dog playing fetch.",
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

### Error handling

* Image not found: `ValueError` with supported sources listed
* Missing `"image"` key with `include_image=True`: falls back to text-only with `UserWarning`
* Remote sources (S3 URIs, HTTP URLs): accepted for storage but must be downloaded to local path or bytes before evaluation; `to_bytes()` raises `ValueError` with guidance
* Supported image formats: JPEG, PNG, GIF, WebP
* Supported local sources: file paths, base64 strings, data URLs, raw bytes, PIL Images

## Alternatives Considered

1. **Modify `OutputEvaluator` directly** — Rejected: adding image handling into the text-focused class overloads its API and risks breaking existing usage. Subclassing `OutputEvaluator` as `MultimodalOutputEvaluator` keeps the parent untouched while reusing its infrastructure (`rubric`, `model`, `system_prompt`, `to_dict()`).
2. **Extend `Evaluator` directly** (not `OutputEvaluator`) — Rejected: would require duplicating all the rubric, model, and system_prompt management that `OutputEvaluator` already provides. Since we override `evaluate()` completely, subclassing `OutputEvaluator` carries no risk of text-focused logic leaking through.
3. **Image data in `Case.metadata`** — Rejected: `metadata` is for auxiliary info (human scores, labels), not primary inputs. Non-obvious pattern, impossible to type-check.
4. **Separate class per dimension** (e.g., `CorrectnessEvaluator`) — Adopted as convenience subclasses: `MultimodalCorrectnessEvaluator`, `MultimodalFaithfulnessEvaluator`, etc. Core logic lives in `MultimodalOutputEvaluator`; each subclass only pre-configures its rubric.

## Consequences

**Easier:**

* Same `Case` → `Experiment` → `Report` workflow for multimodal evaluation
* Reference-based and reference-free supported via `expected_output`
* Built-in rubrics for four dimensions; custom rubrics for domain-specific needs
* `include_image=False` enables LLM-as-a-Judge comparison experiments with zero code change

**Trade-offs:**

* `InputT=dict` is less type-safe than a dataclass (`MultimodalInput` TypedDict provides partial typing)
* Multimodal judge calls are more expensive/slower than text-only (image tokens cost more)
* Remote image sources (S3, HTTP URLs) require user to download before evaluation — no built-in fetching to avoid heavy dependencies (boto3, requests)

## Willingness to Implement

Yes