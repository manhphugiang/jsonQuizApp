import { describe, it, expect } from 'vitest';
import type { Question, QuizState, NavigationState } from './types';

describe('TypeScript Interfaces', () => {
  it('should create a valid Question object', () => {
    const question: Question = {
      question: 'What is 2 + 2?',
      answer: 'A',
      explanation: 'Basic arithmetic',
      options: ['4', '5', '6', '7'],
      context: 'Math basics'
    };

    expect(question.question).toBe('What is 2 + 2?');
    expect(question.options).toHaveLength(4);
  });

  it('should create a valid QuizState object', () => {
    const quizState: QuizState = {
      mode: 'selection',
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: new Map(),
      showFeedback: false,
      timer: null,
      score: null
    };

    expect(quizState.mode).toBe('selection');
    expect(quizState.userAnswers).toBeInstanceOf(Map);
  });

  it('should create a valid NavigationState object', () => {
    const navState: NavigationState = {
      canGoNext: true,
      canGoPrev: false,
      feedbackStep: null
    };

    expect(navState.canGoNext).toBe(true);
    expect(navState.canGoPrev).toBe(false);
  });
});
