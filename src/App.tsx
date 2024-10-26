import { useState } from 'react';
import { SensorDataProcessor } from './components/SensorDataProcessor';
import { DetectionMap } from './components/DetectionMap';

interface Location {
  lat: number;
  lng: number;
  confidence: number;
}

function App() {
  const [detections] = useState<Location[]>([
    { lat: 0.2, lng: 0.3, confidence: 0.8 },
    { lat: 0.5, lng: 0.6, confidence: 0.6 },
    { lat: 0.7, lng: 0.4, confidence: 0.9 }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">CSSR Body Detection System</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SensorDataProcessor />
          <DetectionMap detections={detections} />
        </div>
      </main>
    </div>
  );
}

export default App;