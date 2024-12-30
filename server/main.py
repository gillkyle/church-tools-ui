import uuid
from typing import Dict, Optional

from church_of_jesus_christ_api import ChurchOfJesusChristAPI
from fastapi import Cookie, Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware to allow requests from your web app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your web app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active sessions
active_sessions: Dict[str, ChurchOfJesusChristAPI] = {}


async def get_current_client(session: Optional[str] = Cookie(None)):
    if not session or session not in active_sessions:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return active_sessions[session]


class LoginBody(BaseModel):
    username: str
    password: str


@app.post("/auth/login")
async def login(response: Response, body: LoginBody):
    try:
        # Create new church API client
        client = ChurchOfJesusChristAPI(
            username=body.username,
            password=body.password,
        )

        # Generate session token
        session_token = str(uuid.uuid4())
        active_sessions[session_token] = client

        # Set secure HTTP-only cookie
        response.set_cookie(
            key="session",
            value=session_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax",
            max_age=3600,  # 1 hour expiration
        )
        # store the access token in the UI as a cookie as well
        access_token = client.session.cookies.get("owp")
        if access_token:
            response.set_cookie(
                key="access_token",
                value=access_token,
                # TODO: maybe should turn this back on
                httponly=False,
                secure=False,
                samesite="lax",
                max_age=3600,
            )

        return {
            "message": "Login successful",
            "token": client.session.cookies.get("owp"),
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/directory")
async def get_directory(client: ChurchOfJesusChristAPI = Depends(get_current_client)):
    try:
        return client.get_directory()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/organizations")
async def get_organizations(
    client: ChurchOfJesusChristAPI = Depends(get_current_client),
):
    try:
        return client.get_unit_organizations()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/session")
async def get_session(client: ChurchOfJesusChristAPI = Depends(get_current_client)):
    print(client.session)
    return client.session.cookies.get("owp")


@app.post("/auth/logout")
async def logout(
    response: Response,
    client: ChurchOfJesusChristAPI = Depends(get_current_client),
    session: Optional[str] = Cookie(None),
):
    if session and session in active_sessions:
        del active_sessions[session]

    # Clear the session cookie
    response.delete_cookie(key="session")
    return {"message": "Logged out successfully"}


@app.get("/internal/diagnostics")
async def diagnostics():
    # TODO: implement lord ruler mode for me
    # show all active sessions
    active_session_ids = list(active_sessions.keys())
    return {
        "active_session_ids": active_session_ids,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
