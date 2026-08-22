from pydantic import BaseModel
from typing import List


class Finding(BaseModel):
    category: str
    message: str


class ResumeAnalysisOut(BaseModel):
    score: int
    word_count: int
    has_extractable_text: bool
    critical: List[Finding]
    suggestions: List[Finding]
    positives: List[str]
