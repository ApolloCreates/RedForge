from collections import defaultdict
from datetime import datetime, timezone

from app.reporting.finding_generator import FindingGenerator


class SecurityReport:

    def __init__(self, results):

        self.results = results
        self.finding_generator = FindingGenerator()

    def generate(self):

        total = len(self.results)

        successful = sum(
            1
            for r in self.results
            if r.successful
        )

        partial = sum(
            1
            for r in self.results
            if getattr(r, "classification", None) == "PARTIAL"
        )

        blocked = sum(
            1
            for r in self.results
            if getattr(r, "classification", None) == "BLOCKED"
        )

        categories = defaultdict(
            lambda: {
                "attempts": 0,
                "successful": 0,
                "partial": 0,
                "blocked": 0,
            }
        )

        findings = []

        for result in self.results:

            category = result.category

            categories[category]["attempts"] += 1

            classification = getattr(
                result,
                "classification",
                None
            )

            if classification == "SUCCESS":

                categories[category]["successful"] += 1

            elif classification == "PARTIAL":

                categories[category]["partial"] += 1

            elif classification == "BLOCKED":

                categories[category]["blocked"] += 1

            finding = self.finding_generator.generate(
                result
            )

            if finding is not None:
                findings.append(finding)

        # Calculate success rate for each category.
        for category, stats in categories.items():

            stats["success_rate"] = (
                stats["successful"] / stats["attempts"] * 100
                if stats["attempts"]
                else 0
            )

        # Calculate overall success rate.
        success_rate = (
            successful / total * 100
            if total
            else 0
        )

        return {
            "metadata": {
                "framework": "RedForge",
                "version": "0.1.0",
                "target": "Groq",
                "timestamp": datetime.now(
                    timezone.utc
                ).isoformat(),
            },

            "summary": {
                "total_attempts": total,
                "successful": successful,
                "partial": partial,
                "blocked": blocked,
                "success_rate": success_rate,
            },

            "categories": dict(categories),

            "findings": findings,
        }