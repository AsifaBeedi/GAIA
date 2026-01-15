from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager
from nlp_engine import NLPEngine
from news_generator import NewsStream

# Global Instances
nlp_engine = None
news_stream = NewsStream()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on startup
    global nlp_engine
    nlp_engine = NLPEngine()
    yield
    # Clean up (if needed)

app = FastAPI(title="Project GAIA API", lifespan=lifespan)

# Allow CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "system": "GAIA Planetary Nervous System"}

@app.get("/api/events")
def get_events():
    """
    Returns a batch of simulated news events, analyzed in real-time by the NLP engine.
    """
    import uuid
    import time
    
    raw_events = news_stream.get_batch(size=5)
    analyzed_events = []
    
    for event in raw_events:
        analysis = nlp_engine.analyze(event["text"])
        # Generate a unique ID for this instance of the event
        event_id = str(uuid.uuid4())
        
        analyzed_events.append({
            "id": event_id,
            "topic": "Global Sentiment",
            "lat": event["lat"],
            "lng": event["lng"],
            "sentiment": analysis["sentiment"],
            "text": event["text"],
            "lang": event["lang"],
            "score": analysis["score"],
            "timestamp": time.time()
        })
        
    return analyzed_events

@app.post("/api/scenario/{scenario_name}")
def set_scenario(scenario_name: str):
    success = news_stream.switch_scenario(scenario_name)
    return {"success": success, "current_scenario": news_stream.current_scenario}

from pydantic import BaseModel
from typing import Optional

class BroadcastRequest(BaseModel):
    text: str
    lat: Optional[float] = 0.0
    lng: Optional[float] = 0.0
    lang: Optional[str] = "unknown"

@app.post("/api/broadcast")
def broadcast_signal(req: BroadcastRequest):
    """
    Receives a raw signal from a user, performs live NLP analysis,
    and injects it into the global event stream.
    """
    import uuid
    import time
    
    # Live Real-time NLP Analysis
    analysis = nlp_engine.analyze(req.text)
    
    event_id = str(uuid.uuid4())
    timestamp = time.time()
    
    event_packet = {
        "id": event_id,
        "topic": "Intercepted Signal",
        "lat": req.lat,
        "lng": req.lng,
        "sentiment": analysis["sentiment"],
        "text": req.text,
        "lang": req.lang,
        "score": analysis["score"],
        "timestamp": timestamp,
        "is_live": True # Marker for frontend to show special effects
    }
    
    # Add to stream so poller picks it up
    # However, since the user wants immediate feedback, we also return it.
    # We need to adapt the structure to match what news_generator expects
    # The news_generator stores 'raw' dicts usually, but we are injecting fully formed ones?
    # Actually news_generator.scenarios stores raw dicts. 
    # Let's adjust news_generator to just hold this dict and get_events to handle it.
    # Wait, 'get_events' iterates and calls analyze(). We don't want to re-analyze.
    # Let's handle this in news_stream carefully.
    
    # Actually, simplest way: Just inject the raw data into news stream 
    # and let get_events analyze it again? No, that's wasteful.
    # Let's make get_events smarter.
    
    # For now, we'll bypass news_stream for the return, but how do we get it on the map for OTHERS?
    # We need to put it in news_stream.
    
    # Let's stuff a "pre-analyzed" object into news_stream?
    # Or just stuff the raw text and let get_events analyze it (it's fast enough).
    
    raw_event = {
        "text": req.text,
        "lat": req.lat,
        "lng": req.lng,
        "lang": req.lang
    }
    news_stream.add_live_event(raw_event)
    
    return event_packet

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
