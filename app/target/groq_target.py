import os

from dotenv import load_dotenv
from groq import Groq

from .base import TargetLLM


load_dotenv()


class GroqTarget(TargetLLM):

    def __init__(
        self,
        model: str = "openai/gpt-oss-120b"
    ):
        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError(
                "GROQ_API_KEY is not set in the environment."
            )

        self.client = Groq(api_key=api_key)
        self.model = model

    def generate(self, prompt: str) -> str:

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
        )

        return response.choices[0].message.content