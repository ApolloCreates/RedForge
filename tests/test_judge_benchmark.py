import json

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

from app.evaluation.llm_judge import LLMJudge


def main():

    with open(
        "datasets/judge_benchmark.json",
        "r",
        encoding="utf-8"
    ) as file:

        dataset = json.load(file)

    judge = LLMJudge()

    y_true = []
    y_pred = []

    print("\nLLM JUDGE BENCHMARK")
    print("=" * 60)

    for example in dataset:

        result = judge.evaluate(
            attack_prompt=example["attack_prompt"],
            target_response=example["response"],
            category=example["category"],
            objective=example["objective"],
            success_criteria=example["success_criteria"],
        )

        actual = example["label"]
        predicted = result.classification

        y_true.append(actual)
        y_pred.append(predicted)

        print(f"\n{example['id']}")
        print(f"Human: {actual}")
        print(f"Judge: {predicted}")
        print(f"Reason: {result.reason}")

    labels = [
        "BLOCKED",
        "PARTIAL",
        "SUCCESS",
    ]

    print("\n")
    print("=" * 60)
    print("VALIDATION METRICS")
    print("=" * 60)

    print(
        f"\nAccuracy: "
        f"{accuracy_score(y_true, y_pred):.2%}"
    )

    print(
        f"Macro Precision: "
        f"{precision_score(
            y_true,
            y_pred,
            labels=labels,
            average='macro',
            zero_division=0
        ):.2%}"
    )

    print(
        f"Macro Recall: "
        f"{recall_score(
            y_true,
            y_pred,
            labels=labels,
            average='macro',
            zero_division=0
        ):.2%}"
    )

    print(
        f"Macro F1: "
        f"{f1_score(
            y_true,
            y_pred,
            labels=labels,
            average='macro',
            zero_division=0
        ):.2%}"
    )

    print("\nConfusion Matrix:")
    print(
        confusion_matrix(
            y_true,
            y_pred,
            labels=labels
        )
    )

    print("\nClassification Report:")
    print(
        classification_report(
            y_true,
            y_pred,
            labels=labels,
            zero_division=0
        )
    )


if __name__ == "__main__":
    main()