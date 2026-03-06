Guardrail-related type definitions for the SDK.

These types are modeled after the Bedrock API.

-   Bedrock docs: [https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_Types\_Amazon\_Bedrock\_Runtime.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Types_Amazon_Bedrock_Runtime.html)

## GuardrailConfig

```python
class GuardrailConfig(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:13](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L13)

Configuration for content filtering guardrails.

**Attributes**:

-   `guardrailIdentifier` - Unique identifier for the guardrail.
-   `guardrailVersion` - Version of the guardrail to apply.
-   `streamProcessingMode` - Processing mode.
-   `trace` - The trace behavior for the guardrail.

## Topic

```python
class Topic(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:29](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L29)

Information about a topic guardrail.

**Attributes**:

-   `action` - The action the guardrail should take when it intervenes on a topic.
-   `name` - The name for the guardrail.
-   `type` - The type behavior that the guardrail should perform when the model detects the topic.

## TopicPolicy

```python
class TopicPolicy(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:43](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L43)

A behavior assessment of a topic policy.

**Attributes**:

-   `topics` - The topics in the assessment.

## ContentFilter

```python
class ContentFilter(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:53](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L53)

The content filter for a guardrail.

**Attributes**:

-   `action` - Action to take when content is detected.
-   `confidence` - Confidence level of the detection.
-   `type` - The type of content to filter.

## ContentPolicy

```python
class ContentPolicy(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:67](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L67)

An assessment of a content policy for a guardrail.

**Attributes**:

-   `filters` - List of content filters to apply.

## CustomWord

```python
class CustomWord(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:77](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L77)

Definition of a custom word to be filtered.

**Attributes**:

-   `action` - Action to take when the word is detected.
-   `match` - The word or phrase to match.

## ManagedWord

```python
class ManagedWord(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:89](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L89)

Definition of a managed word to be filtered.

**Attributes**:

-   `action` - Action to take when the word is detected.
-   `match` - The word or phrase to match.
-   `type` - Type of the word.

## WordPolicy

```python
class WordPolicy(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:103](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L103)

The word policy assessment.

**Attributes**:

-   `customWords` - List of custom words to filter.
-   `managedWordLists` - List of managed word lists to filter.

## PIIEntity

```python
class PIIEntity(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:115](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L115)

Definition of a Personally Identifiable Information (PII) entity to be filtered.

**Attributes**:

-   `action` - Action to take when PII is detected.
-   `match` - The specific PII instance to match.
-   `type` - The type of PII to detect.

## Regex

```python
class Regex(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:161](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L161)

Definition of a custom regex pattern for filtering sensitive information.

**Attributes**:

-   `action` - Action to take when the pattern is matched.
-   `match` - The regex filter match.
-   `name` - Name of the regex pattern for identification.
-   `regex` - The regex query.

## SensitiveInformationPolicy

```python
class SensitiveInformationPolicy(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:177](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L177)

Policy defining sensitive information filtering rules.

**Attributes**:

-   `piiEntities` - List of Personally Identifiable Information (PII) entities to detect and handle.
-   `regexes` - The regex queries in the assessment.

## ContextualGroundingFilter

```python
class ContextualGroundingFilter(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:189](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L189)

Filter for ensuring responses are grounded in provided context.

**Attributes**:

-   `action` - Action to take when the threshold is not met.
-   `score` - The score generated by contextual grounding filter (range \[0, 1\]).
-   `threshold` - Threshold used by contextual grounding filter to determine whether the content is grounded or not.
-   `type` - The contextual grounding filter type.

## ContextualGroundingPolicy

```python
class ContextualGroundingPolicy(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:205](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L205)

The policy assessment details for the guardrails contextual grounding filter.

**Attributes**:

-   `filters` - The filter details for the guardrails contextual grounding filter.

## GuardrailAssessment

```python
class GuardrailAssessment(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:215](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L215)

A behavior assessment of the guardrail policies used in a call to the Converse API.

**Attributes**:

-   `contentPolicy` - The content policy.
-   `contextualGroundingPolicy` - The contextual grounding policy used for the guardrail assessment.
-   `sensitiveInformationPolicy` - The sensitive information policy.
-   `topicPolicy` - The topic policy.
-   `wordPolicy` - The word policy.

## GuardrailTrace

```python
class GuardrailTrace(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:233](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L233)

Trace information from guardrail processing.

**Attributes**:

-   `inputAssessment` - Assessment of input content against guardrail policies, keyed by input identifier.
-   `modelOutput` - The original output from the model before guardrail processing.
-   `outputAssessments` - Assessments of output content against guardrail policies, keyed by output identifier.

## Trace

```python
class Trace(TypedDict)
```

Defined in: [src/strands/types/guardrails.py:247](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/guardrails.py#L247)

A Top level guardrail trace object.

**Attributes**:

-   `guardrail` - Trace information from guardrail processing.