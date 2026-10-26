from sqlalchemy import Column, String, Integer, DateTime, JSON
from datetime import datetime
from app.db.postgres import Base

class UserTestHistory(Base):
    __tablename__ = "user_test_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    dominant_profile = Column(String, nullable=False)
    selections = Column(JSON, nullable=False)
    recommendations = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
