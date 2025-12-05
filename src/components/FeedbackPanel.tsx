import { useRef, useEffect } from 'react';

interface FeedbackPanelProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
  scrollPosition: number;
  onScroll?: (direction: 'up' | 'down') => void;
}

/**
 * Component for displaying feedback in practice mode
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */
export function FeedbackPanel({
  isCorrect,
  explanation,
  correctAnswer,
  scrollPosition,
}: FeedbackPanelProps) {
  const explanationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (explanationRef.current) {
      explanationRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
      {/* Requirement 4.4: Highlight correctness */}
      <div className="mb-4">
        <p
          className={`text-lg font-bold ${
            isCorrect ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </p>
      </div>

      {/* Requirements 4.2: Show correct answer */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Correct Answer:
        </p>
        <p className="text-base text-gray-900 font-medium">{correctAnswer}</p>
      </div>

      {/* Requirements 4.3, 4.6: Show explanation with scrolling */}
      <div className="mb-2">
        <p className="text-sm font-semibold text-gray-700 mb-2">Explanation:</p>
        <div
          ref={explanationRef}
          className="text-sm text-gray-800 max-h-48 overflow-y-auto p-3 bg-white rounded border border-gray-200"
        >
          {explanation}
        </div>
      </div>

      {/* Requirement 4.6: Scrolling instructions */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
        <p>
          Use <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded">↑↓</span> to
          scroll explanation
        </p>
        <p>
          Press <span className="font-mono bg-gray-200 px-1.5 py-0.5 rounded">→</span> to
          continue
        </p>
      </div>
    </div>
  );
}
