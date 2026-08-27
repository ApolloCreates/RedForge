from abc import ABC, abstractmethod


class TargetLLM(ABC):

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """
        Send a prompt to the target LLM
        and return its response.
        """
        pass