# GAIA: Planetary Nervous System

![Status](https://img.shields.io/badge/STATUS-ONLINE-success?style=for-the-badge)
![System](https://img.shields.io/badge/SYSTEM-PLANETARY%20OBSERVATION-blue?style=for-the-badge)

**GAIA** is a real-time, 3D planetary dashboard that visualizes global sentiment and simulated news events using an interactive WebGL globe. It combines a **Next.js** frontend with a **FastAPI** Python backend, featuring a built-in NLP engine for sentiment analysis.

## 🚀 Features

-   **Interactive 3D Earth**: Built with `React Three Fiber`, featuring day/night cycles, atmosphere, and starfields.
-   **Real-time Event Markers**: Dynamic visualization of news events on the globe surface.
-   **Neural Processing Unit**: Python-based NLP engine using `TextBlob` and `NLTK` to analyze sentiment of incoming data streams.
-   **Scenario Simulation**: Toggle between different global states (e.g., "AI Panic", "Mars Colony") to see how the system reacts.
-   **Cyberpunk UI**: A futuristic, immersive interface designed for high-impact visual presentation.

## 🛠 Technology Stack

-   **Frontend**: Next.js 15, React 19, TailwindCSS 4, React Three Fiber (Three.js)
-   **Backend**: Python 3.10+, FastAPI, Uvicorn, TextBlob
-   **Deployment**: Vercel (Monorepo support)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### 1. Backend Setup
Navigate to the backend directory and install Python dependencies.

```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
# Activate it:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 2. Frontend Setup
Navigate to the frontend directory and install Node modules.

```bash
cd frontend
npm install
```

## 🏃 Running Locally

You need to run both the backend and frontend servers simultaneously.

**Terminal 1 (Backend):**
```bash
cd backend
python main.py
# Server runs at http://localhost:8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# App runs at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the GAIA interface.

## ☁️ Deployment (Vercel)

This project is configured for easy deployment on **Vercel**.

### Automatic Deployment
1.  Push this code to a GitHub repository.
2.  Log in to [Vercel](https://vercel.com) and click "Add New Project".
3.  Import your GitHub repository.
4.  Vercel will automatically detect the `vercel.json` configuration.
5.  Click **Deploy**.

### Manual CLI Deployment
If you have the Vercel CLI installed:

```bash
# From the root directory
vercel
```

Follow the prompts to link the project. The `vercel.json` file handles the routing between the Python backend and Next.js frontend automatically.

---
*System maintained by the Deepmind Agentic Team.*
