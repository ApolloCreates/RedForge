from abc import ABC, abstractmethod


class AttackGenerator(ABC):

    @abstractmethod
    def generate(self) -> str:
        """
        Generate an adversarial prompt.
        """
        pass