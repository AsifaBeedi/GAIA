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
    raw_events = news_stream.get_batch(size=5)
    analyzed_events = []
    
    for i, event in enumerate(raw_events):
        analysis = nlp_engine.analyze(event["text"])
        analyzed_events.append({
            "id": i,
            "topic": "Global Sentiment",
            "lat": event["lat"],
            "lng": event["lng"],
            "sentiment": analysis["sentiment"],
            "text": event["text"],
            "lang": event["lang"],
            "score": analysis["score"]
        })
        
    return analyzed_events

@app.post("/api/scenario/{scenario_name}")
def set_scenario(scenario_name: str):
    success = news_stream.switch_scenario(scenario_name)
    return {"success": success, "current_scenario": news_stream.current_scenario}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
