import { useState, useEffect } from 'react'
import type { Question } from './types'
import { FileImporter } from './components/FileImporter'
import { ModeSelector } from './components/ModeSelector'
import { QuizApp } from './components/QuizApp'
import './App.css'

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'selection' | 'practice' | 'test' | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Clear any existing localStorage to start fresh
    localStorage.removeItem('darkMode');
    // Start with light mode by default
    return false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    const html = document.documentElement;
    
    if (darkMode) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleQuestionsLoaded = (loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions);
    setError(null);
    setMode('selection'); // Requirement 3.1: Present mode selection after loading
    // Requirement 1.4: Display total number of questions
    console.log(`Loaded ${loadedQuestions.length} questions`);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setQuestions([]);
  };

  const handleModeSelect = (selectedMode: 'practice' | 'test') => {
    setMode(selectedMode);
    // Requirement 3.5: Display mode-specific instructions (handled in ModeSelector)
    console.log(`Selected mode: ${selectedMode}`);
  };

  // Dark mode toggle button component
  const DarkModeToggle = () => (
    <button
      onClick={() => setDarkMode(prev => !prev)}
      className="fixed top-4 right-4 p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full shadow-lg transition-colors z-50"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );

  // Show file importer if no questions are loaded
  if (questions.length === 0) {
    return (
      <>
        <DarkModeToggle />
        <FileImporter 
          onQuestionsLoaded={handleQuestionsLoaded}
          onError={handleError}
          darkMode={darkMode}
        />
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded max-w-md">
            <p className="font-bold">Error</p>
            <p className="text-sm whitespace-pre-line">{error}</p>
          </div>
        )}
      </>
    );
  }

  // Show mode selector if mode hasn't been selected yet
  if (mode === 'selection') {
    return (
      <>
        <DarkModeToggle />
        <ModeSelector onModeSelect={handleModeSelect} questionCount={questions.length} />
      </>
    );
  }

  // Show quiz interface if mode is selected
  if (mode === 'practice' || mode === 'test') {
    return (
      <>
        <DarkModeToggle />
        <QuizApp 
          questions={questions} 
          mode={mode}
          onRestart={() => {
            setMode('selection');
            setQuestions([]);
          }}
        />
      </>
    );
  }

  return null;
}

export default App
