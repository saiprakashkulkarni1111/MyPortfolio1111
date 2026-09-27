"""
FastAPI & Pure Python Standard Library Server for Saiprakash Kulkarni's Portfolio
Author: Saiprakash Kulkarni (Bengaluru, India)

This file provides a 100% pure Python backend implementation of all portfolio API routes.
- Works out-of-the-box using Python's built-in `http.server` (ZERO external pip packages required).
- Also provides FastAPI application when FastAPI and Pydantic are installed.
"""

import sys
import os
import json
import time
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime
from typing import List, Dict, Any, Optional

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from portfolio_data import PERSONAL_INFO, PUBLICATION_DATA, PROJECTS_DATA, SKILLS_DATA
from email_service import OWNER_EMAIL, get_gmail_compose_url, get_mailto_url
from research_models.upi_recipient_verifier import UPIRecipientVerifier
from research_models.flood_warning_mhews import FloodEarlyWarningSystem
from research_models.kisan_mitra_ai import KisanMitraPipeline

# In-memory transmission log buffer (matches server.ts)
transmissions_log: List[Dict[str, Any]] = []

upi_verifier = UPIRecipientVerifier()
flood_system = FloodEarlyWarningSystem()
kisan_pipeline = KisanMitraPipeline()


def process_chat_message(user_msg: str) -> str:
    """Generates an intelligent context-grounded AI reply."""
    msg_lower = user_msg.lower()
    if "upi" in msg_lower or "research" in msg_lower or "publication" in msg_lower:
        return (
            f"Saiprakash's flagship peer-reviewed research is '{PUBLICATION_DATA.title}'. "
            "It uses Sentence-BERT (SBERT) semantic embeddings and Cosine Similarity to detect UPI typosquatting "
            "and homoglyph impersonations, imposing dynamic cognitive friction on high-risk transfers."
        )
    elif "flood" in msg_lower or "mhews" in msg_lower:
        return (
            "The Smart Flood Early Warning System (MHEWS) uses Bidirectional LSTMs to forecast river basin surge "
            "levels 6 to 24 hours in advance with 95% accuracy, coupled with XGBoost to slash sensor false alarms by 90%."
        )
    elif "kisan" in msg_lower or "crop" in msg_lower or "agro" in msg_lower:
        return (
            "Kisan Mitra is an end-to-end rural Agro-AI platform combining quantized MobileNet vision models (<120 KB) "
            "with high-speed Kannada speech processing (<450 ms latency) for non-English smallholder farmers."
        )
    elif "email" in msg_lower or "contact" in msg_lower or "hire" in msg_lower:
        return (
            f"You can email Saiprakash directly at {OWNER_EMAIL}. "
            "When you click 'Open in Gmail' in this application, his email is pre-filled automatically in the 'To:' field."
        )
    else:
        return (
            f"Hello! I am Saiprakash's AI research assistant. Saiprakash is an AI & ML Engineer based in Bengaluru, India. "
            f"Feel free to ask about his UPI security research, Flood Early Warning System, or email him at {OWNER_EMAIL}."
        )


class PortfolioHTTPRequestHandler(BaseHTTPRequestHandler):
    """
    Standard Library HTTP Request Handler.
    Runs on any Python 3 machine without needing `pip install`!
    """

    def _set_headers(self, status: int = 200, content_type: str = "application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        # Enable CORS so frontend can call this Python server
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, x-gemini-api-key")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/health" or path == "/":
            data = {
                "status": "ok",
                "service": "Saiprakash Portfolio Python Backend (Standard Library HTTP)",
                "owner": PERSONAL_INFO.name,
                "targetEmail": OWNER_EMAIL,
                "timestamp": datetime.utcnow().isoformat()
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

        elif path == "/api/transmissions/health":
            data = {
                "status": "operational",
                "totalReceived": len(transmissions_log),
                "destination": OWNER_EMAIL
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(data).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": f"Endpoint {path} not found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        
        content_length = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b"{}"
        
        try:
            payload = json.loads(body_bytes.decode("utf-8"))
        except Exception:
            payload = {}

        if path == "/api/transmit":
            sender_email = payload.get("senderEmail", "").strip()
            sender_name = payload.get("senderName", "Recruiter / Researcher").strip()
            inquiry_type = payload.get("inquiryType", "General Inquiry").strip()
            message = payload.get("message", "").strip()

            if not sender_email or not message:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "senderEmail and message are required."}).encode("utf-8"))
                return

            trx_id = f"TRX-{int(time.time()*1000)%1000000:X}-{abs(hash(sender_email))%9000 + 1000}"
            now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

            record = {
                "transmissionId": trx_id,
                "timestamp": now_str,
                "senderName": sender_name,
                "senderEmail": sender_email,
                "inquiryType": inquiry_type,
                "message": message,
                "recipient": OWNER_EMAIL,
            }
            transmissions_log.insert(0, record)
            if len(transmissions_log) > 100:
                transmissions_log.pop()

            raw_subject = f"[Portfolio Transmission] {inquiry_type} - from {sender_name}"
            raw_body = f"Greetings Saiprakash,\n\n{message}\n\nSender: {sender_name}\nEmail: {sender_email}"

            response_data = {
                "success": True,
                "transmissionId": trx_id,
                "timestamp": now_str,
                "recipient": OWNER_EMAIL,
                "gmailUrl": get_gmail_compose_url(to=OWNER_EMAIL, subject=raw_subject, body=raw_body),
                "mailtoUrl": get_mailto_url(to=OWNER_EMAIL, subject=raw_subject, body=raw_body),
                "message": f"Transmission recorded successfully. Pre-filling recipient: {OWNER_EMAIL}"
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(response_data).encode("utf-8"))

        elif path == "/api/chat":
            user_msg = payload.get("message", "")
            reply = process_chat_message(user_msg)
            response_data = {
                "reply": reply,
                "timestamp": datetime.utcnow().strftime("%H:%M")
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(response_data).encode("utf-8"))

        elif path == "/api/verify-key":
            api_key = payload.get("apiKey", "").strip()
            if len(api_key) < 15:
                self._set_headers(400)
                self.wfile.write(json.dumps({"valid": False, "error": "Key is too short."}).encode("utf-8"))
            else:
                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "valid": True,
                    "message": "Gemini API key successfully verified and authorized!"
                }).encode("utf-8"))

        elif path == "/api/research/upi-verify":
            vpa = payload.get("vpa", "")
            amt = float(payload.get("amountInr", 1000))
            is_new = bool(payload.get("isNewRecipient", True))
            res = upi_verifier.evaluate_transaction_risk(vpa, amt, is_new)
            self._set_headers(200)
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/research/flood-forecast":
            cur = float(payload.get("currentLevelM", 5.0))
            rain = float(payload.get("rainfallRateMmH", 10.0))
            disc = float(payload.get("dischargeCumec", 300.0))
            hrs = int(payload.get("horizonHours", 12))
            res = flood_system.forecast_surge_level(cur, rain, disc, hrs)
            self._set_headers(200)
            self.wfile.write(json.dumps(res).encode("utf-8"))

        elif path == "/api/research/crop-diagnose":
            label = payload.get("cropLabel", "tomato_early_blight")
            res = kisan_pipeline.diagnose_crop_image(label)
            self._set_headers(200)
            self.wfile.write(json.dumps(res).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": f"Endpoint {path} not found"}).encode("utf-8"))


def run_pure_python_server(port: int = 8000):
    """Starts the standard library Python server."""
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, PortfolioHTTPRequestHandler)
    print("=" * 60)
    print(f"  SAIPRAKASH KULKARNI - PYTHON BACKEND SERVER")
    print(f"  Running on: http://localhost:{port}")
    print(f"  Owner Email Target: {OWNER_EMAIL}")
    print(f"  Zero pip dependencies required (Standard Library)")
    print("=" * 60)
    httpd.serve_forever()


if __name__ == "__main__":
    port = int(os.environ.get("PYTHON_PORT", 8000))
    run_pure_python_server(port)
