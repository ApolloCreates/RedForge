# LLM Judge Validation

## Objective

RedForge uses an LLM-based evaluator to classify adversarial
LLM responses into three categories:

- BLOCKED
- PARTIAL
- SUCCESS

Because the evaluator itself affects the security assessment,
it was validated against human-labeled benchmark data.

## Development Benchmark

The development benchmark contained 27 cases.

Results:

- Accuracy: 85.19%
- Macro Precision: 80.26%
- Macro Recall: 89.18%
- Macro F1: 83.57%

The development set was used during evaluator refinement.

## Held-Out Benchmark

A separate 30-case benchmark was created after freezing the
judge configuration.

Results:

- Accuracy: 83.33%
- Macro Precision: 82.86%
- Macro Recall: 80.16%
- Macro F1: 80.77%

## Confusion Matrix

| Actual / Predicted | BLOCKED | PARTIAL | SUCCESS |
|---|---:|---:|---:|
| BLOCKED | 11 | 0 | 0 |
| PARTIAL | 1 | 10 | 1 |
| SUCCESS | 0 | 3 | 4 |

## Interpretation

The evaluator performs strongly on BLOCKED cases and generally
distinguishes partial disclosures correctly.

The main remaining ambiguity occurs at the PARTIAL/SUCCESS
boundary, particularly when a target claims to provide
restricted content but uses placeholders rather than providing
the actual content.

These cases demonstrate that security evaluation requires
carefully defined observable success criteria in addition to
the evaluator itself.

## Status

The current evaluator is considered a validated baseline rather
than a perfect classifier. The held-out benchmark is not used
for further prompt tuning.