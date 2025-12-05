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
    canChangeMode,
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
      console.log('Answer already submitted for this question, ignoring change');
      return;
    }
    console.log('handleAnswerSelect called with:', answer);
    recordAnswer(answer);
    console.log('After recordAnswer, userAnswer is:', state.userAnswers.get(state.currentQuestionIndex));
  };

  const handleSubmit = () => {
    console.log('handleSubmit called');
    console.log('mode:', mode);
    
    if (mode === 'practice') {
      // Requirement 4.1: Show feedback immediately in practice mode
      console.log('Showing feedback');
      showFeedback();
      setScrollPosition(0);
    } else {
      // Requirement 5.3: In test mode, record answer and move to next
      if (state.currentQuestionIndex < state.questions.length - 1) {
        goToNext();
      } else {
        // Requirement 5.4: Show results when all questions answered
        completeQuiz();
      }
    }
  };

  const handleTimerExpire = () => {
    // Requirement 5.5: Auto-submit when timer expires
    completeQuiz();
  };

  const handleNext = () => {
    console.log('handleNext called');
    console.log('showFeedback:', state.showFeedback);
    console.log('userAnswer:', userAnswer);
    console.log('mode:', mode);
    
    // Don't allow navigation if no answer selected and no feedback showing
    if (!userAnswer && !state.showFeedback) {
      console.log('Cannot proceed - no answer selected');
      return;
    }
    
    if (state.showFeedback) {
      // Requirement 4.5: Two-step navigation - feedback then next
      console.log('Moving to next question');
      goToNext();
      setScrollPosition(0);
    } else {
      console.log('Calling handleSubmit');
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
      console.log('DIRECT handler - Key:', event.key);
      
      // Enter key to submit answer
      if (event.key === 'Enter') {
        event.preventDefault();
        console.log('DIRECT - Enter pressed, submitting answer');
        handleSubmit();
        return;
      }
      
      // Arrow Right: Next question (if feedback is showing)
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (state.showFeedback) {
          console.log('DIRECT - Arrow Right: Going to next question');
          goToNext();
          setScrollPosition(0);
        } else {
          console.log('DIRECT - Arrow Right: No feedback showing, ignoring');
        }
        return;
      }
      
      // Arrow Left: Previous question
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        console.log('DIRECT - Arrow Left: Going to previous question');
        goToPrevious();
        return;
      }
      
      // Arrow Up/Down: Scroll explanation (only when feedback is showing)
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (state.showFeedback) {
          console.log('DIRECT - Scrolling up');
          handleScrollUp();
        }
        return;
      }
      
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (state.showFeedback) {
          console.log('DIRECT - Scrolling down');
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
        console.log('DIRECT - Selecting answer:', answer);
        handleAnswerSelect(answer);
        return;
      }
      
      // Letter keys A-D for answer selection (single character only)
      if (key.length === 1 && key >= 'A' && key <= 'D') {
        event.preventDefault();
        console.log('DIRECT - Selecting answer:', key);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div 
        ref={containerRef}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8 transform transition-all"
        tabIndex={0}
        onClick={handleContainerClick}
        style={{ outline: 'none' }}
      >
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {mode === 'practice' ? 'Practice' : 'Test'} Mode
            </h1>
            <p className="text-sm text-gray-600 mt-1">
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

        {!canChangeMode && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              Mode is locked once quiz has started (Requirement 3.4)
            </p>
          </div>
        )}

        <QuestionDisplay
          question={currentQuestion}
          selectedAnswer={userAnswer || null}
          onAnswerSelect={handleAnswerSelect}
          showFeedback={state.showFeedback}
          correctAnswer={state.showFeedback ? currentQuestion.answer : undefined}
        />

        {state.showFeedback && mode === 'practice' && (
          <>
            {console.log('Feedback - userAnswer:', userAnswer, 'correctAnswer:', currentQuestion.answer, 'isCorrect:', userAnswer === currentQuestion.answer)}
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
          </>
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
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-all font-medium transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300"
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
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-all font-medium transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {state.showFeedback ? 'Next →' : 'Submit Answer'}
          </button>
        </div>

        <button
          onClick={(e) => {
            onRestart();
            e.currentTarget.blur();
          }}
          className="mt-4 w-full px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
}
