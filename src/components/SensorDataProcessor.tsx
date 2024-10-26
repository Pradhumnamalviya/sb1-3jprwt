import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SensorData {
  thermal: number[];
  gpr: number[];
  acoustic: number[];
  timestamp: number;
}

export const SensorDataProcessor = () => {
  const [predictions, setPredictions] = useState<number[]>([0.5, 0.6, 0.8, 0.7]);
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  useEffect(() => {
    initModel();
  }, []);

  const initModel = async () => {
    const m = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [3], units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });
    
    m.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
    
    setModel(m);
  };

  const processSensorData = async (data: SensorData) => {
    if (!model) return;

    const input = tf.tensor2d([
      [
        Math.max(...data.thermal),
        Math.max(...data.gpr),
        Math.max(...data.acoustic)
      ]
    ]);

    const prediction = await model.predict(input) as tf.Tensor;
    const predictionData = await prediction.data();
    setPredictions(prev => [...prev, predictionData[0]]);
  };

  const chartData = {
    labels: predictions.map((_, i) => `Reading ${i + 1}`),
    datasets: [
      {
        label: 'Detection Confidence',
        data: predictions,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Detection Confidence Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Sensor Data Analysis</h2>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};