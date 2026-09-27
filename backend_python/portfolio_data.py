"""
Saiprakash Kulkarni Portfolio Data (Python Dataclasses & Models)
Contains personal info, research publication details, projects, skills, and certifications.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class PersonalInfo:
    name: str = "Saiprakash Kulkarni"
    role: str = "AI & Machine Learning Engineer"
    sub_role: str = "Applied Deep Learning & NLP Researcher"
    location: str = "Bengaluru, India"
    tagline: str = "Architecting intelligent security verification layers, predictive environmental telemetry, and scalable rural AI solutions."
    status: str = "OPEN TO AI/ML ROLES & RESEARCH COLLABORATIONS"
    bio: str = (
        "Final year Artificial Intelligence & Machine Learning engineer at Sri Sairam College of Engineering, "
        "Bengaluru. Author & Lead Researcher of an innovative SBERT-based UPI impersonation defense framework. "
        "Experienced in building end-to-end deep learning pipelines, from time-series IoT flood prediction to "
        "low-bandwidth rural agro-vision platforms."
    )
    email: str = "saiprakashkulkarni494@gmail.com"
    phone: str = "+91-9731127157"
    linkedin: str = "https://www.linkedin.com/in/saiprakash-kulkarni/"
    github: str = "https://github.com/saiprakashkulkarni1111"


@dataclass
class Publication:
    title: str = "Enhancing UPI Security Through Intelligent Recipient Verification"
    role: str = "Lead Researcher & Author"
    date: str = "April 2026"
    location: str = "Bengaluru, India"
    status: str = "Peer-Reviewed / Lead Author"
    abstract: str = (
        "An algorithmic intelligence and behavioural friction architecture designed to neutralize sophisticated UPI impersonation, "
        "typo-squatting, and cross-lingual social engineering attacks. Employs SBERT semantic embeddings with Cosine Similarity "
        "alongside passive device fingerprinting to impose dynamic cognitive friction on high-risk financial transfers, "
        "directly addressing RBI cybersecurity guidelines."
    )
    highlights: List[str] = field(default_factory=lambda: [
        "Proposed an Intelligent UPI ID Verification Layer integrating SBERT embeddings and Cosine Similarity for cross-lingual VPA impersonation detection.",
        "Designed a Risk-Based Authentication (RBA) framework utilizing passive device fingerprinting to impose dynamic friction on high-risk transactions.",
        "Combined algorithmic intelligence and UX-based inhibitive attractors to disrupt social engineering at scale, directly aligning with RBI mandates."
    ])
    tags: List[str] = field(default_factory=lambda: [
        "SBERT", "NLP", "Cosine Similarity", "Risk-Based Authentication (RBA)", "UPI Security", "Device Fingerprinting", "FinTech AI"
    ])


@dataclass
class Project:
    id: str
    title: str
    category: str
    timeline: str
    technologies: List[str]
    tagline: str
    metrics: List[Dict[str, str]]
    bullet_points: List[str]
    system_overview: str


PERSONAL_INFO = PersonalInfo()
PUBLICATION_DATA = Publication()

PROJECTS_DATA: List[Project] = [
    Project(
        id="kisan-mitra",
        title="Kisan Mitra (AI-Integrated Platform)",
        category="Agro-AI & Multilingual NLP",
        timeline="June 2025 – July 2025",
        technologies=["Python", "GCP", "Computer Vision", "Kannada NLP", "PyTorch", "TTS/STT", "FastAPI"],
        tagline="End-to-end rural farming AI platform featuring Computer Vision disease diagnosis and native Kannada voice intelligence.",
        metrics=[
            {"label": "Bandwidth Optimized", "value": "< 120 KB"},
            {"label": "Voice Latency", "value": "< 450 ms"},
            {"label": "Detection Accuracy", "value": "94.2%"},
            {"label": "Deployment", "value": "Google Cloud Platform"}
        ],
        bullet_points=[
            "Built an end-to-end AI platform for smallholder farmers providing CV-based disease detection, multilingual voice interaction (TTS - STT), and real-time market intelligence.",
            "Built a multi-source API ingestion pipeline with schema validation; deployed on GCP to ensure low-bandwidth, multilingual rural access."
        ],
        system_overview="Designed specifically for accessibility in agrarian regions with patchy connectivity. Combines lightweight quantized vision models for instant on-field crop diagnosis with a bidirectional Kannada speech pipeline and live mandi market price streams."
    ),
    Project(
        id="mhews-flood",
        title="Smart Flood Early Warning System (MHEWS)",
        category="IoT & Predictive Deep Learning",
        timeline="Jan 2026 – Feb 2026",
        technologies=["Bi-LSTM", "XGBoost", "Python", "Pandas", "Scikit-Learn", "IoT Telemetry"],
        tagline="Multi-basin hydrological telemetry with 6-24 hour predictive horizon and ensemble false-alarm filtering.",
        metrics=[
            {"label": "Prediction Accuracy", "value": "95.0%"},
            {"label": "False-Alarm Reduction", "value": "90.0%"},
            {"label": "Alert SLA", "value": "< 5 min"},
            {"label": "Prediction Horizon", "value": "6–24 hrs"}
        ],
        bullet_points=[
            "Engineered a Multi-Hazard Early Warning System using Bidirectional LSTM networks to forecast river basin surge levels up to 24 hours in advance with 95% accuracy.",
            "Integrated XGBoost ensemble filters to discard noisy ultrasonic sensor artifacts, slashing spurious civilian panic alerts by 90%."
        ],
        system_overview="High-frequency telemetry pipeline integrating river discharge gauges, rainfall radar grids, and upstream reservoir release schedules to provide civil defense authorities with actionable early evacuation windows."
    )
]

SKILLS_DATA: Dict[str, List[Dict[str, Any]]] = {
    "Machine Learning & AI": [
        {"name": "PyTorch", "level": 90},
        {"name": "SBERT & Semantic NLP", "level": 92},
        {"name": "OpenCV & Computer Vision", "level": 88},
        {"name": "Scikit-learn & XGBoost", "level": 92},
        {"name": "Bi-LSTM & Time-Series", "level": 91},
        {"name": "LLM Prompt Engineering (Gemini / Claude)", "level": 94},
    ],
    "Languages & Frameworks": [
        {"name": "Python 3.x", "level": 95},
        {"name": "FastAPI / Flask", "level": 90},
        {"name": "SQL & MySQL", "level": 88},
        {"name": "Java (OOP)", "level": 82},
        {"name": "HTML5 / CSS3", "level": 86},
    ],
    "Data & Cloud": [
        {"name": "Pandas & NumPy", "level": 94},
        {"name": "Google Cloud Platform (Cloud Run)", "level": 86},
        {"name": "Tableau & Power BI", "level": 85},
        {"name": "Git & GitHub CI/CD", "level": 90},
    ]
}

if __name__ == "__main__":
    print(f"Loaded portfolio for: {PERSONAL_INFO.name}")
    print(f"Owner Email: {PERSONAL_INFO.email}")
    print(f"Publication: {PUBLICATION_DATA.title}")
    print(f"Total Projects: {len(PROJECTS_DATA)}")
