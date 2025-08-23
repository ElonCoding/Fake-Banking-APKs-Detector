from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class Permission(BaseModel):
    name: str
    reason: Optional[str] = None
    severity: Literal["low", "med", "high"] = "low"

class NetworkIndicator(BaseModel):
    host: str
    type: str
    flagged: bool = False

class MLBreakdown(BaseModel):
    label: str
    score: int

class Certificate(BaseModel):
    subject: str
    issuer: str
    validFrom: Optional[str] = None
    validTo: Optional[str] = None
    mismatch: bool = False

class Meta(BaseModel):
    packageName: str
    appLabel: str
    versionName: Optional[str] = None
    versionCode: Optional[int] = None
    fileSize: Optional[int] = None
    sha256: Optional[str] = None
    signerCN: Optional[str] = None
    signerOrg: Optional[str] = None
    certificateValid: bool = True

class Evidence(BaseModel):
    permissions: List[Permission] = Field(default_factory=list)
    manifestFindings: List[str] = Field(default_factory=list)
    networkIndicators: List[NetworkIndicator] = Field(default_factory=list)
    strings: List[str] = Field(default_factory=list)
    certificate: Certificate
    mlBreakdown: List[MLBreakdown] = Field(default_factory=list)
    iocs: List[str] = Field(default_factory=list)

class AnalysisResult(BaseModel):
    meta: Meta
    verdict: Literal["benign", "suspicious", "malicious"]
    riskScore: int
    evidence: Evidence
