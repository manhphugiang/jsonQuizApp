import { useState } from 'react';
import type { Question } from '../types';

interface AIAssistButtonProps {
  question: Question;
  answer: string;
  onCopySuccess: () => void;
}

/**
 * Component for AI assistance (ChatGPT and Gemini)
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */
export function AIAssistButton({
  question,
  answer,
  onCopySuccess,
}: AIAssistButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  // Requirement 7.2, 7.3: Generate ChatGPT URL with question and context
  const handleChatGPT = () => {
    const optionsText = question.options
      .map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`)
      .join('\n');
    
    const prompt = `I have a question about: ${question.question}

Context: ${question.context}

Options:
${optionsText}

Can you explain this in detail?`;
    
    const encodedPrompt = encodeURIComponent(prompt);
    const chatGPTUrl = `https://chat.openai.com/?q=${encodedPrompt}`;
    
    window.open(chatGPTUrl, '_blank');
    setShowDropdown(false);
  };

  // Requirement 7.4, 7.5: Generate Gemini prompt and copy to clipboard
  const handleGemini = async () => {
    const optionsText = question.options
      .map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`)
      .join('\n');
    
    const prompt = `Question: ${question.question}

Context: ${question.context}

Options:
${optionsText}

Correct Answer: ${answer} - ${question.options[answer.charCodeAt(0) - 65]}

Please provide a deep explanation of why this is the correct answer and help me understand the underlying concepts.`;

    try {
      // Requirement 7.5: Copy to clipboard
      await navigator.clipboard.writeText(prompt);
      
      // Requirement 7.6: Show confirmation
      setShowCopyMessage(true);
      onCopySuccess();
      setShowDropdown(false);
      
      setTimeout(() => {
        setShowCopyMessage(false);
      }, 3000);
    } catch (error) {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = prompt;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        setShowCopyMessage(true);
        onCopySuccess();
        setShowDropdown(false);
        
        setTimeout(() => {
          setShowCopyMessage(false);
        }, 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="relative">
      {/* Requirement 7.1, 7.7: AI Button on right-hand side */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
      >
        <span>🤖 AI Help</span>
        <span className="text-xs">{showDropdown ? '▼' : '▶'}</span>
      </button>

      {/* Dropdown menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-10">
          <button
            onClick={handleChatGPT}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-200 flex items-center gap-3"
          >
            <span className="text-2xl">💬</span>
            <div>
              <p className="font-semibold text-gray-800">ChatGPT</p>
              <p className="text-xs text-gray-600">Open in new tab</p>
            </div>
          </button>
          
          <button
            onClick={handleGemini}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-semibold text-gray-800">Gemini</p>
              <p className="text-xs text-gray-600">Copy prompt to clipboard</p>
            </div>
          </button>
        </div>
      )}

      {/* Requirement 7.6: Copy success message */}
      {showCopyMessage && (
        <div className="absolute right-0 mt-2 px-4 py-2 bg-green-100 border-2 border-green-300 text-green-800 rounded-lg shadow-lg text-sm font-medium">
          ✓ Copied to clipboard!
        </div>
      )}
    </div>
  );
}
