from fastapi import APIRouter
user_router =APIRouter (prefix="/user", tags=["User"])

@user_router.get("/signin")
def signin():
    return {"msg": "User Sign In"}

@user_router.get("/signup")
def signup():
    return {"msg": "User Sign up"}
