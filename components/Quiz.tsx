import React, { useState, useMemo } from 'react';
import type { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onQuizComplete: (score: number, total: number, answers: Record<number, string>) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };
  
  const score = useMemo(() => {
    return questions.reduce((acc, question, index) => {
      return userAnswers[index]?.toLowerCase() === question.answer.toLowerCase() ? acc + 1 : acc;
    }, 0);
  }, [questions, userAnswers]);

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswer = userAnswers[currentQuestionIndex];
    const isCorrect = isSubmitted && userAnswer?.toLowerCase() === question.answer.toLowerCase();

    const getOptionClasses = (option: string) => {
        if (!isSubmitted) {
            return userAnswer === option ? 'bg-primary text-on-primary ring-2 ring-primary' : 'bg-white hover:bg-gray-50';
        }
        if (option === question.answer) {
            return 'bg-green-100 text-green-800 ring-2 ring-green-500';
        }
        if (option === userAnswer) {
            return 'bg-red-100 text-red-800 ring-2 ring-red-500';
        }
        return 'bg-white';
    };

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, i) => (
              <button key={i} onClick={() => handleAnswerSelect(option)} className={`w-full text-left p-4 rounded-lg border transition-all ${getOptionClasses(option)}`} disabled={isSubmitted}>
                {option}
              </button>
            ))}
          </div>
        );
      case 'true-false':
        return (
          <div className="flex gap-4">
            {['True', 'False'].map(option => (
              <button key={option} onClick={() => handleAnswerSelect(option)} className={`w-full p-4 rounded-lg border transition-all ${getOptionClasses(option)}`} disabled={isSubmitted}>
                {option}
              </button>
            ))}
          </div>
        );
      case 'fill-in-blank':
        return <input type="text" value={userAnswer || ''} onChange={(e) => handleAnswerSelect(e.target.value)} placeholder="Type your answer" className="w-full p-4 border rounded-lg" disabled={isSubmitted} />;
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl text-gray-700 mb-2">Your score:</p>
        <p className="text-5xl font-bold text-primary mb-6">{score} / {questions.length}</p>
        <button onClick={() => onQuizComplete(score, questions.length, userAnswers)} className="bg-primary text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all">
          View Progress
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-surface p-6 sm:p-8 rounded-xl shadow-lg">
      <div className="mb-4">
        <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h2 className="text-2xl font-semibold mt-1">{currentQuestion.question.replace('___', ' [BLANK] ')}</h2>
      </div>
      
      <div className="my-6">
        {renderQuestion(currentQuestion)}
      </div>

      {isSubmitted && (
         <div className={`p-4 rounded-lg my-4 ${userAnswers[currentQuestionIndex]?.toLowerCase() === currentQuestion.answer.toLowerCase() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-bold">Correct Answer: {currentQuestion.answer}</p>
            <p>{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button onClick={handleBack} disabled={currentQuestionIndex === 0} className="px-4 py-2 border rounded-lg disabled:opacity-50">Back</button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button onClick={handleSubmit} className="bg-secondary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-600">Submit Quiz</button>
        ) : (
          <button onClick={handleNext} className="bg-primary text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700">Next</button>
        )}
      </div>
    </div>
  );
};
