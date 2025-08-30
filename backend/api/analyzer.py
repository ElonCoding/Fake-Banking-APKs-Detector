from __future__ import annotations
from typing import Tuple
import hashlib, random, re
from datetime import date
from schemas import AnalysisResult, Meta, Evidence, Permission, NetworkIndicator, Certificate, MLBreakdown

BANK_KEYWORDS = re.compile(r"(bank|upi|paytm|gpay|phonepe|sbi|icici|hdfc)", re.I)

HIGH_PERMS = [
    Permission(name="READ_SMS", reason="OTP harvesting", severity="high"),
    Permission(name="RECEIVE_SMS", reason="Intercept OTP", severity="high"),
    Permission(name="BIND_ACCESSIBILITY_SERVICE", reason="Overlay/auto-click", severity="high"),
]
MED_PERMS = [
    Permission(name="READ_CONTACTS", severity="med"),
    Permission(name="READ_PHONE_STATE", severity="med"),
]

def sha256sum(b: bytes) -> str:
    h = hashlib.sha256(); h.update(b); return h.hexdigest()

def classify(name: str, digest: str) -> Tuple[str, int]:
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

def analyze(file_name: str, content: bytes) -> AnalysisResult:
    digest = sha256sum(content)
    verdict, score = classify(file_name, digest)

    pkg = f"com.fake.{re.sub(r'[^a-z0-9]+', '', file_name.split('.')[0].lower()) or 'app'}"
    cert_mismatch = verdict != "benign"

    ml_parts = [
        ("Permissions", int(score * 0.35)),
        ("Manifest", int(score * 0.15)),
        ("Network", int(score * 0.30)),
        ("Certificate", int(score * 0.20)),
    ]

    result = AnalysisResult(
        meta=Meta(
            packageName=pkg,
            appLabel=file_name,
            versionName="1.0.0",
            versionCode=1,
            fileSize=len(content),
            sha256=digest,
            signerCN="Unknown" if cert_mismatch else "Trusted Bank Ltd",
            signerOrg="-" if cert_mismatch else "Trusted Bank",
            certificateValid=not cert_mismatch,
        ),
        verdict=verdict, riskScore=score,
        evidence=Evidence(
            permissions=(HIGH_PERMS if verdict == "malicious" else []) + MED_PERMS,
            manifestFindings=(
                [
                    "Launchable activity mimics com.bank.app",
                    "Uses QUERY_ALL_PACKAGES",
                    "Requests overlay windows",
                ] if verdict != "benign" else ["No dangerous components exported"]
            ),
            networkIndicators=[
                NetworkIndicator(host="api.example.bank-login.co", type="domain", flagged=verdict != "benign"),
                NetworkIndicator(host="192.0.2.10", type="ip", flagged=False),
            ],
            strings=(
                ["/otp/submit", "x-telemetry", "/inject.html", "phish_template_v2"] if verdict != "benign" else ["/legal", "/privacy"]
            ),
            certificate=Certificate(
                subject=("CN=Unknown, O=-" if cert_mismatch else "CN=Trusted Bank Ltd, O=Trusted Bank"),
                issuer=("CN=Self-Signed" if cert_mismatch else "CN=Android, O=Google"),
                validFrom=str(date(2024,1,1)),
                validTo=str(date(2027,1,1)),
                mismatch=cert_mismatch,
            ),
            mlBreakdown=[MLBreakdown(label=l, score=s) for l, s in ml_parts],
            iocs=(
                [
                    "sha256:deadbeef...1234",
                    "domain:bank-login-secure[.]co",
                    "url:https://bank-login-secure.co/update.apk",
                ] if verdict != "benign" else []
            ),
        ),
    )
    return result
