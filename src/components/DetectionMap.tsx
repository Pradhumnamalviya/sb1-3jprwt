import { useEffect, useRef } from 'react';

interface Location {
  lat: number;
  lng: number;
  confidence: number;
}

interface DetectionMapProps {
  detections: Location[];
}

export const DetectionMap = ({ detections }: DetectionMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    const gridSize = rect.width / 10;
    
    for (let i = 0; i <= rect.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, rect.height);
      ctx.stroke();
    }
    
    for (let i = 0; i <= rect.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(rect.width, i);
      ctx.stroke();
    }

    // Draw detection points
    detections.forEach(detection => {
      const x = detection.lng * rect.width;
      const y = detection.lat * rect.height;
      
      // Draw detection circle
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(239, 68, 68, ${detection.confidence})`;
      ctx.fill();
      
      // Draw outer ring
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.stroke();
    });
  }, [detections]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">Detection Map</h3>
      <div className="border rounded aspect-square">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};