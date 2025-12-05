import { useState, useEffect, useRef } from 'react';
import type { Question } from '../types';
import { useQuizState } from '../hooks/useQuizState';
import { QuestionDisplay } from './QuestionDisplay';
import { FeedbackPanel } from './FeedbackPanel';
import { Timer } from './Timer';
import { ResultsPanel } from './ResultsPanel';
import { AIAssistButton } from './AIAssistButton';

interface QuizAppProps {
  questions: Question[];
  mode: 'practice' | 'test';
  onRestart: () => void;
}

/**
 * Root component for quiz functionality
 * Requirements: 3.2, 3.3, 3.4
 */
export function QuizApp({ questions, mode, onRestart }: QuizAppProps) {
  const {
    state,
    recordAnswer,
    goToNext,
    goToPrevious,
    showFeedback,
    completeQuiz,
    updateTimer,
  } = useQuizState(questions, mode);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const userAnswer = state.userAnswers.get(state.currentQuestionIndex);
  const isCurrentQuestionSubmitted = submittedQuestions.has(state.currentQuestionIndex);

  // Automatically show feedback for submitted questions when navigating back
  useEffect(() => {
    if (isCurrentQuestionSubmitted && !state.showFeedback && mode === 'practice') {
      showFeedback();
    }
  }, [state.currentQuestionIndex, isCurrentQuestionSubmitted, state.showFeedback, mode, showFeedback]);

  // Focus the container when component mounts to enable keyboard navigation
  useEffect(() => {
    if (containerRef.current && state.mode !== 'results') {
      containerRef.current.focus();
    }
  }, [state.currentQuestionIndex, state.mode]);

  // Ensure container regains focus after button clicks
  const handleContainerClick = () => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const handleAnswerSelect = (answer: string) => {
    // Don't allow changing answer after submission
    if (isCurrentQuestionSubmitted) {
      return;
    }
    recordAnswer(answer);
  };

  const handleSubmit = () => {
    // Mark current question as submitted
    setSubmittedQuestions(prev => new Set(prev).add(state.currentQuestionIndex));
    
    if (mode === 'practice') {
      // Show feedback immediately in practice mode
      showFeedback();
      setScrollPosition(0);
    } else {
      // In test mode, record answer and move to next
      if (state.currentQuestionIndex < state.questions.length - 1) {
        goToNext();
      } else {
        // Show results when all questions answered
        completeQuiz();
      }
    }
  };

  const handleTimerExpire = () => {
    // Requirement 5.5: Auto-submit when timer expires
    completeQuiz();
  };

  const handleNext = () => {
    // Don't allow navigation if no answer selected and no feedback showing
    if (!userAnswer && !state.showFeedback) {
      return;
    }
    
    if (state.showFeedback) {
      // Two-step navigation - feedback then next
      goToNext();
      setScrollPosition(0);
    } else {
      handleSubmit();
    }
  };

  const handleScrollDown = () => {
    // Requirement 4.6: Scroll explanation down
    if (state.showFeedback) {
      setScrollPosition((prev) => prev + 50);
    }
  };

  const handleScrollUp = () => {
    // Requirement 4.6: Scroll explanation up
    if (state.showFeedback) {
      setScrollPosition((prev) => Math.max(0, prev - 50));
    }
  };

  // Enable keyboard navigation (only during quiz, not on results)
  // DISABLED: Using direct container listener instead to avoid conflicts
  // useKeyboardNavigation({
  //   onAnswerSelect: handleAnswerSelect,
  //   onNext: handleNext,
  //   onPrevious: goToPrevious,
  //   onScrollUp: handleScrollUp,
  //   onScrollDown: handleScrollDown,
  //   enabled: state.mode !== 'results',
  // });

  // Direct keyboard handler on container
  useEffect(() => {
    const container = containerRef.current;
    if (!container || state.mode === 'results') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Enter key to submit answer
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
        return;
      }
      
      // Arrow Right: Next question (if feedback is showing)
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (state.showFeedback) {
          goToNext();
          setScrollPosition(0);
        }
        return;
      }
      
      // Arrow Left: Previous question
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
        return;
      }
      
      // Arrow Up/Down: Scroll explanation (only when feedback is showing)
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (state.showFeedback) {
          handleScrollUp();
        }
        return;
      }
      
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (state.showFeedback) {
          handleScrollDown();
        }
        return;
      }
      
      // Now check answer selection keys
      const key = event.key.toUpperCase();
      
      // Number keys 1-4 for answer selection
      if (key >= '1' && key <= '4') {
        event.preventDefault();
        const answerIndex = parseInt(key) - 1;
        const answer = String.fromCharCode(65 + answerIndex); // Convert to A-D
        handleAnswerSelect(answer);
        return;
      }
      
      // Letter keys A-D for answer selection (single character only)
      if (key.length === 1 && key >= 'A' && key <= 'D') {
        event.preventDefault();
        handleAnswerSelect(key);
        return;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [state.mode, handleNext, goToPrevious, handleAnswerSelect, handleScrollUp, handleScrollDown]);

  // Show results panel when quiz is complete
  if (state.mode === 'results') {
    return (
      <ResultsPanel
        questions={state.questions}
        userAnswers={state.userAnswers}
        onRestart={onRestart}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8"
      tabIndex={0}
      onClick={handleContainerClick}
      style={{ outline: 'none' }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {mode === 'practice' ? 'Practice' : 'Test'} Mode
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Question {state.currentQuestionIndex + 1} of {state.questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Requirement 7.1, 7.7: AI Button on right-hand side */}
            <AIAssistButton
              question={currentQuestion}
              answer={currentQuestion.answer}
              onCopySuccess={() => {}}
            />
            
            {/* Requirement 5.1: Display timer in test mode */}
            {mode === 'test' && state.timer !== null && (
              <Timer
                duration={state.timer}
                onExpire={handleTimerExpire}
                onTick={updateTimer}
              />
            )}
          </div>
        </div>



        <QuestionDisplay
          question={currentQuestion}
          selectedAnswer={userAnswer || null}
          onAnswerSelect={handleAnswerSelect}
          showFeedback={state.showFeedback || isCurrentQuestionSubmitted}
          correctAnswer={state.showFeedback ? currentQuestion.answer : undefined}
        />

        {state.showFeedback && mode === 'practice' && (
          <FeedbackPanel
            isCorrect={userAnswer === currentQuestion.answer}
            explanation={currentQuestion.explanation}
            correctAnswer={currentQuestion.answer}
            scrollPosition={scrollPosition}
            onScroll={(direction) => {
              if (direction === 'down') handleScrollDown();
              else handleScrollUp();
            }}
          />
        )}

        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={() => {
              goToPrevious();
              // Return focus to container after button click
              setTimeout(() => containerRef.current?.focus(), 0);
            }}
            disabled={state.currentQuestionIndex === 0}
            aria-label="Previous question"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 dark:text-gray-200 rounded-lg transition-all font-medium transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            ← Previous
          </button>
          <button
            onClick={() => {
              handleNext();
              // Return focus to container after button click
              setTimeout(() => containerRef.current?.focus(), 0);
            }}
            disabled={!userAnswer && !state.showFeedback}
            aria-label={state.showFeedback ? 'Next question' : 'Submit answer'}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-900 text-white rounded-lg transition-all font-medium transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
          >
            {state.showFeedback ? 'Next →' : 'Submit Answer'}
          </button>
        </div>

        <button
          onClick={(e) => {
            onRestart();
            e.currentTarget.blur();
          }}
          className="mt-4 w-full px-6 py-2 bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
}
