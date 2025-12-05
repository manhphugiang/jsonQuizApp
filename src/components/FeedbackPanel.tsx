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
    <div className="mt-6 p-6 bg-white/20 dark:bg-black/20 rounded-lg border-2 border-white/30 dark:border-gray-500/30 backdrop-blur-sm">
      {/* Highlight correctness */}
      <div className="mb-4">
        <p
          className={`text-lg font-bold ${
            isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </p>
      </div>

      {/* Show correct answer */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Correct Answer:
        </p>
        <p className="text-base text-gray-900 dark:text-gray-100 font-medium">{correctAnswer}</p>
      </div>

      {/* Show explanation with scrolling */}
      <div className="mb-2">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Explanation:</p>
        <div
          ref={explanationRef}
          className="text-sm text-gray-800 dark:text-gray-200 max-h-48 overflow-y-auto p-3 bg-white/10 dark:bg-black/10 rounded border border-white/30 dark:border-gray-500/30 backdrop-blur-sm"
        >
          {explanation}
        </div>
      </div>

      {/* Scrolling instructions */}
      <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 mt-3">
        <p>
          Use <span className="font-mono bg-gray-800/20 dark:bg-white/20 px-1.5 py-0.5 rounded">↑↓</span> to
          scroll explanation
        </p>
        <p>
          Press <span className="font-mono bg-gray-800/20 dark:bg-white/20 px-1.5 py-0.5 rounded">→</span> to
          continue
        </p>
      </div>
    </div>
  );
}
