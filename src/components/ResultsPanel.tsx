import { useState } from 'react';
import type { Question } from '../types';

interface ResultsPanelProps {
  questions: Question[];
  userAnswers: Map<number, string>;
  onRestart: () => void;
}

/**
 * Component for displaying quiz results
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */
export function ResultsPanel({
  questions,
  userAnswers,
  onRestart,
}: ResultsPanelProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // Requirement 6.1: Calculate score
  const correctCount = questions.filter(
    (q, idx) => userAnswers.get(idx) === q.answer
  ).length;
  const score = (correctCount / questions.length) * 100;

  const selectedQ = selectedQuestion !== null ? questions[selectedQuestion] : null;
  const selectedAnswer = selectedQuestion !== null ? userAnswers.get(selectedQuestion) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Score Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
          
          {/* Requirement 6.1: Display percentage score */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold text-blue-600">
                {score.toFixed(1)}%
              </span>
              <span className="text-xl text-gray-600">
                ({correctCount} / {questions.length} correct)
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Take Another Quiz
            </button>
          </div>
        </div>

        {/* Question Review - Requirements 6.2, 6.3, 6.4 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Questions</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {questions.map((question, idx) => {
              const userAnswer = userAnswers.get(idx);
              const isCorrect = userAnswer === question.answer;
              const isSelected = selectedQuestion === idx;

              return (
                <div key={idx} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setSelectedQuestion(isSelected ? null : idx)}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Requirement 6.2: Show correctness indicator */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-1">
                          Question {idx + 1}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {question.question}
                        </p>
                      </div>

                      <div className="flex-shrink-0 text-gray-400">
                        {isSelected ? '▼' : '▶'}
                      </div>
                    </div>
                  </button>

                  {/* Requirement 6.3, 6.4: Show details when expanded */}
                  {isSelected && selectedQ && (
                    <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Question:
                        </p>
                        <p className="text-gray-800">{selectedQ.question}</p>
                      </div>

                      {selectedQ.context && (
                        <div className="mb-4 p-3 bg-blue-50 rounded">
                          <p className="text-sm font-semibold text-blue-800 mb-1">
                            Context:
                          </p>
                          <p className="text-sm text-blue-900">{selectedQ.context}</p>
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Your Answer:
                        </p>
                        <p
                          className={`font-medium ${
                            isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {selectedAnswer || 'Not answered'} -{' '}
                          {selectedQ.options[
                            selectedAnswer ? selectedAnswer.charCodeAt(0) - 65 : 0
                          ] || 'N/A'}
                        </p>
                      </div>

                      {/* Requirement 6.3: Show correct answer */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Correct Answer:
                        </p>
                        <p className="text-green-600 font-medium">
                          {selectedQ.answer} -{' '}
                          {selectedQ.options[selectedQ.answer.charCodeAt(0) - 65]}
                        </p>
                      </div>

                      {/* Requirement 6.3: Show explanation */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Explanation:
                        </p>
                        <p className="text-gray-800">{selectedQ.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
