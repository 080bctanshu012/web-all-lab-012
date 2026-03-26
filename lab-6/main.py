from fastapi import FastAPI, Request
import json
from time import perf_counter
from routers import todo_router, user_router
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

app = FastAPI()
# here, using the concepts of apirouetr

#we will create an object of limiter
limiter = Limiter(key_func= get_remote_address)
app.state.limiter = limiter


app.add_middleware(SlowAPIMiddleware)
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request:Request,exc: RateLimitExceeded):
    return JSONResponse(
         status_code =429,
        content = {
            "detail" : "Too many request",
        },
    )

app.state.request_count = 0

@app.middleware("http")
async def request_details(request: Request, call_next):
    print(request["path"])
    print(request["method"])
    payload = await request.body()
    if payload: #kinaki get ma error dina sakxa by default get ma payload hudaina
        print (json.loads(payload))
    start = perf_counter()
    app.state.request_count += 1
    response = await call_next(request)
    end = perf_counter()
    print(end-start)
    return response
routers =[todo_router, user_router]
for router in routers:
    app.include_router(router=router, prefix="/api")
