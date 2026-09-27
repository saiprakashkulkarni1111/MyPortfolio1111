"""
Email & Gmail Link Generator (Python Implementation)
Target Recipient: saiprakashkulkarni494@gmail.com

This module constructs URL links for Gmail web and RFC mailto URI schemes.
Important: In Gmail query strings, keeping literal '@' prevents Gmail's compose
interface from discarding the recipient address.
"""

import urllib.parse
from typing import Optional

OWNER_EMAIL: str = "saiprakashkulkarni494@gmail.com"

def get_gmail_compose_url(
    to: Optional[str] = None,
    subject: Optional[str] = None,
    body: Optional[str] = None
) -> str:
    """
    Constructs a direct Gmail web compose URL.
    Ensures recipient is populated in 'To:' by default.
    """
    recipient = (to or OWNER_EMAIL).strip()
    
    params = [
        ("view", "cm"),
        ("fs", "1"),
        ("to", recipient)  # Note: literal '@' is preserved for Gmail's parser
    ]
    
    query_parts = [f"view=cm&fs=1&to={recipient}"]
    if subject:
        query_parts.append(f"su={urllib.parse.quote(subject)}")
    if body:
        query_parts.append(f"body={urllib.parse.quote(body)}")
        
    return f"https://mail.google.com/mail/?{'&'.join(query_parts)}"


def get_mailto_url(
    to: Optional[str] = None,
    subject: Optional[str] = None,
    body: Optional[str] = None
) -> str:
    """
    Constructs a standard mailto URI for native desktop or mobile email apps.
    """
    recipient = (to or OWNER_EMAIL).strip()
    query_items = []
    
    if subject:
        query_items.append(f"subject={urllib.parse.quote(subject)}")
    if body:
        query_items.append(f"body={urllib.parse.quote(body)}")
        
    query_string = f"?{'&'.join(query_items)}" if query_items else ""
    return f"mailto:{recipient}{query_string}"


if __name__ == "__main__":
    print("Testing Python Email Service:")
    print("Gmail Compose URL:")
    print(get_gmail_compose_url(subject="Test Inquiry", body="Hello Saiprakash!"))
    print("\nMailto URL:")
    print(get_mailto_url(subject="Test Inquiry", body="Hello Saiprakash!"))
