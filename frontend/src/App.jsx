import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function ApkDetector() {
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [apkFile, setApkFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [detectionResult, setDetectionResult] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setApkFile(file);
      setFileName(file.name);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScanApp = async () => {
    if (!appIcon) {
      setError('Please upload an APK file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', apkFile);

      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze APK');
      }

      const result = await response.json();
      
      setDetectionResult({
        isFake: result.data.risk_score >= 80,
        unverified: result.data.risk_score >= 40,
        permissionsCheck: result.data.suspicious_permissions.length > 0,
        sslCertificate: result.data.network_calls.some(call => call.includes('malicious')),
        appStoreAuthenticity: result.data.risk_score < 40,
        trustScore: 100 - result.data.risk_score,
        apkName: result.data.apk_name,
        sha256: result.data.sha256,
        mlPrediction: result.data.ml_prediction,
        certificateIssuer: result.data.certificate_issuer,
        suspiciousPermissions: result.data.suspicious_permissions,
        networkCalls: result.data.network_calls
      });
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the APK');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>
      <Card className="w-full max-w-4xl glass-card">
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg p-6 flex items-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 mr-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <div>
            <CardTitle className="text-2xl font-bold">Fake Banking App Detector</CardTitle>
            <p className="text-sm">Check if this app is genuine before you trust it.</p>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">App Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="appName" className="text-white font-medium">App Name</Label>
                <Input
                  id="appName"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Enter app name"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50"
                />
              </div>
              <div>
                <Label htmlFor="packageName" className="text-white font-medium">Package Name / URL</Label>
                <Input
                  id="packageName"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="Enter package name or URL"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50"
                />
              </div>
              <div>
                <Label htmlFor="appIcon" className="text-white font-medium mb-2 block">Upload APK File</Label>
                <label htmlFor="appIcon" className={`flex flex-col items-center justify-center w-full ${fileName ? 'h-24' : 'h-32'} border-2 ${fileName ? 'border-green-400' : 'border-white/30'} ${fileName ? 'border-solid' : 'border-dashed'} rounded-lg cursor-pointer ${fileName ? 'bg-green-500/20' : 'bg-white/10'} hover:bg-white/20 backdrop-blur-sm transition-colors`}>
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    {fileName ? (
                      <>
                        <svg className="w-8 h-8 mb-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-sm text-green-300 font-medium">✓ {fileName}</p>
                        <p className="text-xs text-white/70 mt-1">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-10 h-10 mb-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-white"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-white/70">APK files only</p>
                      </>
                    )}
                  </div>
                  <Input 
                    id="appIcon" 
                    type="file" 
                    onChange={handleFileChange} 
                    accept=".apk"
                    className="hidden"
                  />
                </label>
              </div>
              <Button 
                onClick={handleScanApp} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? 'Scanning...' : 'Scan App'}
              </Button>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </div>
          </div>

          {detectionResult && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>APK Name:</strong> {detectionResult.apkName}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>SHA256:</strong> {detectionResult.sha256.substring(0, 16)}...
                </div>
                <div className="text-sm">
                  <strong>ML Prediction:</strong> 
                  <span className={detectionResult.isFake ? 'text-red-600' : 'text-green-600'}>
                    {detectionResult.mlPrediction}
                  </span>
                </div>
                <div className="text-sm">
                  <strong>Certificate:</strong> {detectionResult.certificateIssuer}
                </div>
                
                {detectionResult.suspiciousPermissions.length > 0 && (
                  <div>
                    <strong className="text-sm">Suspicious Permissions:</strong>
                    <ul className="text-sm text-red-600 mt-1">
                      {detectionResult.suspiciousPermissions.map((perm, idx) => (
                        <li key={idx}>• {perm}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {detectionResult.networkCalls.length > 0 && (
                  <div>
                    <strong className="text-sm">Network Calls:</strong>
                    <ul className="text-sm mt-1">
                      {detectionResult.networkCalls.map((call, idx) => (
                        <li key={idx} className={call.includes('malicious') ? 'text-red-600' : 'text-green-600'}>
                          • {call}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Trust Score</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                  <div
                    className={`h-2.5 rounded-full ${
                      detectionResult.trustScore >= 80 ? 'bg-green-500' : 
                      detectionResult.trustScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${detectionResult.trustScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Trust Score: {detectionResult.trustScore}%</p>
              </div>
            </div>
          )}
        </CardContent>
        {detectionResult && (
          <div className={`border-l-4 p-4 mt-4 rounded-b-lg ${
            detectionResult.isFake 
              ? 'bg-red-100 border-red-500 text-red-700' 
              : detectionResult.unverified
              ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
              : 'bg-green-100 border-green-500 text-green-700'
          }`}>
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="font-bold">This App Might Be Fraudulent!</p>
            </div>
            <p className="text-sm mb-2">
              {detectionResult.isFake 
                ? "This app has been identified as a fake banking application. Do not install or provide any personal information. Report it immediately."
                : detectionResult.unverified 
                ? "This app appears suspicious. Exercise caution and verify authenticity before installation."
                : "This app appears to be legitimate. However, always verify with official sources before installation."
              }
            </p>
            <ul className="list-disc list-inside text-sm">
              <li>Do not enter sensitive details</li>
              <li>Download only from official stores</li>
            </ul>
            <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
              Report This App
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ApkDetector;
