import os

from openai import OpenAI
from dotenv import load_dotenv

from .base import TargetLLM


load_dotenv()


class OpenAITarget(TargetLLM):

    def __init__(self, model: str = "gpt-4o-mini"):

        self.client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )

        self.model = model

    def generate(self, prompt: str) -> str:

        response = self.client.responses.create(
            model=self.model,
            input=prompt
        )

        return response.output_text