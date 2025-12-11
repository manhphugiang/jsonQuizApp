import React, { useRef, useState } from 'react';
import type { Question } from '../types';
import { validateQuestions } from '../utils/validation';
import { parseQuizData, isToonFormat, getSampleToonFormat } from '../utils/toon';

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
        
        // Parse JSON or TOON - Requirement 1.1
        let parsedData: any;
        try {
          parsedData = parseQuizData(content);
        } catch (parseError) {
          // Requirement 1.3: Display error for malformed data
          const format = isToonFormat(content) ? 'TOON' : 'JSON';
          onError(`Invalid ${format} file: The file contains malformed ${format} syntax`);
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
      onError('Please paste JSON or TOON content');
      return;
    }

    setIsLoading(true);

    try {
      // Parse JSON or TOON
      let parsedData: any;
      try {
        parsedData = parseQuizData(pastedContent);
      } catch (parseError) {
        const format = isToonFormat(pastedContent) ? 'TOON' : 'JSON';
        onError(`Invalid ${format}: The pasted content contains malformed ${format} syntax`);
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
      onError(`Error processing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          Import your quiz questions from a JSON or TOON file to get started
        </p>

        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.toon,application/json,text/plain"
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
            {isLoading ? '⏳ Loading...' : '📁 Select JSON/TOON File'}
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
            📋 Paste JSON/TOON Content
          </button>

          {showPasteArea && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <textarea
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder="Paste your JSON or TOON content here..."
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

        <div className="mt-6 p-4 bg-white/20 dark:bg-black/20 rounded-lg backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold" style={{ color: darkMode ? '#f9fafb' : '#1f2937' }}>
              🤖 AI Quiz Generator Prompt
            </h3>
            <button
              onClick={(e) => {
                const prompt = `Generate a comprehensive quiz in TOON format (Token-Oriented Object Notation) with the following exact structure:

[15]:
  - question: Your detailed question here
    answer: A
    explanation: Comprehensive explanation that provides deep understanding of the concept, including why this answer is correct and why other options are incorrect. Explain in details why the other answers are incorrect based on the information of the document provided. Include relevant background information and real-world applications.
    options[4]: Correct answer,Plausible distractor 1,Plausible distractor 2,Plausible distractor 3
    context: Detailed background context explaining the topic area, relevant concepts, and why this knowledge is important. This should help learners understand the broader subject matter.
  - question: Second question here
    answer: B
    explanation: Another comprehensive explanation with clear reasoning and educational value. Explain why this answer is correct and why the others are incorrect.
    options[4]: Option 1,Correct answer,Option 3,Option 4
    context: Context for the second question explaining the broader topic area.

TOON Format Requirements:
- Start with [N]: where N is the number of questions
- Each question is a list item starting with "- question:"
- Each question must have exactly these 5 fields: question, answer, explanation, options, context
- "answer" must be exactly "A", "B", "C", or "D" (matching the position in options array)
- "options[4]:" followed by comma-separated values (no quotes needed unless the option contains commas)
- "explanation" should be 5-6 sentences minimum with clear reasoning explaining why the answer is correct and why the other answers are incorrect
- "context" should provide meaningful background and topic explanation
- Use proper TOON syntax with consistent indentation

Content Requirements:
- Create 15 questions covering different aspects of the topic
- Options should be realistic and challenging (avoid obvious wrong answers)
- Cover both fundamental concepts and practical applications
- Include questions of varying difficulty levels
- Explanations should teach the concept, not just state the answer
- Context should help learners understand the broader subject matter

Topic: based on the file provided

Please generate a comprehensive quiz following this exact TOON structure and return only the valid TOON format.`;
                
                navigator.clipboard.writeText(prompt).then(() => {
                  // Show success feedback
                  const button = e.target as HTMLButtonElement;
                  const originalText = button.textContent;
                  button.textContent = '✓ Copied!';
                  button.style.backgroundColor = '#10b981';
                  setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                  }, 2000);
                });
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
            >
              📋 Copy Prompt
            </button>
          </div>
          
          <div className="mb-4 p-3 rounded border" style={{ 
            backgroundColor: darkMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
            borderColor: darkMode ? 'rgba(156,163,175,0.2)' : 'rgba(107,114,128,0.2)'
          }}>
            <p className="text-xs mb-2" style={{ color: darkMode ? '#d1d5db' : '#4b5563' }}>
              Copy this prompt and use it with ChatGPT, Claude, or any AI assistant to generate comprehensive quiz questions in JSON or TOON format.
            </p>
            <div className="text-xs" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
              <p className="mb-1 font-semibold">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Copy the prompt above from the button</li>
                <li>Paste into your AI assistant</li>
                <li>Copy the generated JSON or TOON back here</li>
                <li>Adjust the number of questions as needed in the prompt</li>
              </ol>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded border" style={{ 
              backgroundColor: darkMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
              borderColor: darkMode ? 'rgba(156,163,175,0.2)' : 'rgba(107,114,128,0.2)'
            }}>
              <h4 className="text-xs font-semibold mb-2" style={{ color: darkMode ? '#f3f4f6' : '#1f2937' }}>
                JSON Format:
              </h4>
              <pre className="text-xs overflow-x-auto" style={{ color: darkMode ? '#e5e7eb' : '#374151' }}>
{`[
  {
    "question": "What is the capital of France?",
    "answer": "A",
    "explanation": "Paris is the capital...",
    "options": ["Paris", "London", "Berlin", "Madrid"],
    "context": "European geography"
  }
]`}
              </pre>
            </div>
            
            <div className="p-3 rounded border" style={{ 
              backgroundColor: darkMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
              borderColor: darkMode ? 'rgba(156,163,175,0.2)' : 'rgba(107,114,128,0.2)'
            }}>
              <h4 className="text-xs font-semibold mb-2" style={{ color: darkMode ? '#f3f4f6' : '#1f2937' }}>
                TOON Format (Token-Efficient):
              </h4>
              <pre className="text-xs overflow-x-auto" style={{ color: darkMode ? '#e5e7eb' : '#374151' }}>
{getSampleToonFormat()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
