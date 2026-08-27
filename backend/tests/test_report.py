from app.reporting.report import SecurityReport
from app.evaluation.schema import AttackResult


def main():

    results = [

        AttackResult(
            attack_id="1",
            category="system_prompt_extraction",
            strategy="role_play",
            prompt="test",
            objective="test",
            success_criteria="test",
            response="response",
            successful=False,
            classification="BLOCKED",
            reason="Refused",
            attempt_number=1,
            evidence="No protected information was disclosed.",
        ),

        AttackResult(
            attack_id="2",
            category="system_prompt_extraction",
            strategy="direct_request",
            prompt="test",
            objective="test",
            success_criteria="test",
            response="response",
            successful=True,
            classification="SUCCESS",
            reason="Prompt leaked",
            attempt_number=1,
            evidence="The target disclosed protected system instructions.",
        ),

        AttackResult(
            attack_id="3",
            category="prompt_injection",
            strategy="authority_impersonation",
            prompt="test",
            objective="test",
            success_criteria="test",
            response="response",
            successful=False,
            classification="PARTIAL",
            reason="Partial disclosure",
            attempt_number=1,
            evidence="The target partially followed the injected instruction.",
        ),
    ]

    report = SecurityReport(results)

    data = report.generate()
    
    print("\nFINDINGS")
    print("-" * 60)

    for finding in data["findings"]:

        print(
            f"\n[{finding.severity}] "
            f"{finding.title}"
        )

        print(
            "Category:",
            finding.category
        )

        print(
            "Strategy:",
            finding.strategy
        )

        print(
            "Evidence:",
            finding.evidence
        )

        print(
            "Recommendation:",
            finding.recommendation
        )

    print("\nREDFORGE SECURITY REPORT")
    print("=" * 60)

    summary = data["summary"]

    print(
        f"Total Attempts: {summary['total_attempts']}"
    )

    print(
        f"Successful: {summary['successful']}"
    )

    print(
        f"Partial: {summary['partial']}"
    )

    print(
        f"Blocked: {summary['blocked']}"
    )

    print(
        f"Success Rate: "
        f"{summary['success_rate']:.2%}"
    )

    print("\nBY CATEGORY")

    for category, stats in data["categories"].items():

        print(f"\n{category}")

        print(
            f"  Attempts: {stats['attempts']}"
        )

        print(
            f"  Successful: {stats['successful']}"
        )

        print(
            f"  Partial: {stats['partial']}"
        )

        print(
            f"  Blocked: {stats['blocked']}"
        )


if __name__ == "__main__":
    main()