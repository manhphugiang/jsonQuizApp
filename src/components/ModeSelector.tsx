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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Select Quiz Mode
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          {questionCount} questions loaded
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Practice Mode */}
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <h2 className="text-2xl font-bold text-blue-600 mb-3">
              Practice Mode
            </h2>
            <p className="text-gray-700 mb-4">
              Learn at your own pace with immediate feedback after each question.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Immediate feedback after each answer</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>See correct answers and explanations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>No time limit</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
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
          <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-500 transition-colors">
            <h2 className="text-2xl font-bold text-purple-600 mb-3">
              Test Mode
            </h2>
            <p className="text-gray-700 mb-4">
              Simulate real exam conditions with timed assessment.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⏱</span>
                <span>Timed quiz with countdown</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⏱</span>
                <span>No feedback until completion</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⏱</span>
                <span>Auto-submit when time expires</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⏱</span>
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

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Keyboard Navigation:
          </h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><span className="font-mono bg-gray-200 px-2 py-1 rounded">1-4</span> or <span className="font-mono bg-gray-200 px-2 py-1 rounded">A-D</span> - Select answer</p>
            <p><span className="font-mono bg-gray-200 px-2 py-1 rounded">→</span> - Next question / Submit</p>
            <p><span className="font-mono bg-gray-200 px-2 py-1 rounded">←</span> - Previous question</p>
            <p><span className="font-mono bg-gray-200 px-2 py-1 rounded">↑↓</span> - Scroll explanation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
