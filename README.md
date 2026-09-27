⚡ Saiprakash Kulkarni — AI & ML Engineering Portfolio

![Image](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python&logoColor=white)
![Image](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg?logo=fastapi&logoColor=white)
![Image](https://img.shields.io/badge/PyTorch-Deep%20Learning-EE4C2C.svg?logo=pytorch&logoColor=white)
![Image](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)
![Image](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)
![Image](https://img.shields.io/badge/TailwindCSS-Cyberpunk%20HUD-38B2AC.svg?logo=tailwind-css&logoColor=white)
![Image](https://img.shields.io/badge/License-MIT-yellow.svg)

Applied Deep Learning & NLP Researcher | AI & Machine Learning Engineer
Bengaluru, India • saiprakashkulkarni494@gmail.com • LinkedIn • GitHub
🌟 Executive Summary
Interactive, high-performance portfolio and research showcase engineered for Saiprakash Kulkarni — AI & Machine Learning Engineer. Features deep learning interactive telemetry simulators, a cyberpunk command HUD, 3D Canvas visualizers, an ATS-grade resume exporter, and a pure Python backend alongside a modern React/TypeScript frontend.

🔬 Featured Research & Publications
Enhancing UPI Security Through Intelligent Recipient Verification
Lead Author & Researcher — April 2026 (Bengaluru, India)
Algorithmic Defense: Employs Sentence-BERT (SBERT) semantic embeddings and Cosine Similarity to intercept cross-lingual VPA typo-squatting, homoglyphs, and social engineering impersonations in real time.
Risk-Based Authentication (RBA): Leverages passive device telemetry and anomaly heuristics to impose dynamic cognitive friction (delays and verification challenges) on high-risk transfers.
Regulatory Alignment: Fully aligned with Reserve Bank of India (RBI) cybersecurity directives for digital payment infrastructure.
Live Simulator: Built directly into the portfolio with live risk-scoring visualization and test cases.

🚀 Key Engineered Projects

1. Smart Flood Early Warning System (MHEWS)
IoT Telemetry & Predictive Deep Learning (Jan 2026 – Feb 2026)
Architecture: Bi-directional LSTM networks predicting river basin surge levels across 6 to 24-hour predictive horizons.
Metrics: 95.0% prediction accuracy with an ensemble XGBoost filter that eliminates 90% of false-alarm sensor artifacts.
Interactive Console: Includes an on-screen simulation dashboard to adjust river levels, rainfall intensity, and reservoir outflow.

3. Kisan Mitra (Agro-AI Platform)
Rural Vision Diagnostics & Multilingual NLP (June 2025 – July 2025)
Accessibility First: Tailored for smallholder farmers with patchy connectivity, utilizing quantized MobileNet models (<120 KB payload).
Voice Intelligence: Sub-450 ms latency bidirectional Kannada speech processing (STT & TTS) for non-English speakers.
Integration: Live agricultural market (mandi) rate ingestion and automated crop disease remedies.

📂 Project Architecture

code
Code
MyPortfolio1111/
├── backend_python/                       # 🐍 Pure Python Backend & Research Models
│   ├── app.py                            # FastAPI & Built-in HTTP Server (Zero dependencies needed)
│   ├── email_service.py                  # Gmail compose & RFC mailto URL generators
│   ├── portfolio_data.py                 # Dataclasses & bio data structures
│   ├── requirements.txt                  # Python dependencies
│   └── research_models/
│       ├── upi_recipient_verifier.py     # SBERT & Cosine Similarity UPI algorithm
│       ├── flood_warning_mhews.py        # Bi-LSTM & XGBoost flood surge forecasting
│       └── kisan_mitra_ai.py             # Quantized crop disease & Kannada NLP pipeline
├── src/                                  # ⚛️ React 18 & TypeScript Interactive UI
│   ├── components/
│   │   ├── HeroSection.tsx               # Holographic HUD & Direct Contact Triggers
│   │   ├── UpiSecuritySimulator.tsx      # Interactive UPI research simulator
│   │   ├── FloodWarningSimulator.tsx     # Hydrological surge telemetry console
│   │   ├── KisanMitraInspector.tsx       # Crop disease diagnosis simulator
│   │   ├── ContactTransmissionHub.tsx    # Secure contact dispatch with direct Gmail pre-fill
│   │   ├── FuturisticTerminal.tsx        # Interactive CLI terminal
│   │   ├── HoloNeuralCore.tsx            # 3D interactive neural canvas
│   │   ├── SkillsRadarMatrix.tsx         # Multi-disciplinary skill profiler
│   │   └── ResumeModal.tsx               # ATS-compliant print & download viewer
│   ├── data/portfolioData.ts             # Portfolio data contracts
│   ├── utils/emailLinks.ts               # Gmail composer link utilities
│   └── utils/soundEffects.ts             # Synthesized sci-fi audio feedback
├── PYTHON_GUIDE.md                       # 📘 Python developer's guide & TS translation cheat sheet
├── server.ts                             # Fullstack Express & Vite dev server
└── package.json                          # Node.js dependencies
🛠️ Quick Start & Installation
Option A: Running the Python Backend (backend_python/)
The Python backend can run with standard library only (no pip packages needed) or with FastAPI:
code
Bash

# 1. Navigate to the Python backend directory
cd backend_python

# 2. Run immediately using Python's built-in HTTP server:
python3 app.py
Server will start on http://localhost:8000 with full CORS support.
To run with FastAPI & Uvicorn:
code
Bash
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
Option B: Running the Fullstack React Application
code
Bash
# 1. Install Node.js dependencies
npm install

# 2. Start the development server (runs Vite + Express backend)
npm run dev
Open http://localhost:3000 in your browser.
To create an optimized production build:
code
Bash
npm run build
📬 Contact & Inquiries
Direct Email: saiprakashkulkarni494@gmail.com (Opens Gmail with recipient pre-filled)
LinkedIn: linkedin.com/in/saiprakash-kulkarni
GitHub: github.com/saiprakashkulkarni1111
Location: Bengaluru, Karnataka, India

# 🐍 Python Developer's Architecture & Translation Guide

Welcome! As a Python engineer, here is everything you need to know about this codebase.

---

## 1. Why is Frontend Code in TypeScript and Backend Code in Python?

* **Web Browsers (Chrome, Safari, Firefox, Edge)** natively execute HTML, CSS, and JavaScript/TypeScript. They cannot directly execute Python inside the user's browser tab.
* **Server Logic, AI Models & NLP Pipelines**: All backend APIs, SBERT models, Bi-LSTM hydrological forecasts, and database logic are written in **pure Python** inside the `backend_python/` folder.

---

## 2. Python Backend & Research Models (`/backend_python`)

A complete, production-ready Python backend has been built for you in `/backend_python`:

| Python File | Description |
| :--- | :--- |
| **`backend_python/app.py`** | REST API server implementing `/api/health`, `/api/transmit`, `/api/chat`, and research endpoints. Works out-of-the-box with Python's built-in `http.server` (zero pip dependencies needed) and supports FastAPI! |
| **`backend_python/email_service.py`** | URL generator for Gmail web compose and native `mailto:` links with **`saiprakashkulkarni494@gmail.com`** pre-filled. |
| **`backend_python/portfolio_data.py`** | All portfolio biography, education, research publication data, and skill matrices as Python dataclasses and dictionaries. |
| **`backend_python/research_models/upi_recipient_verifier.py`** | Complete Python algorithm for the SBERT & Cosine Similarity UPI fraud prevention research. |
| **`backend_python/research_models/flood_warning_mhews.py`** | Hydrological surge forecasting model (Bi-LSTM + XGBoost false-alarm filter). |
| **`backend_python/research_models/kisan_mitra_ai.py`** | Quantized MobileNet leaf pathology and Kannada voice advisory pipeline. |

### How to Run the Python Server
To start the Python backend locally:
```bash
python3 backend_python/app.py
```
It starts an HTTP server at `http://localhost:8000` with CORS enabled.

---

## 3. Python ⇄ TypeScript Rosetta Stone (Cheat Sheet)

You don't need to fear TypeScript! Here is how every TypeScript concept translates directly to Python:

### 1. Variables & Constants
```typescript
// TypeScript
const name: string = "Saiprakash";
let count: number = 42;
```
```python
# Python
name: str = "Saiprakash"
count: int = 42
```

### 2. Dictionaries / Objects
```typescript
// TypeScript
const contact = {
  email: "saiprakashkulkarni494@gmail.com",
  phone: "+91-9731127157"
};
console.log(contact.email);
```
```python
# Python
contact = {
  "email": "saiprakashkulkarni494@gmail.com",
  "phone": "+91-9731127157"
}
print(contact["email"])
```

### 3. Data Classes / Schemas (Interfaces)
```typescript
// TypeScript (src/types.ts)
interface Project {
  title: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
}
```
```python
# Python (backend_python/portfolio_data.py)
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class Project:
    title: str
    technologies: List[str]
    metrics: List[Dict[str, str]]
```

### 4. Functions & Arrow Functions
```typescript
// TypeScript
const getGreeting = (name: string): string => {
  return `Hello, ${name}!`;
};
```
```python
# Python
def get_greeting(name: str) -> str:
    return f"Hello, {name}!"
```

### 5. List Comprehensions vs `.map()` and `.filter()`
```typescript
// TypeScript
const names = projects.map(p => p.title);
const aiProjects = projects.filter(p => p.category.includes("AI"));
```
```python
# Python
names = [p.title for p in projects]
ai_projects = [p for p in projects if "AI" in p.category]
```

### 6. Async / Await & API Fetch
```typescript
// TypeScript
async function sendData(payload) {
  const response = await fetch("/api/transmit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return data;
}
```
```python
# Python (using requests or httpx)
import requests

def send_data(payload: dict) -> dict:
    response = requests.post("/api/transmit", json=payload)
    return response.json()
```

### 7. React Components (HTML in functions)
In React, a component is simply a Python-like function that returns HTML/UI tags:
```typescript
// A React component is just a function that accepts dictionary arguments ('props')
// and returns the HTML layout!
export const Header = ({ title }: { title: string }) => {
  return <h1 className="text-xl font-bold">{title}</h1>;
};
```
In Python, this is identical to a function returning an HTML string or Jinja template:
```python
def render_header(title: str) -> str:
    return f'<h1 class="text-xl font-bold">{title}</h1>'
```

---

## 4. Key Email Destination
Whenever a visitor sends an email or opens Gmail from anywhere in the application, the destination is configured to:
**`saiprakashkulkarni494@gmail.com`**
This is enforced in both:
- `backend_python/email_service.py` (Python)
- `src/utils/emailLinks.ts` (TypeScript)

📄 License
This project is open-source and available under the MIT License.

