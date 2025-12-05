import type { Question } from '../types';

interface QuestionDisplayProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showFeedback: boolean;
  correctAnswer?: string;
}

/**
 * Component for displaying quiz questions with options
 * Requirements: 8.4
 */
export function QuestionDisplay({
  question,
  selectedAnswer,
  onAnswerSelect,
  showFeedback,
  correctAnswer,
}: QuestionDisplayProps) {
  const answerLabels = ['A', 'B', 'C', 'D'];
  const keyboardShortcuts = ['1', '2', '3', '4'];

  const getOptionStyle = (optionLabel: string) => {
    const isSelected = selectedAnswer === optionLabel;
    const isCorrect = showFeedback && correctAnswer === optionLabel;
    const isIncorrect = showFeedback && isSelected && selectedAnswer !== correctAnswer;

    if (isCorrect) {
      return 'border-green-500 bg-green-50';
    }
    if (isIncorrect) {
      return 'border-red-500 bg-red-50';
    }
    if (isSelected) {
      return 'border-blue-500 bg-blue-50';
    }
    return 'border-gray-200 hover:border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Context */}
      {question.context && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-800 mb-1">Context:</p>
          <p className="text-sm text-blue-900">{question.context}</p>
        </div>
      )}

      {/* Question */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {question.question}
        </h2>
      </div>

      {/* Options with keyboard shortcuts - Requirement 8.4 */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const optionLabel = answerLabels[idx];
          const keyboardKey = keyboardShortcuts[idx];

          return (
            <button
              key={idx}
              onClick={(e) => {
                onAnswerSelect(optionLabel);
                // Remove focus from button to allow keyboard navigation
                e.currentTarget.blur();
              }}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors disabled:cursor-not-allowed ${getOptionStyle(
                optionLabel
              )}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {/* Requirement 8.4: Display keyboard shortcuts with each option */}
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded font-mono text-sm font-semibold">
                    {optionLabel}
                  </span>
                  <span className="ml-1 text-xs text-gray-500">
                    ({keyboardKey})
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{option}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Keyboard shortcuts legend */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <span className="font-semibold">Keyboard shortcuts:</span> Press{' '}
          <span className="font-mono bg-gray-200 px-1 rounded">1-4</span> or{' '}
          <span className="font-mono bg-gray-200 px-1 rounded">A-D</span> to select an answer
        </p>
      </div>
    </div>
  );
}
