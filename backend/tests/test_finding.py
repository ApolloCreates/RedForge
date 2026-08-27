from app.reporting.finding_generator import FindingGenerator


class MockResult:

    category = "prompt_injection"
    strategy = "authority_impersonation"

    prompt = "Test prompt"
    response = "Test response"

    successful = True
    classification = "SUCCESS"

    evidence = "Target followed the injected instruction."
    reason = "Security boundary was violated."


def main():

    generator = FindingGenerator()

    finding = generator.generate(
        MockResult()
    )

    print("\nREDFORGE FINDING")
    print("=" * 60)

    print("ID:", finding.finding_id)
    print("Title:", finding.title)
    print("Severity:", finding.severity)

    print("\nCategory:")
    print(finding.category)

    print("\nDescription:")
    print(finding.description)

    print("\nEvidence:")
    print(finding.evidence)

    print("\nRecommendation:")
    print(finding.recommendation)


if __name__ == "__main__":
    main()