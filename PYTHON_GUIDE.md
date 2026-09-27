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
