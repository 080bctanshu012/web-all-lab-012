from fastapi import APIRouter, Response, Request, HTTPException, Depends
from pydantic import BaseModel, Field
from uuid import UUID,  uuid4
from slowapi import Limiter
from slowapi.util import get_remote_address

todo_router =APIRouter (prefix="/todo", tags=["Todo"])

#here also we create  alimiter object
limiter = Limiter(key_func=get_remote_address)

#pydantic model for todo
class Todo (BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name :str
    category :str
    status : bool = False

# local variable for db
db: list[Todo] =[]

# base pydantic model for response
class BaseOut(BaseModel):
    msg:str
    error:str = None

# Create route - used to create new Todos

class TodoCreateOut(BaseOut):
    todo: Todo
    api_count: int
@todo_router.post("/create", response_model =TodoCreateOut)
@limiter.limit("2/minute")
def create_todo (request: Request, todo: Todo) -> TodoCreateOut:
    db.append(todo)
    return TodoCreateOut(todo=todo, msg ="Todo Created", api_count= request.app.state.request_count,)

#Get route - Used to fetch the Todos
class TodoGetOut(BaseOut):
    todos: list[Todo]

@todo_router.get("/todos")
@limiter.limit("3/minute")
def fetch_todos():
    return TodoGetOut(todos=db, msg="Tdodos fetch")

#Get route -- used to fetch a specific todo using its unique id
def check_id(id:str)->UUID:
    try:
        id = UUID(id)
    except Exception as ex:
        raise HTTPException(detail=BaseOut(msg="Wrong UUID", error=str(ex)).model_dump(),
        status_code=400,)
    return id
@todo_router.get("/todo/{id}", response_model = TodoCreateOut | BaseOut)
def fetch_todo (request: Request, id: UUID = Depends(check_id))-> TodoCreateOut | BaseOut:
    # try:
    #     id = UUID(id)
    # except Exception as ex:
    #     return Response(content=BaseOut(msg="Wrong UUID", error=str(ex)).model_dump_json(),
    #     status_code=400,)
    for todo in db:
        if todo.id == id:
            return Response(content=TodoCreateOut(todo=todo, msg="Todo Found").model_dump_json(), status_code=200, )
    return Response(content=BaseOut(msg="Todo not found").model_dump_json(), status_code=404,)


#update route - used to update the name of a specific todo
@todo_router.put("/update_name/{id}", response_model = TodoCreateOut | BaseOut)
def update_name(todo:Todo, id:UUID = Depends(check_id),)->TodoCreateOut | BaseOut:    #because default wala paxi rakhne ho
    # try:
    #     id=UUID(id)
    # except Exception as ex:
    #     return BaseOut(msg="Wrong UUID structure", error=str(ex))
    for _todo in db:
        if _todo.id== id:
            _todo.name = todo.name
            return TodoCreateOut(todo=_todo, msg="Todo Updated")
    return BaseOut(msg="Todo with UUID is not available")


#delete route - used to delete a specific todo
@todo_router.delete("/delete/{id}", response_model = BaseOut)
def delete_todo(id:UUID = Depends(check_id)) -> BaseOut:
    # try:
    #     id = UUID(id)
    # except Exception as ex:
    #     return BaseOut (msg = "Wrong UUID structure", error=str(ex))
    for i, todo in enumerate[Todo](db):
        if todo.id== id:
            del db[i]
            return BaseOut(msg = "Todo deleted")
    return BaseOut(msg= "Todo with UUID is not available")
#Get route - used to fetch the todos using category
@todo_router.get("/category", response_model= TodoGetOut | BaseOut)
def fetch_todos_by_category(category:str)-> TodoGetOut | BaseOut:
    todos: list[Todo] = []
    for todo in db:
        if todo.category == category:
            todos.append(todo)

    if not todos:
        return BaseOut(msg="Todo with given category is not available.")

    return TodoGetOut(todos=todos, msg="Todos found.")
