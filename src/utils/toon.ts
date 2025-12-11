import { encode, decode } from '@toon-format/toon';
import type { Question } from '../types';

/**
 * TOON utility functions for encoding/decoding quiz data
 */

/**
 * Convert JSON questions array to TOON format
 */
export function questionsToToon(questions: Question[]): string {
  return encode(questions);
}

/**
 * Convert TOON format back to questions array
 */
export function toonToQuestions(toonString: string): Question[] {
  const decoded = decode(toonString);
  return decoded as Question[];
}

/**
 * Detect if input string is TOON format vs JSON
 */
export function isToonFormat(input: string): boolean {
  const trimmed = input.trim();
  
  // Look for TOON-specific patterns from @toon-format/toon first
  const toonPatterns = [
    /^\[\d+\]:/,               // [n]: pattern for arrays at start
    /^\s*-\s+\w+:/m,           // - key: pattern for objects in arrays (multiline)
    /\w+\[\d+\]:/,             // key[n]: pattern for arrays with keys
    /^\s*\w+:\s+\w+/m,         // key: value pattern at start of line (multiline)
    /^\[\d+\]:\s*-\s+\w+:/m    // Compact format: [n]:- key: (no newline after colon)
  ];
  
  const isToon = toonPatterns.some(pattern => pattern.test(trimmed));
  
  // If it matches TOON patterns, it's TOON
  if (isToon) {
    return true;
  }
  
  // JSON format starts with [ or { (but not TOON [n]: pattern)
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    return false;
  }
  
  return false;
}

/**
 * Parse input as either JSON or TOON format
 */
export function parseQuizData(input: string): Question[] {
  const trimmed = input.trim();
  
  if (isToonFormat(trimmed)) {
    // Try to format the TOON content if it's compact
    const formattedToon = formatToonContent(trimmed);
    return toonToQuestions(formattedToon);
  } else {
    return JSON.parse(trimmed) as Question[];
  }
}

/**
 * Generate sample TOON format for the UI
 */
export function getSampleToonFormat(): string {
  const sampleQuestions: Question[] = [
    {
      question: "What is the capital of France?",
      answer: "A",
      explanation: "Paris is the capital and most populous city of France.",
      options: ["Paris", "London", "Berlin", "Madrid"],
      context: "European geography"
    }
  ];
  
  return questionsToToon(sampleQuestions);
}

/**
 * Format compact TOON content with proper indentation and line breaks
 */
export function formatToonContent(compactToon: string): string {
  // If it's already properly formatted, return as-is
  if (compactToon.includes('\n  - question:')) {
    return compactToon;
  }
  
  // Handle compact format like "[10]:- question: ..."
  let formatted = compactToon;
  
  // Add newline after [n]:
  formatted = formatted.replace(/(\[\d+\]:)(?![\r\n])/g, '$1\n');
  
  // Add proper indentation for list items
  formatted = formatted.replace(/- question:/g, '  - question:');
  
  // Add proper indentation for other fields
  formatted = formatted.replace(/answer:/g, '    answer:');
  formatted = formatted.replace(/explanation:/g, '    explanation:');
  formatted = formatted.replace(/options\[\d+\]:/g, '    options[4]:');
  formatted = formatted.replace(/context:/g, '    context:');
  
  // Add newlines between questions (before each "- question:" except the first)
  formatted = formatted.replace(/(?<!^|\n)  - question:/g, '\n  - question:');
  
  return formatted;
}