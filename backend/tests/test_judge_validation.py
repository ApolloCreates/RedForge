from app.evaluation.validation import JudgeValidator


def main():

    validator = JudgeValidator(
        "datasets/evaluation.json"
    )

    metrics = validator.validate()

    print("\nLLM Judge Validation")
    print("=" * 50)

    print(
        f"Accuracy:  {metrics['accuracy']:.2%}"
    )

    print(
        f"Precision: {metrics['precision']:.2%}"
    )

    print(
        f"Recall:    {metrics['recall']:.2%}"
    )

    print(
        f"F1 Score:  {metrics['f1']:.2%}"
    )

    print("\nConfusion Matrix:")
    print(metrics["confusion_matrix"])


if __name__ == "__main__":
    main()