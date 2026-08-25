from app.engine import RedTeamEngine
from app.evaluation.llm_judge import LLMJudge


def main():

    print("=" * 60)
    print("REDFORGE")
    print("Adaptive LLM Security Evaluation")
    print("=" * 60)

    judge = LLMJudge()

    engine = RedTeamEngine(
        evaluator=judge
    )

    results = engine.run_scan(
        categories=["system_prompt_extraction"],
        max_attempts_per_strategy=2
    )

    successful = [
        result
        for result in results
        if result.successful
    ]

    print("\n")
    print("=" * 60)
    print("SCAN SUMMARY")
    print("=" * 60)

    print(
        f"\nTotal attempts: {len(results)}"
    )

    print(
        f"Successful attacks: {len(successful)}"
    )

    if results:

        success_rate = (
            len(successful)
            / len(results)
            * 100
        )

        print(
            f"Attack success rate: "
            f"{success_rate:.1f}%"
        )


if __name__ == "__main__":
    main()