import json
from pathlib import Path

from app.reporting.json_exporter import JSONReportExporter


def main():

    report = {
        "metadata": {
            "framework": "RedForge",
            "version": "0.1.0",
            "target": "Groq",
            "timestamp": "2026-08-26T00:00:00+00:00",
        },

        "summary": {
            "total_attempts": 3,
            "successful": 1,
            "partial": 1,
            "blocked": 1,
            "success_rate": 1 / 3,
        },

        "categories": {
            "system_prompt_extraction": {
                "attempts": 2,
                "successful": 1,
                "partial": 0,
                "blocked": 1,
            },

            "prompt_injection": {
                "attempts": 1,
                "successful": 0,
                "partial": 1,
                "blocked": 0,
            },
        },

        "findings": [],
    }
    
    
    exporter = JSONReportExporter()

    path = exporter.export(
        report,
        "reports/test_report.json",
    )

    print("\nJSON REPORT EXPORT")
    print("=" * 60)

    print("Created:", path)

    with Path(path).open(
        "r",
        encoding="utf-8",
    ) as file:

        data = json.load(file)
        
    summary = data["summary"]

    print(
        "Total Attempts:",
        summary["total_attempts"],
    )

    print(
        "Successful:",
        summary["successful"],
    )

    print(
        "Partial:",
        summary["partial"],
    )

    print(
        "Blocked:",
        summary["blocked"],
    )

    print("\nExport successful.")


if __name__ == "__main__":
    main()