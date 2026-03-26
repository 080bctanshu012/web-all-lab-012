

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional



class UserCreate(BaseModel):
    full_name: str
    email:     EmailStr    # validates email format
    password:  str

class UserLogin(BaseModel):
    email:    EmailStr
    password: str




class UserOut(BaseModel):
    id:         int
    full_name:  str
    email:      str
    is_active:  bool
    created_at: datetime

    class Config:
        from_attributes = True  # allows reading from SQLAlchemy model

class Token(BaseModel):
    access_token: str
    token_type:   str
