from abc import ABC, abstractmethod

from .evaluator import EvaluationResult


class Evaluator(ABC):

    @abstractmethod
    def evaluate(
        self,
        attack_prompt: str,
        target_response: str,
        category: str,
        objective: str,
        success_criteria: str,
    ) -> EvaluationResult:
        pass