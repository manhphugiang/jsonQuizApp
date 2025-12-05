# Paste JSON Example

You can now paste JSON content directly into the quiz app! Here's an example you can copy and paste:

```json
[
  {
    "question": "What does HTML stand for?",
    "answer": "A",
    "explanation": "HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.",
    "options": [
      "HyperText Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language"
    ],
    "context": "Web development fundamentals"
  },
  {
    "question": "Which CSS property is used to change text color?",
    "answer": "B",
    "explanation": "The 'color' property in CSS is used to set the color of text content.",
    "options": [
      "text-color",
      "color",
      "font-color",
      "text-style"
    ],
    "context": "CSS styling basics"
  },
  {
    "question": "What is the correct way to declare a JavaScript variable?",
    "answer": "C",
    "explanation": "In modern JavaScript, 'let' is the preferred way to declare variables that can be reassigned.",
    "options": [
      "variable x = 5",
      "v x = 5",
      "let x = 5",
      "dim x = 5"
    ],
    "context": "JavaScript fundamentals"
  }
]
```

## How to Use

1. Click the **"Paste JSON Content"** button
2. Copy the JSON above
3. Paste it into the text area
4. Click **"Load Questions"**
5. Start your quiz!

## Tips

- Make sure your JSON is valid (use a JSON validator if needed)
- Each question must have: `question`, `answer`, `explanation`, `options`, and `context`
- The `answer` field should be "A", "B", "C", or "D"
- The `options` array should contain the answer choices
