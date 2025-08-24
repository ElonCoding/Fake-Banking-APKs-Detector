import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function ApkDetector() {
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [appIcon, setAppIcon] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setAppIcon(event.target.files[0]);
    }
  };

  const handleScanApp = () => {
    // This is where you would typically send data to your backend
    // For now, let's simulate a detection result
    setDetectionResult({
      isFake: true,
      unverified: true,
      permissionsCheck: true,
      sslCertificate: true,
      appStoreAuthenticity: true,
      trustScore: 25,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="bg-red-500 text-white rounded-t-lg p-4 flex items-center">
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
                <Label htmlFor="appName">App Name</Label>
                <Input
                  id="appName"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="App Name"
                />
              </div>
              <div>
                <Label htmlFor="packageName">Package Name / URL</Label>
                <Input
                  id="packageName"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="Package Name / URL"
                />
              </div>
              <div>
                <Label htmlFor="appIcon">Upload App Icon (optional)</Label>
                <Input id="appIcon" type="file" onChange={handleFileChange} />
              </div>
              <Button onClick={handleScanApp} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Scan App
              </Button>
            </div>
          </div>

          {detectionResult && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Fake App Detected!</span>
                </div>
                <div className="flex items-center text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Unverified</span>
                </div>
                <div className="flex items-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Permissions Check</span>
                </div>
                <div className="flex items-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>SSL Certificate</span>
                </div>
                <div className="flex items-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>App Store Authenticity</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Trust Score</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: `${detectionResult.trustScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Trust Score: {detectionResult.trustScore}%</p>
              </div>
            </div>
          )}
        </CardContent>
        {detectionResult && detectionResult.isFake && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded-b-lg">
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
