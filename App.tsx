import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { StudySession } from './components/StudySession';
import { OcrStudyPlanner } from './components/OcrStudyPlanner';
import { generateStudyGuideAndQuiz, generateQuiz } from './services/geminiService';
import { isSharedData, type QuizQuestion, type StudyGuide, type View, type QuizResult } from './types';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>('dashboard');
  const [studyGuide, setStudyGuide] = useState<StudyGuide | null>(null);
  const [studyMaterial, setStudyMaterial] = useState<string>('');
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressHistory, setProgressHistory] = useState<QuizResult[]>([]);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
    }
  };

  useEffect(() => {
    // Check for shared data in URL hash on initial load
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/view/')) {
        try {
          const encodedData = hash.substring(7);
          const decodedJson = atob(encodedData);
          const sharedData = JSON.parse(decodedJson);

          if (isSharedData(sharedData)) {
            setStudyGuide(sharedData.guide);
            setStudyMaterial(sharedData.material);
            setQuiz(null); // Quiz needs to be generated on demand
            setView('study');
          } else {
             console.warn("Invalid data structure in URL hash.");
          }
        } catch (err) {
          console.error("Failed to parse shared data from URL hash:", err);
        } finally {
            // Clean up the URL
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };

    handleHashChange(); // Check on initial load
    // Although we clear it, this listener is good practice if we add more complex hash routing
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStartSession = async (material: string) => {
    setIsLoading(true);
    setError(null);
    setStudyGuide(null);
    setQuiz(null);
    setStudyMaterial('');
    setView('dashboard'); 
    try {
      const { studyGuide, quiz } = await generateStudyGuideAndQuiz(material);
      setStudyGuide(studyGuide);
      setQuiz(quiz);
      setStudyMaterial(material);
      setView('study');
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to generate study guide: ${err.message}`);
      } else {
        setError('An unknown error occurred while generating the study guide.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!studyMaterial) {
      setError("Cannot generate quiz without the original study material.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const newQuiz = await generateQuiz(studyMaterial);
        setQuiz(newQuiz);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to generate quiz: ${err.message}`);
      } else {
        setError('An unknown error occurred while generating the quiz.');
      }
    } finally {
        setIsLoading(false);
    }
  };

  const handleQuizComplete = (score: number, total: number, userAnswers: Record<number, string>) => {
    if (!quiz || !studyGuide) return;
    const newResult: QuizResult = {
      studyGuideTitle: studyGuide.title,
      score,
      total,
      userAnswers,
      quiz,
      date: new Date().toISOString(),
    };
    setProgressHistory(prev => [newResult, ...prev]);
    setView('progress');
  };

  const renderContent = () => {
    if (isLoading) {
      const message = currentView === 'study' && !quiz 
        ? "Generating your quiz..." 
        : "Generating your personalized study guide... this may take a moment.";
      return <Loader message={message} />;
    }
    
    const dashboardWithError = (
        <>
            <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg mb-8">
                <p><strong>Oops! Something went wrong.</strong></p>
                <p>{error}</p>
            </div>
            <Dashboard onStartSession={handleStartSession} />
        </>
    );

    if (error && currentView === 'dashboard') {
        return dashboardWithError;
    }

    switch (currentView) {
      case 'ocr':
        return <OcrStudyPlanner />;
      case 'study':
        if (studyGuide && studyMaterial) {
          return (
            <StudySession 
              studyGuide={studyGuide} 
              material={studyMaterial}
              quiz={quiz} 
              onQuizComplete={handleQuizComplete}
              onGenerateQuiz={handleGenerateQuiz}
            />
          );
        }
        // Fallback if state is inconsistent
        setView('dashboard');
        return <Dashboard onStartSession={handleStartSession} />;
      case 'progress':
        return <ProgressAnalytics progressHistory={progressHistory} />;
      case 'dashboard':
      default:
        return <Dashboard onStartSession={handleStartSession} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 pb-20 md:pb-0">
      <Header currentView={currentView} setView={setView} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      {installPrompt && (
        <button onClick={handleInstall} className="install-btn">
          📱 Install LearnOS
        </button>
      )}
    </div>
  );
};

export default App;