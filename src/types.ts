/**
 * Core data structure for a quiz question
 */
export interface Question {
  question: string;
  answer: string;
  explanation: string;
  options: string[];
  context: string;
}

/**
 * Overall state of the quiz application
 */
export interface QuizState {
  mode: 'selection' | 'practice' | 'test' | 'results';
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Map<number, string>;
  showFeedback: boolean;
  timer: number | null;
  score: number | null;
}

/**
 * Navigation state for controlling quiz flow
 */
export interface NavigationState {
  canGoNext: boolean;
  canGoPrev: boolean;
  feedbackStep: 'answer' | 'explanation' | null;
}
