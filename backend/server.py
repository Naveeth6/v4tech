from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Cookie, Response, Body
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import base64
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
# Cookie secure flag (set to 'True' in production). Default is False for local dev.
COOKIE_SECURE = os.environ.get('COOKIE_SECURE', 'False').lower() == 'true'

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomerDetails(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    address: str
    email: str
    phone: str
    service_needed: str
    description: str
    image_data: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomerDetailsCreate(BaseModel):
    name: str
    address: str
    email: str
    phone: str
    service_needed: str
    description: str
    image_data: Optional[str] = None

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    email: str
    service_taken: str
    rating: int
    review_text: str
    approved: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    customer_name: str
    email: str
    service_taken: str
    rating: int
    review_text: str

class Complaint(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    complaint_id: str
    customer_name: str
    email: str
    phone: str
    subject: str
    description: str
    status: str = "Pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ComplaintCreate(BaseModel):
    customer_name: str
    email: str
    phone: str
    subject: str
    description: str

class ComplaintStatusUpdate(BaseModel):
    status: str

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str

# Auth helper
async def get_current_user(session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    token = session_token
    if not token and authorization:
        token = authorization.replace("Bearer ", "")
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = await db.user_sessions.find_one({"session_token": token})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    if datetime.fromisoformat(session['expires_at']) < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user = await db.users.find_one({"id": session['user_id']}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user)

# Local admin login endpoint
@api_router.post("/auth/local-login")
async def local_login(response: Response, data: dict = Body(...)):
    username = data.get("username")
    password = data.get("password")
    admin_user = os.environ.get("ADMIN_USER")
    admin_pass = os.environ.get("ADMIN_PASS")
    if username != admin_user or password != admin_pass:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Create a session token
    session_token = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    session_data = {
        "user_id": "admin",
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    # Ensure an admin user document exists so get_current_user() can return it
    existing_admin = await db.users.find_one({"id": "admin"})
    if not existing_admin:
        admin_user_doc = {
            "id": "admin",
            "email": f"{admin_user}@local",
            "name": admin_user,
            "picture": None,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user_doc)

    await db.user_sessions.insert_one(session_data)
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="None",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    return {"success": True, "session_token": session_token}
@api_router.post("/auth/session")
async def create_session(session_id: str, response: Response):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid session ID")
        
        data = resp.json()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": data['email']}, {"_id": 0})
    if not existing_user:
        user_data = {
            "id": data['id'],
            "email": data['email'],
            "name": data['name'],
            "picture": data.get('picture'),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(user_data)
    
    # Create session
    session_token = data['session_token']
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    session_data = {
        "user_id": data['id'],
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_sessions.insert_one(session_data)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="None",
        path="/",
        max_age=7 * 24 * 60 * 60
        )

    
    return {"success": True, "user": data}

@api_router.get("/auth/me")
async def get_me(session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    user = await get_current_user(session_token, authorization)
    return user

@api_router.post("/auth/logout")
async def logout(response: Response, session_token: Optional[str] = Cookie(None)):
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"success": True}

# Customer details endpoints
@api_router.post("/customer-details", response_model=CustomerDetails)
async def submit_customer_details(input: CustomerDetailsCreate):
    details_dict = input.model_dump()
    details_obj = CustomerDetails(**details_dict)
    
    doc = details_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.customer_details.insert_one(doc)
    return details_obj

@api_router.get("/customer-details", response_model=List[CustomerDetails])
async def get_customer_details(session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    details = await db.customer_details.find({}, {"_id": 0}).to_list(1000)
    for item in details:
        if isinstance(item['created_at'], str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    
    return details

@api_router.patch("/customer-details/{detail_id}/status")
async def update_customer_detail_status(detail_id: str, status: str, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    result = await db.customer_details.update_one(
        {"id": detail_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Detail not found")
    
    return {"success": True}

@api_router.delete("/customer-details/{detail_id}")
async def delete_customer_detail(detail_id: str, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    result = await db.customer_details.delete_one({"id": detail_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Detail not found")
    
    return {"success": True}

@api_router.patch("/customer-details/{detail_id}")
async def update_customer_detail(detail_id: str, input: CustomerDetailsCreate, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    update_dict = input.model_dump()
    
    result = await db.customer_details.update_one(
        {"id": detail_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Detail not found")
    
    return {"success": True}

# Review endpoints
@api_router.post("/reviews", response_model=Review)
async def submit_review(input: ReviewCreate):
    review_dict = input.model_dump()
    review_obj = Review(**review_dict)
    
    doc = review_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.reviews.insert_one(doc)
    return review_obj

@api_router.get("/reviews", response_model=List[Review])
async def get_reviews(approved_only: bool = True):
    query = {"approved": True} if approved_only else {}
    reviews = await db.reviews.find(query, {"_id": 0}).to_list(1000)
    
    for review in reviews:
        if isinstance(review['created_at'], str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    
    return reviews

@api_router.patch("/reviews/{review_id}/approve")
async def approve_review(review_id: str, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$set": {"approved": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return {"success": True}

@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    result = await db.reviews.delete_one({"id": review_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return {"success": True}

@api_router.patch("/reviews/{review_id}")
async def update_review(review_id: str, input: ReviewCreate, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    update_dict = input.model_dump()
    
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return {"success": True}

# Complaint endpoints
@api_router.post("/complaints", response_model=Complaint)
async def submit_complaint(input: ComplaintCreate):
    complaint_dict = input.model_dump()
    complaint_id = f"CMP{str(uuid.uuid4())[:8].upper()}"
    complaint_dict['complaint_id'] = complaint_id
    complaint_obj = Complaint(**complaint_dict)
    
    doc = complaint_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.complaints.insert_one(doc)
    return complaint_obj

@api_router.get("/complaints/search/{search_term}", response_model=Complaint)
async def get_complaint_by_search(search_term: str):
    # Try to find by complaint_id first, then by phone
    complaint = await db.complaints.find_one({"complaint_id": search_term}, {"_id": 0})
    
    if not complaint:
        complaint = await db.complaints.find_one({"phone": search_term}, {"_id": 0})
    
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if isinstance(complaint['created_at'], str):
        complaint['created_at'] = datetime.fromisoformat(complaint['created_at'])
    if isinstance(complaint['updated_at'], str):
        complaint['updated_at'] = datetime.fromisoformat(complaint['updated_at'])
    
    return Complaint(**complaint)

@api_router.get("/complaints", response_model=List[Complaint])
async def get_all_complaints(session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    complaints = await db.complaints.find({}, {"_id": 0}).to_list(1000)
    
    for complaint in complaints:
        if isinstance(complaint['created_at'], str):
            complaint['created_at'] = datetime.fromisoformat(complaint['created_at'])
        if isinstance(complaint['updated_at'], str):
            complaint['updated_at'] = datetime.fromisoformat(complaint['updated_at'])
    
    return complaints

@api_router.patch("/complaints/{complaint_id}/status")
async def update_complaint_status(complaint_id: str, update: ComplaintStatusUpdate, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    result = await db.complaints.update_one(
        {"complaint_id": complaint_id},
        {"$set": {"status": update.status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    return {"success": True}

@api_router.delete("/complaints/{complaint_id}")
async def delete_complaint(complaint_id: str, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    result = await db.complaints.delete_one({"complaint_id": complaint_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    return {"success": True}

# Contact message endpoints
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact_message(input: ContactMessageCreate):
    message_dict = input.model_dump()
    message_obj = ContactMessage(**message_dict)
    
    doc = message_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_messages.insert_one(doc)
    return message_obj

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages(session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    messages = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
    
    for message in messages:
        if isinstance(message['created_at'], str):
            message['created_at'] = datetime.fromisoformat(message['created_at'])
    
    return messages

@api_router.delete("/contact/{message_id}")
async def delete_contact_message(message_id: str, session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    result = await db.contact_messages.delete_one({"id": message_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"success": True}

# Stats endpoint for admin dashboard
@api_router.get("/stats")
async def get_stats(session_token: Optional[str] = Cookie(None), authorization: Optional[str] = None):
    await get_current_user(session_token, authorization)
    
    total_customers = await db.customer_details.count_documents({})
    pending_customers = await db.customer_details.count_documents({"status": "pending"})
    total_reviews = await db.reviews.count_documents({})
    pending_reviews = await db.reviews.count_documents({"approved": False})
    total_complaints = await db.complaints.count_documents({})
    pending_complaints = await db.complaints.count_documents({"status": "Pending"})
    total_messages = await db.contact_messages.count_documents({})
    
    return {
        "total_customers": total_customers,
        "pending_customers": pending_customers,
        "total_reviews": total_reviews,
        "pending_reviews": pending_reviews,
        "total_complaints": total_complaints,
        "pending_complaints": pending_complaints,
        "total_messages": total_messages#@app.middleware("http")
    }

# CORS middleware

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://v4-tech.in",
        "https://www.v4-tech.in",
        "https://v4tech-frontend.onrender.com"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    )

# Cache static files
@app.middleware("http")
async def cache_static_files(request, call_next):
    response = await call_next(request)
    if any(request.url.path.endswith(ext) for ext in [
        ".js", ".css", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".woff2"
    ]):
        response.headers["Cache-Control"] = "public, max-age=31536000"
    return response
    
app.include_router(api_router)

app.add_middleware(
    SessionMiddleware,
    secret_key="supersecretkey",
    same_site="none",
    https_only=True
)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
