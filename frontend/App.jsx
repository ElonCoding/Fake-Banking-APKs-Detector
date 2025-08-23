import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function ApkDetector() { {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center p-6 font-mono">
      <h1 className="text-3xl font-bold mb-4 text-green-500">{'>>'} FAKE BANKING APK DETECTOR _</h1>
      <Card className="w-full max-w-xl border-green-500 bg-gray-900">
        <CardContent className="flex flex-col gap-4 p-6">
          <input
            type="file"
            accept=".apk"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-green-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-green-500 file:text-white
            hover:file:bg-green-600"
          />
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? "Analyzing..." : "Analyze APK"}
          </Button>
          {result && (
            <div className="mt-4 bg-gray-800 rounded-xl shadow-lg p-4 border border-green-500">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-green-400 mb-2">
                <ShieldCheck className="text-green-500" />
                <span className="text-green-500">Analysis Report</span>
              </h2>
              <p className="text-green-400"><b>APK Name:</b> {result.apk_name}</p>
              <p className="text-green-400"><b>SHA256:</b> {result.sha256}</p>
              <p className="text-green-400"><b>Risk Score:</b> <span className="text-red-500">{result.risk_score}%</span></p>
              <p className="text-green-400"><b>ML Prediction:</b> {result.ml_prediction}</p>
              <p className="text-green-400"><b>Certificate Issuer:</b> {result.certificate_issuer}</p>
              <p className="text-green-400"><b>Suspicious Permissions:</b> {result.suspicious_permissions.join(", ")}</p>
              <p className="text-green-400"><b>Network Calls:</b> {result.network_calls.join(", ")}</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}}
