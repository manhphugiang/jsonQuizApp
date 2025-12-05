interface ModeSelectorProps {
  onModeSelect: (mode: 'practice' | 'test') => void;
  questionCount: number;
}

/**
 * Component for selecting quiz mode (practice or test)
 * Requirements: 3.1, 3.2, 3.3, 3.5
 */
export function ModeSelector({ onModeSelect, questionCount }: ModeSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          Select Quiz Mode
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
          {questionCount} questions loaded
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Practice Mode */}
          <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-2 border-white/30 dark:border-gray-600 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">
              Practice Mode
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Learn at your own pace with immediate feedback after each question.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 dark:text-green-400 mr-2">✓</span>
                <span>Immediate feedback after each answer</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 dark:text-green-400 mr-2">✓</span>
                <span>See correct answers and explanations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 dark:text-green-400 mr-2">✓</span>
                <span>No time limit</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 dark:text-green-400 mr-2">✓</span>
                <span>Navigate freely between questions</span>
              </li>
            </ul>
            <button
              onClick={() => onModeSelect('practice')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Start Practice Mode
            </button>
          </div>

          {/* Test Mode */}
          <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-2 border-white/30 dark:border-gray-600 rounded-lg p-6 hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-3">
              Test Mode
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Simulate real exam conditions with timed assessment.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-purple-500 dark:text-purple-400 mr-2">⏱</span>
                <span>Timed quiz with countdown</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 dark:text-purple-400 mr-2">⏱</span>
                <span>No feedback until completion</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 dark:text-purple-400 mr-2">⏱</span>
                <span>Auto-submit when time expires</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 dark:text-purple-400 mr-2">⏱</span>
                <span>Results shown at the end</span>
              </li>
            </ul>
            <button
              onClick={() => onModeSelect('test')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Start Test Mode
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-white/30 dark:border-gray-600/30">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Keyboard Navigation:
          </h3>
          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
            <p><span className="font-mono bg-gray-800/20 dark:bg-white/20 px-2 py-1 rounded">1-4</span> or <span className="font-mono bg-gray-800/20 dark:bg-white/20 px-2 py-1 rounded">A-D</span> - Select answer</p>
            <p><span className="font-mono bg-gray-800/20 dark:bg-white/20 px-2 py-1 rounded">→</span> - Next question / Submit</p>
            <p><span className="font-mono bg-gray-800/20 dark:bg-white/20 px-2 py-1 rounded">←</span> - Previous question</p>
            <p><span className="font-mono bg-gray-800/20 dark:bg-white/20 px-2 py-1 rounded">↑↓</span> - Scroll explanation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
