
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { StudyGuide, QuizQuestion, SharedData } from '../types';
import { Quiz } from './Quiz';
import { BookOpenIcon, CheckCircleIcon, LinkIcon, CopyIcon, SparklesIcon } from './icons';

interface StudySessionProps {
  studyGuide: StudyGuide;
  material: string;
  quiz: QuizQuestion[] | null;
  onQuizComplete: (score: number, total: number, userAnswers: Record<number, string>) => void;
  onGenerateQuiz: () => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ studyGuide, material, quiz, onQuizComplete, onGenerateQuiz }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [copiedVisualAidIndex, setCopiedVisualAidIndex] = useState<number | null>(null);

  const handleShare = async () => {
    const sharedData: SharedData = {
      guide: studyGuide,
      material: material
    };
    
    const jsonString = JSON.stringify(sharedData);
    const encodedData = btoa(jsonString);
    const url = `${window.location.origin}${window.location.pathname}#/view/${encodedData}`;

    try {
      await navigator.clipboard.writeText(url);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link to clipboard:', error);
      alert('Failed to copy link.');
    }
  };

  const handleCopyVisualAid = async (text: string, index: number) => {
    try {
        await navigator.clipboard.writeText(text);
        setCopiedVisualAidIndex(index);
        setTimeout(() => setCopiedVisualAidIndex(null), 2000);
    } catch (error) {
        console.error('Failed to copy visual aid:', error);
        alert('Failed to copy visual aid.');
    }
  };

  if (showQuiz && quiz) {
    return <Quiz questions={quiz} onQuizComplete={onQuizComplete} />;
  }
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{studyGuide.title}</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Summary</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{studyGuide.summary}</ReactMarkdown>
          
          <h2 className="text-2xl font-semibold border-b pb-2 my-6">Key Concepts</h2>
          <ul className="space-y-4 not-prose">
            {studyGuide.keyConcepts.map((concept, index) => {
              const isCopied = copiedVisualAidIndex === index;
              return (
                <li key={index} className="bg-gray-50 p-4 rounded-lg">
                  <strong className="block text-primary text-lg mb-1">{concept.concept}</strong>
                  <div className="prose max-w-none text-gray-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{concept.explanation}</ReactMarkdown>
                  </div>
                  {concept.visualAid && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-semibold text-gray-600">Visual Aid:</h4>
                         <button
                          onClick={() => handleCopyVisualAid(concept.visualAid!, index)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            isCopied
                              ? 'text-green-600 font-semibold'
                              : 'text-gray-500 hover:text-primary'
                          }`}
                          disabled={isCopied}
                         >
                          <CopyIcon className="h-4 w-4" />
                          {isCopied ? 'Copied!' : 'Copy'}
                         </button>
                      </div>
                      <pre className="bg-gray-200 text-gray-800 p-3 rounded-md text-sm whitespace-pre-wrap font-mono">
                        {concept.visualAid}
                      </pre>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-700 transition-all transform hover:scale-105"
            >
                <LinkIcon />
                {isLinkCopied ? 'Link Copied!' : 'Share'}
            </button>
            {quiz ? (
                <button
                    onClick={() => setShowQuiz(true)}
                    className="inline-flex items-center gap-2 bg-secondary text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105"
                >
                    <CheckCircleIcon />
                    Ready to Test Your Knowledge?
                </button>
            ) : (
                <button
                    onClick={onGenerateQuiz}
                    className="inline-flex items-center gap-2 bg-primary text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105"
                >
                    <SparklesIcon />
                    Generate Quiz
                </button>
            )}
        </div>
      </div>
    </div>
  );
};