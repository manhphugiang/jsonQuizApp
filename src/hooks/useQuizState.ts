import { useState, useCallback } from 'react';
import type { Question, QuizState } from '../types';

/**
 * Custom hook for managing quiz state
 * Requirements: 3.2, 3.3, 3.4
 */
export function useQuizState(questions: Question[], mode: 'practice' | 'test') {
  const [state, setState] = useState<QuizState>({
    mode,
    questions,
    currentQuestionIndex: 0,
    userAnswers: new Map<number, string>(),
    showFeedback: false,
    timer: mode === 'test' ? questions.length * 60 : null, // 1 minute per question for test mode
    score: null,
  });

  // Requirement 3.4: Prevent mode changes after quiz has started
  const canChangeMode = state.currentQuestionIndex === 0 && 
                        (state.timer === null || state.timer === questions.length * 60);

  // Record answer for current question
  const recordAnswer = useCallback((answer: string) => {
    setState(prev => {
      const newAnswers = new Map(prev.userAnswers);
      newAnswers.set(prev.currentQuestionIndex, answer);
      return {
        ...prev,
        userAnswers: newAnswers,
      };
    });
  }, []);

  // Navigate to next question
  const goToNext = useCallback(() => {
    setState(prev => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          showFeedback: false,
        };
      }
      return prev;
    });
  }, []);

  // Navigate to previous question
  const goToPrevious = useCallback(() => {
    setState(prev => {
      if (prev.currentQuestionIndex > 0) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
          showFeedback: false,
        };
      }
      return prev;
    });
  }, []);

  // Show feedback (for practice mode)
  const showFeedback = useCallback(() => {
    setState(prev => ({
      ...prev,
      showFeedback: true,
    }));
  }, []);

  // Hide feedback
  const hideFeedback = useCallback(() => {
    setState(prev => ({
      ...prev,
      showFeedback: false,
    }));
  }, []);

  // Update timer
  const updateTimer = useCallback((newTime: number) => {
    setState(prev => ({
      ...prev,
      timer: newTime,
    }));
  }, []);

  // Complete quiz and calculate score
  const completeQuiz = useCallback(() => {
    setState(prev => {
      let correctCount = 0;
      prev.questions.forEach((question, index) => {
        const userAnswer = prev.userAnswers.get(index);
        if (userAnswer === question.answer) {
          correctCount++;
        }
      });

      return {
        ...prev,
        mode: 'results',
        score: (correctCount / prev.questions.length) * 100,
      };
    });
  }, []);

  return {
    state,
    canChangeMode,
    recordAnswer,
    goToNext,
    goToPrevious,
    showFeedback,
    hideFeedback,
    updateTimer,
    completeQuiz,
  };
}
