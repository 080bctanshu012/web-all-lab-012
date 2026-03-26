# import the fastapi module
from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict

# we have to create an app of FastAPI
app = FastAPI()
@app.get("/")
def home():
    return {"messsage":"Hello FastAPI"}

@app.get("/list")
def list_of_values():
    return [1,2,3]


@app.post("/create")
def create_something(data:dict):
    return {"data":data, "msg": "created"}

@app.put("/update/{id}")
def update_something(id:str,data:dict):
    return {"id":id, "data":data, "msg":"updated"}

@app.delete("/delete/{id}")
def delete_something(id:str):
    return  {"id": id,"msg":"deleted"}

#let us try by a query parameter
@app.get("/home")
def query_something (q: str):
    return {"q":q, "msg":"query received"}


class Post(BaseModel):
    title:str
    description: str

    model_config = ConfigDict(extra="forbid")

class PostOut(BaseModel):
    post : Post
    msg : str

@app.post("/create_post", response_model = PostOut)
def create_post(post: Post)-> PostOut:
    return {"post":post, "msg":"Post created", "test":True}
