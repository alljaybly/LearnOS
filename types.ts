export interface KeyConcept {
  concept: string;
  explanation: string;
  visualAid: string;
}

export interface StudyGuide {
  title: string;
  summary: string;
  keyConcepts: KeyConcept[];
}

export interface QuizQuestion {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  options?: string[];
  answer: string;
  explanation: string;
}

export type View = 'dashboard' | 'study' | 'progress' | 'ocr';

export interface QuizResult {
  studyGuideTitle: string;
  score: number;
  total: number;
  date: string; // ISO string
  userAnswers: Record<number, string>;
  quiz: QuizQuestion[];
}

export interface SharedData {
  guide: StudyGuide;
  material: string;
}

// New types for Study Plan feature
export interface StudyPlanSession {
  day: number;
  topic: string;
  objectives: string[];
  estimatedTime: string; // e.g., "45 minutes"
}

export interface StudyPlan {
  title: string;
  totalEstimatedTime: string;
  sessions: StudyPlanSession[];
}


export function isSharedData(obj: unknown): obj is SharedData {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const data = obj as Partial<SharedData>;
  
  return (
    typeof data.guide === 'object' &&
    data.guide !== null &&
    typeof (data.guide as StudyGuide).title === 'string' &&
    typeof (data.guide as StudyGuide).summary === 'string' &&
    Array.isArray((data.guide as StudyGuide).keyConcepts) &&
    typeof data.material === 'string'
  );
}