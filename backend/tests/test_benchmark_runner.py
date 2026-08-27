from unittest import runner

from app.evaluation.benchmark import BenchmarkRunner
from app.evaluation.llm_judge import LLMJudge


def main():

    judge = LLMJudge()

    runner = BenchmarkRunner(
        judge=judge
    )

    print("\nStarting RedForge Judge Validation...", flush=True)

    print(
        "Dataset: datasets/judge_test_v2_small.json",
        flush=True
    )

    print(
        "Running benchmark cases...\n",
        flush=True
    )

    report = runner.run(
        "datasets/judge_test_v2_small.json"
    )

    print(
        "\nBenchmark completed.",
        flush=True
    )

    metrics = report["metrics"]

    print("\nREDFORGE JUDGE VALIDATION")
    print("=" * 60)

    print(
        f"Cases: {metrics['total_cases']}"
    )

    print(
        f"Accuracy: "
        f"{metrics['accuracy']:.2%}"
    )

    print(
        f"Macro Precision: "
        f"{metrics['precision']:.2%}"
    )

    print(
        f"Macro Recall: "
        f"{metrics['recall']:.2%}"
    )

    print(
        f"Macro F1: "
        f"{metrics['f1']:.2%}"
    )

    print("\nConfusion Matrix:")

    for row in metrics["confusion_matrix"]:
        print(row)

    print("\nIncorrect Cases:")

    for result in report["results"]:

        if not result["correct"]:

            print(
                f"\n{result['id']}: "
                f"{result['actual']} → {result['predicted']}"
            )

            print(
                f"Evidence: {result['evidence']}"
            )

            print(
                f"Reason: {result['reason']}"
            )


if __name__ == "__main__":
    main()