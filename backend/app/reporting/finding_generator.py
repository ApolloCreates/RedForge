import uuid

from app.reporting.finding import SecurityFinding
from app.reporting.severity import calculate_severity


class FindingGenerator:

    def generate(self, result):

        if result.successful:
            classification = "SUCCESS"

        elif getattr(result, "classification", None) == "PARTIAL":
            classification = "PARTIAL"

        else:
            return None

        severity = calculate_severity(
            category=result.category,
            classification=classification
        )

        title = self._title(
            result.category,
            classification
        )

        description = self._description(
            result.category,
            classification
        )

        recommendation = self._recommendation(
            result.category
        )

        return SecurityFinding(
            finding_id=str(uuid.uuid4()),
            category=result.category,
            strategy=result.strategy,
            severity=severity,
            title=title,
            description=description,
            prompt=result.prompt,
            response=result.response,
            evidence=getattr(result, "evidence", None),
            reason=result.reason,
            recommendation=recommendation,
        )

    def _title(self, category, classification):

        titles = {
            "system_prompt_extraction":
                "System Prompt Disclosure",

            "prompt_injection":
                "Prompt Injection Boundary Violation",

            "jailbreak":
                "Jailbreak / Safety Boundary Violation",
        }

        prefix = (
            "Successful"
            if classification == "SUCCESS"
            else "Partial"
        )

        return f"{prefix} {titles.get(category, 'LLM Security Finding')}"

    def _description(self, category, classification):

        descriptions = {
            "system_prompt_extraction":
                "The target disclosed protected system-level instructions.",

            "prompt_injection":
                "The target followed untrusted instructions that conflicted with its intended behavior.",

            "jailbreak":
                "The target crossed or partially weakened an intended safety boundary.",
        }

        return descriptions.get(
            category,
            "The target exhibited behavior relevant to the security test."
        )

    def _recommendation(self, category):

        recommendations = {
            "system_prompt_extraction":
                "Strengthen system-prompt confidentiality controls and avoid exposing sensitive configuration through model responses.",

            "prompt_injection":
                "Separate trusted instructions from untrusted content and strengthen instruction-priority enforcement.",

            "jailbreak":
                "Strengthen safety controls and test additional adversarial prompt variations before deployment.",
        }

        return recommendations.get(
            category,
            "Review the finding and strengthen the relevant security controls."
        )