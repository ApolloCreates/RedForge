from pydantic import BaseModel


class AttackResult(BaseModel):

    attack_id: str
    category: str
    strategy: str
    prompt: str

    objective: str
    success_criteria: str

    response: str

    classification: str
    successful: bool
    reason: str
    evidence: str
    attempt_number: int