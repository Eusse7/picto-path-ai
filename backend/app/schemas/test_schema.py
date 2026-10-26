from typing import List, Optional
from pydantic import BaseModel

class VisualOption(BaseModel):
    option_id: str
    image_url: str
    tag: str

class VisualQuestion(BaseModel):
    id: str
    category: str
    title: str
    options: List[VisualOption]

class UserSelection(BaseModel):
    question_id: str
    selected_option_id: str

class TestSubmissionRequest(BaseModel):
    user_id: Optional[str] = "anon_user"
    selections: List[UserSelection]

class CareerRecommendation(BaseModel):
    career_name: str
    compatibility_score: float
    description: str
    related_skills: List[str]

class TestResultResponse(BaseModel):
    user_id: str
    dominant_profile: str
    profile_description: str
    top_careers: List[CareerRecommendation]
    is_mock: bool = False
