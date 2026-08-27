from pydantic import BaseModel, Field
from uuid import uuid4


class Attack(BaseModel):

    attack_id: str = Field(
        default_factory=lambda: str(uuid4())
    )

    category: str

    strategy: str

    prompt: str

    objective: str

    success_criteria: str