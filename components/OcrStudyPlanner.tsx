import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import type { StudyPlan } from '../types';
import { CameraIcon, SparklesIcon } from './icons';
import { Loader } from './Loader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Dummy OCR'd text for demonstration
const sampleOcrText = `Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations. The devices that perform quantum computations are known as quantum computers. They are believed to be able to solve certain computational problems, such as integer factorization (which underlies RSA encryption), substantially faster than classical computers. The study of quantum computing is a subfield of quantum information science.

There are several models of quantum computation, including the quantum circuit model, the quantum Turing machine, the adiabatic quantum computer, the one-way quantum computer, and various quantum cellular automata. The most widely used model is the quantum circuit, based on the quantum bit, or "qubit," which is somewhat analogous to the bit in classical computation. A qubit can be a 1 or a 0, or a superposition of both.`;

export const OcrStudyPlanner: React.FC = () => {
    const [ocrText, setOcrText] = useState('');
    const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = async () => {
        if (!ocrText.trim()) {
            setError("Please provide some text to generate a study plan from.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setStudyPlan(null);
        try {
            const plan = await generateStudyPlan(ocrText);
            setStudyPlan(plan);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate study plan: ${errorMessage}`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleImageUpload = () => {
        // In a real app, this would open a file picker or camera.
        // For this demo, we'll just populate the textarea with sample text.
        setOcrText(sampleOcrText);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Photo Study Planner</h1>
                <p className="mt-4 text-lg text-gray-600">Snap a picture of your textbook or notes, and we'll create a study plan for you.</p>
            </div>

            {studyPlan ? (
                <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-primary mb-2">{studyPlan.title}</h2>
                    <p className="text-gray-600 mb-6"><strong>Total Estimated Time:</strong> {studyPlan.totalEstimatedTime}</p>
                    <div className="space-y-6">
                        {studyPlan.sessions.map((session) => (
                            <div key={session.day} className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary">
                                <h3 className="text-xl font-semibold">Day {session.day}: {session.topic}</h3>
                                <p className="text-sm text-gray-500 mb-2">Est. Time: {session.estimatedTime}</p>
                                <strong className="block text-gray-700 mb-1">Objectives:</strong>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {session.objectives.map((obj, i) => (
                                        <li key={i}>{obj}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                     <button
                        onClick={() => setStudyPlan(null)}
                        className="mt-8 w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-600 text-on-primary font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-all"
                    >
                        Create Another Plan
                    </button>
                </div>
            ) : (
                <div className="bg-surface p-6 rounded-xl shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                         <button
                            onClick={handleImageUpload}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105"
                         >
                            <CameraIcon />
                            Upload or Scan Photo
                        </button>
                        <p className="text-sm text-gray-500">
                            (For this demo, clicking will load sample text)
                        </p>
                    </div>
                    <textarea
                        value={ocrText}
                        onChange={(e) => setOcrText(e.target.value)}
                        placeholder="Your scanned text will appear here... or you can paste it directly."
                        className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-y"
                    />

                    {error && (
                        <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="mt-4">
                            <Loader message="Generating your study plan..." />
                        </div>
                    ) : (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleGeneratePlan}
                                disabled={!ocrText.trim() || isLoading}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all"
                            >
                                <SparklesIcon />
                                Generate Plan
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
