import json

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

        for example in dataset:

            prediction = self.judge.evaluate(
                attack_prompt=example["attack_prompt"],
                target_response=example["response"],
                category=example["category"],
                objective=example["objective"],
                success_criteria=example["success_criteria"],
            )

            actual = example["label"]
            predicted = prediction.classification

            y_true.append(actual)
            y_pred.append(predicted)

            results.append({
                "id": example["id"],
                "actual": actual,
                "predicted": predicted,
                "correct": actual == predicted,
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

            "total_cases": len(dataset),
        }

        return {
            "metrics": metrics,
            "results": results,
        }