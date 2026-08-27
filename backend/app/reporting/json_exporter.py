import json
from dataclasses import asdict
from pathlib import Path


class JSONReportExporter:

    def export(
        self,
        report: dict,
        output_path: str = "reports/security_report.json",
    ):

        path = Path(output_path)

        path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        data = self._serialize(report)

        with path.open(
            "w",
            encoding="utf-8",
        ) as file:

            json.dump(
                data,
                file,
                indent=4,
                ensure_ascii=False,
            )

        return path

    def _serialize(self, value):

        if hasattr(value, "__dataclass_fields__"):
            return asdict(value)

        if isinstance(value, dict):

            return {
                key: self._serialize(item)
                for key, item in value.items()
            }

        if isinstance(value, list):

            return [
                self._serialize(item)
                for item in value
            ]

        return value