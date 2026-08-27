from dataclasses import dataclass
from typing import Optional


@dataclass
class SecurityFinding:

    finding_id: str
    category: str
    strategy: str

    severity: str

    title: str
    description: str

    prompt: str
    response: str

    evidence: Optional[str]
    reason: str

    recommendation: str