import json
import time

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)


class BenchmarkRunner:

    def __init__(self, judge):
        self.judge = judge

    def load_dataset(self, path):

        with open(
            path,
            "r",
            encoding="utf-8"
        ) as file:
            return json.load(file)

    def run(self, path):

        dataset = self.load_dataset(path)

        y_true = []
        y_pred = []

        results = []

        total_cases = len(dataset)

        for index, example in enumerate(dataset, 1):

            print(
                f"[{index:02d}/{total_cases:02d}] "
                f"Running {example['id']}...",
                flush=True
            )

            max_retries = 10

            for attempt in range(max_retries):

                try:

                    prediction = self.judge.evaluate(
                        attack_prompt=example["attack_prompt"],
                        target_response=example["response"],
                        category=example["category"],
                        objective=example["objective"],
                        success_criteria=example["success_criteria"],
                    )

                    break

                except Exception as e:

                    error = str(e).lower()

                    if (
                        "rate_limit" not in error
                        and "429" not in error
                    ):
                        raise

                    if attempt == max_retries - 1:
                        raise

                    retry_after = 10.0

                    if (
                        hasattr(e, "response")
                        and e.response is not None
                    ):

                        header = e.response.headers.get(
                            "retry-after"
                        )

                        if header:

                            try:
                                retry_after = float(header)

                            except ValueError:
                                pass

                    print(
                        f"    Rate limit reached. "
                        f"Retry {attempt + 1}/{max_retries} "
                        f"in {retry_after:.1f}s...",
                        flush=True
                    )

                    time.sleep(retry_after)

            actual = example["label"]
            predicted = prediction.classification

            correct = actual == predicted

            status = "PASS" if correct else "FAIL"

            print(
                f"    {status}: "
                f"{actual} -> {predicted}",
                flush=True
            )

            y_true.append(actual)
            y_pred.append(predicted)

            results.append({
                "id": example["id"],
                "actual": actual,
                "predicted": predicted,
                "correct": correct,
                "evidence": prediction.evidence,
                "reason": prediction.reason,
            })

        labels = [
            "BLOCKED",
            "PARTIAL",
            "SUCCESS",
        ]

        metrics = {
            "accuracy": accuracy_score(
                y_true,
                y_pred
            ),

            "precision": precision_score(
                y_true,
                y_pred,
                labels=labels,
                average="macro",
                zero_division=0,
            ),

            "recall": recall_score(
                y_true,
                y_pred,
                labels=labels,
                average="macro",
                zero_division=0,
            ),

            "f1": f1_score(
                y_true,
                y_pred,
                labels=labels,
                average="macro",
                zero_division=0,
            ),

            "confusion_matrix": confusion_matrix(
                y_true,
                y_pred,
                labels=labels,
            ).tolist(),

            "total_cases": total_cases,
        }

        return {
            "metrics": metrics,
            "results": results,
        }