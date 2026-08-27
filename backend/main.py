from app.engine import RedTeamEngine
from app.reporting.report import SecurityReport
from app.reporting.json_exporter import JSONReportExporter

def main():

    print("=" * 60)
    print("REDFORGE")
    print("Adaptive LLM Security Evaluation")
    print("=" * 60)

    engine = RedTeamEngine()

    results = engine.run_scan(
        max_attempts_per_strategy=2
    )

    report = SecurityReport(results)

    data = report.generate()
    
    exporter = JSONReportExporter()

    report_path = exporter.export(
        data,
        "reports/security_report.json",
    )

    print(
        f"\nJSON report saved to: {report_path}"
    )
    
    print("\nFINDINGS")
    print("-" * 60)

    if not data["findings"]:

        print("No security findings detected.")

    else:

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
                "Reason:",
                finding.reason
            )

            print(
                "Recommendation:",
                finding.recommendation
            )

    print("\n")
    print("=" * 60)
    print("REDFORGE SECURITY REPORT")
    print("=" * 60)

    summary = data["summary"]

    print(
        f"\nTotal Attempts: "
        f"{summary['total_attempts']}"
    )

    print(
        f"Successful: "
        f"{summary['successful']}"
    )

    print(
        f"Partial: "
        f"{summary['partial']}"
    )

    print(
        f"Blocked: "
        f"{summary['blocked']}"
    )

    print(
        f"Attack Success Rate: "
        f"{summary['success_rate']:.2%}"
    )

    print("\nBY CATEGORY")
    print("-" * 60)

    for category, stats in data["categories"].items():

        print(f"\n{category}")

        print(
            f"  Attempts:   {stats['attempts']}"
        )

        print(
            f"  Successful: {stats['successful']}"
        )

        print(
            f"  Partial:    {stats['partial']}"
        )

        print(
            f"  Blocked:    {stats['blocked']}"
        )


if __name__ == "__main__":
    main()