import React, { useRef, useState } from 'react';
import type { Question } from '../types';
import { validateQuestions } from '../utils/validation';

interface FileImporterProps {
  onQuestionsLoaded: (questions: Question[]) => void;
  onError: (error: string) => void;
  darkMode: boolean;
}

/**
 * Component for importing and validating quiz questions from JSON files
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export function FileImporter({ onQuestionsLoaded, onError, darkMode }: FileImporterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [pastedContent, setPastedContent] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Parse JSON - Requirement 1.1
        let parsedData: any;
        try {
          parsedData = JSON.parse(content);
        } catch (parseError) {
          // Requirement 1.3: Display error for malformed JSON
          onError('Invalid JSON file: The file contains malformed JSON syntax');
          setIsLoading(false);
          return;
        }

        // Validate question structure - Requirements 1.1, 1.3, 1.5
        const validationResult = validateQuestions(parsedData);
        
        if (!validationResult.isValid) {
          // Requirement 1.3: Display error for missing required fields
          const errorMessage = `Invalid question structure:\n${validationResult.errors.join('\n')}`;
          onError(errorMessage);
          setIsLoading(false);
          return;
        }

        // Load questions - Requirement 1.2
        const questions = parsedData as Question[];
        onQuestionsLoaded(questions);
        setIsLoading(false);
      } catch (error) {
        // Requirement 1.3: Handle unexpected errors
        onError(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      onError('Error reading file: Unable to read the selected file');
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePasteSubmit = () => {
    if (!pastedContent.trim()) {
      onError('Please paste JSON content');
      return;
    }

    setIsLoading(true);

    try {
      // Parse JSON
      let parsedData: any;
      try {
        parsedData = JSON.parse(pastedContent);
      } catch (parseError) {
        onError('Invalid JSON: The pasted content contains malformed JSON syntax');
        setIsLoading(false);
        return;
      }

      // Validate question structure
      const validationResult = validateQuestions(parsedData);
      
      if (!validationResult.isValid) {
        const errorMessage = `Invalid question structure:\n${validationResult.errors.join('\n')}`;
        onError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Load questions
      const questions = parsedData as Question[];
      onQuestionsLoaded(questions);
      setIsLoading(false);
    } catch (error) {
      onError(`Error processing JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8" style={{ background: 'transparent' }}>
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: darkMode ? '#f9fafb' : '#1f2937' }}>
          Interactive Quiz App
        </h1>
        <p className="mb-6 text-center" style={{ color: darkMode ? '#d1d5db' : '#4b5563' }}>
          Import your quiz questions from a JSON file to get started
        </p>

        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />
          
          <button
            onClick={handleButtonClick}
            disabled={isLoading}
            aria-label="Select quiz JSON file"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {isLoading ? '⏳ Loading...' : '📁 Select JSON File'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
            </div>
          </div>

          <button
            onClick={() => setShowPasteArea(!showPasteArea)}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            📋 Paste JSON Content
          </button>

          {showPasteArea && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Paste your JSON content here..."
                className="w-full h-48 p-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 font-mono text-sm"
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <button
                  onClick={handlePasteSubmit}
                  disabled={isLoading || !pastedContent.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  ✓ Load Questions
                </button>
                <button
                  onClick={() => {
                    setShowPasteArea(false);
                    setPastedContent('');
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {fileName && !isLoading && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Selected: {fileName}
            </p>
          )}
        </div>

        <div className="mt-6 p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Expected JSON Format:
          </h3>
          <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto bg-transparent">
{`[
  {
    "question": "Question text?",
    "answer": "A",
    "explanation": "Explanation...",
    "options": ["A", "B", "C", "D"],
    "context": "Additional context"
  }
]`}
          </pre>
        </div>
      </div>
    </div>
  );
}
