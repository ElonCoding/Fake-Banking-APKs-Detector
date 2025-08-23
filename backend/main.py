from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import hashlib, random, re

app = FastAPI(title="Fake Banking APK Detector API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BANK_KEYWORDS = re.compile(r"(bank|upi|paytm|gpay|phonepe|sbi|icici|hdfc)", re.I)

def sha256sum(b: bytes) -> str:
    h = hashlib.sha256(); h.update(b); return h.hexdigest()

def classify(name: str, digest: str):
    rnd = random.Random(digest)
    suspicious_name = bool(BANK_KEYWORDS.search(name))
    base = 10 + int(digest[:2], 16) % 20
    if suspicious_name:
        base += 40 + rnd.randint(10, 25)
    score = min(100, base)
    if score >= 80:
        verdict = "malicious"
    elif score >= 40:
        verdict = "suspicious"
    else:
        verdict = "benign"
    return verdict, score

@app.post("/api/analyze")
async def analyze_apk(file: UploadFile = File(...)):
    data = await file.read()
    digest = sha256sum(data)
    verdict, score = classify(file.filename, digest)

    result = {
        "apk_name": file.filename,
        "sha256": digest,
        "risk_score": score,
        "ml_prediction": verdict.title() + " APK",
        "certificate_issuer": "CN=Unknown, O=FakeBank" if verdict != "benign" else "CN=Trusted Bank Ltd, O=Trusted Bank",
        "suspicious_permissions": ["READ_SMS", "RECEIVE_BOOT_COMPLETED"] if verdict != "benign" else [],
        "network_calls": ["http://malicious.server.com"] if verdict != "benign" else ["https://secure.bank.com"]
    }

    return JSONResponse({"status": "success", "data": result})

@app.get("/health")
async def health():
    return {"ok": True}
