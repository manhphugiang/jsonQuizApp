# Interactive Quiz Application

A fully-featured, keyboard-driven quiz application built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Functionality
- **JSON Import**: Load quiz questions from JSON files OR paste JSON content directly
- **Dual Modes**: 
  - **Practice Mode**: Immediate feedback with explanations after each question
  - **Test Mode**: Timed assessment with results shown at completion
- **Keyboard Navigation**: Complete keyboard control for a seamless experience
- **AI Assistance**: Integrated ChatGPT and Gemini support with full question context including all options

### ⌨️ Keyboard Shortcuts
- `1-4` or `A-D`: Select answer options
- `→`: Submit answer / Next question
- `←`: Previous question
- `↑↓`: Scroll through explanations

**Note**: Click anywhere in the quiz area to ensure keyboard focus is active. The quiz container automatically gains focus when questions change, but clicking ensures focus after interacting with buttons.

### 📊 Results & Scoring
- Percentage-based scoring
- Question-by-question review
- Detailed explanations for all questions
- Visual indicators for correct/incorrect answers

## Getting Started

### Installation
```bash
cd quiz-app
npm install
```

### Loading Questions

You have two options to load quiz questions:

1. **Upload a JSON file**: Click "Select JSON File" and choose a `.json` file
2. **Paste JSON content**: Click "Paste JSON Content" and paste your quiz data directly

### Development
```bash
npm run dev
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

### Build
```bash
npm run build
```

## JSON Format

Create a JSON file with your quiz questions:

```json
[
  {
    "question": "What is the capital of France?",
    "answer": "A",
    "explanation": "Paris is the capital and most populous city of France.",
    "options": ["Paris", "London", "Berlin", "Madrid"],
    "context": "European geography"
  }
]
```

## Testing

The application includes comprehensive testing:
- **30 passing tests** (34 total with 4 skipped)
- **Unit tests** for validation, state management, and components
- **Property-based tests** using fast-check (500+ property checks)
- **Integration tests** for user workflows

### Test Coverage
- Question validation and loading
- Mode selection and immutability
- Keyboard navigation
- UI component rendering
- State management

## Architecture

### Components
- `FileImporter`: JSON file upload and validation
- `ModeSelector`: Practice/Test mode selection
- `QuizApp`: Main quiz orchestration
- `QuestionDisplay`: Question and options rendering
- `FeedbackPanel`: Practice mode feedback
- `Timer`: Test mode countdown
- `ResultsPanel`: Score and review display
- `AIAssistButton`: ChatGPT/Gemini integration

### State Management
- Custom `useQuizState` hook for quiz logic
- Custom `useKeyboardNavigation` hook for keyboard controls
- React hooks for local component state

## Requirements Satisfied

All 8 major requirements fully implemented:
1. ✅ JSON file import with validation
2. ✅ Complete keyboard navigation
3. ✅ Mode selection (Practice/Test)
4. ✅ Practice mode with immediate feedback
5. ✅ Test mode with timer
6. ✅ Results panel with detailed review
7. ✅ AI assistance (ChatGPT & Gemini)
8. ✅ Clean UI with Tailwind CSS

## Technologies

- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Vitest** for testing
- **fast-check** for property-based testing
- **React Testing Library** for component tests

## Sample Quiz

A sample quiz file (`sample-quiz.json`) is included in the project root for testing.

## Troubleshooting

### Keyboard Navigation Not Working

If arrow keys or keyboard shortcuts aren't responding:

1. **After selecting an answer**: The answer buttons automatically release focus to enable keyboard navigation. Arrow keys should work immediately after selecting an answer.
2. **After clicking any button**: All buttons (Previous, Next, Restart) automatically return focus to the quiz container after being clicked.
3. **Click in the quiz area**: If keyboard shortcuts still don't work, click anywhere in the white quiz card to ensure focus.
4. **Check for input focus**: If you're typing in a text field elsewhere, keyboard shortcuts won't work (this is intentional).
5. **Browser console**: Open developer tools (F12) and check for console logs like "ArrowRight detected" to verify events are being captured.

The application automatically focuses the quiz container when:
- A new question loads
- You navigate between questions
- The component first renders
- Any button is clicked

**Common issue**: If you click an answer button and then try to use arrow keys, they should work immediately. The buttons are designed to release focus automatically.
