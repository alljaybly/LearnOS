import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { QuizResult, QuizQuestion } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

const QuizResultCard: React.FC<{ result: QuizResult }> = ({ result }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const scorePercentage = (result.score / result.total) * 100;
  
    const getBorderColor = () => {
      if (scorePercentage >= 80) return 'border-green-500';
      if (scorePercentage >= 50) return 'border-yellow-500';
      return 'border-red-500';
    };

    const isCorrect = (question: QuizQuestion, index: number) => {
        return result.userAnswers[index]?.toLowerCase() === question.answer.toLowerCase();
    }
  
    return (
      <div className={`bg-surface rounded-xl shadow-md transition-all border-l-4 ${getBorderColor()}`}>
        <div className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg text-gray-800">{result.studyGuideTitle}</p>
              <p className="text-sm text-gray-500">{new Date(result.date).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{result.score}/{result.total}</p>
              <p className="text-sm font-semibold">{scorePercentage.toFixed(0)}%</p>
            </div>
          </div>
        </div>
        {isExpanded && (
          <div className="border-t p-4 sm:p-6 space-y-4 bg-gray-50/50">
            <h4 className="font-semibold text-md">Quiz Review</h4>
            {result.quiz.map((question, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border">
                <div className="flex items-start gap-3">
                  {isCorrect(question, index) ? <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" /> : <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />}
                  <div>
                    <p className="font-medium">{question.question.replace('___', ' [BLANK] ')}</p>
                    <p className="text-sm mt-1">Your answer: <span className={`font-semibold ${isCorrect(question, index) ? 'text-green-700' : 'text-red-700'}`}>{result.userAnswers[index] || 'Not answered'}</span></p>
                    {!isCorrect(question, index) && <p className="text-sm mt-1">Correct answer: <span className="font-semibold text-green-700">{question.answer}</span></p>}
                    <div className="prose prose-sm max-w-none text-gray-600 mt-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.explanation}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
};
  
export const ProgressAnalytics: React.FC<{ progressHistory: QuizResult[] }> = ({ progressHistory }) => {
    if (progressHistory.length === 0) {
      return (
        <div className="text-center p-8 bg-surface rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-700">No History Yet</h2>
          <p className="mt-2 text-gray-500">Complete your first study session quiz to track your progress here!</p>
        </div>
      );
    }
  
    const totalQuizzes = progressHistory.length;
    const averageScore = progressHistory.reduce((sum, result) => sum + (result.score / result.total), 0) / totalQuizzes * 100;
  
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Progress Analytics</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-surface p-6 rounded-xl shadow-md text-center">
            <p className="text-gray-600">Total Quizzes Taken</p>
            <p className="text-4xl font-bold text-primary mt-1">{totalQuizzes}</p>
          </div>
          <div className="bg-surface p-6 rounded-xl shadow-md text-center">
            <p className="text-gray-600">Average Score</p>
            <p className="text-4xl font-bold text-primary mt-1">{isNaN(averageScore) ? 'N/A' : `${averageScore.toFixed(0)}%`}</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">Quiz History</h2>
        <div className="space-y-4">
          {progressHistory.map((result, index) => (
            <QuizResultCard key={index} result={result} />
          ))}
        </div>
      </div>
    );
};
