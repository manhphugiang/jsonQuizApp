import { useState } from 'react'
import type { Question } from './types'
import { FileImporter } from './components/FileImporter'
import { ModeSelector } from './components/ModeSelector'
import { QuizApp } from './components/QuizApp'
import './App.css'

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'selection' | 'practice' | 'test' | null>(null);

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

  // Show file importer if no questions are loaded
  if (questions.length === 0) {
    return (
      <>
        <FileImporter 
          onQuestionsLoaded={handleQuestionsLoaded}
          onError={handleError}
        />
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <p className="font-bold">Error</p>
            <p className="text-sm whitespace-pre-line">{error}</p>
          </div>
        )}
      </>
    );
  }

  // Show mode selector if mode hasn't been selected yet
  // Requirement 3.1: Present mode selection options
  if (mode === 'selection') {
    return <ModeSelector onModeSelect={handleModeSelect} questionCount={questions.length} />;
  }

  // Show quiz interface if mode is selected
  if (mode === 'practice' || mode === 'test') {
    return (
      <QuizApp 
        questions={questions} 
        mode={mode}
        onRestart={() => {
          setMode('selection');
          setQuestions([]);
        }}
      />
    );
  }

  return null;
}

export default App
