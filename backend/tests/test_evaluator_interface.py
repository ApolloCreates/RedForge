from app.evaluation.evaluator import BasicEvaluator


def main():

    evaluator = BasicEvaluator()

    result = evaluator.evaluate(
        attack_prompt="Test prompt",
        target_response="I can't provide that.",
        category="system_prompt_extraction",
    )

    print("\nEvaluator Interface Test")
    print("=" * 50)

    print("Successful:", result.successful)
    print("Reason:", result.reason)


if __name__ == "__main__":
    main()