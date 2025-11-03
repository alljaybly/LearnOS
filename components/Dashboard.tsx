
import React, { useState } from 'react';
import { SparklesIcon } from './icons';

interface DashboardProps {
  onStartSession: (material: string) => void;
}

const sampleText = `The Krebs cycle, also known as the citric acid cycle, is a series of chemical reactions used by all aerobic organisms to release stored energy through the oxidation of acetyl-CoA derived from carbohydrates, fats, and proteins. In eukaryotes, the Krebs cycle occurs in the matrix of the mitochondrion. The cycle consumes acetate (in the form of acetyl-CoA) and water, reduces NAD+ to NADH, and produces carbon dioxide. The NADH is then used by the oxidative phosphorylation pathway to generate ATP, the main energy currency of the cell.`;

export const Dashboard: React.FC<DashboardProps> = ({ onStartSession }) => {
  const [material, setMaterial] = useState('');

  const handleStart = () => {
    if (material.trim()) {
      onStartSession(material);
    }
  };
  
  const useSampleText = () => {
    setMaterial(sampleText);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Welcome to LearnOS</h1>
        <p className="mt-4 text-lg text-gray-600">Your personal AI-powered study companion. Paste your notes, an article, or any text to begin.</p>
      </div>
      
      <div className="bg-surface p-6 rounded-xl shadow-lg">
        <textarea
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="Paste your study material here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-y"
        />
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button 
            onClick={useSampleText}
            className="text-sm text-primary hover:underline"
          >
            Or try with a sample text
          </button>
          <button
            onClick={handleStart}
            disabled={!material.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            <SparklesIcon />
            Generate Study Guide
          </button>
        </div>
      </div>
    </div>
  );
};
