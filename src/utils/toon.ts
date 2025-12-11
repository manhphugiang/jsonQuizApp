import type { Question } from '../types';

/**
 * TOON utility functions for encoding/decoding quiz data
 * Using compact schema-aware TOON format
 */

/**
 * Convert JSON questions array to TOON format
 */
export function questionsToToon(questions: Question[]): string {
  if (questions.length === 0) return '';
  
  const toonLines = [
    `questions[${questions.length}]{question,answer,explanation,option1,option2,option3,option4,context}:`
  ];
  
  questions.forEach(q => {
    // Ensure we have exactly 4 options
    const options = [...q.options];
    while (options.length < 4) options.push('');
    
    // Create the data row with individual option fields
    const dataRow = [
      q.question,
      q.answer,
      q.explanation,
      options[0],
      options[1], 
      options[2],
      options[3],
      q.context
    ].map(field => {
      // Quote fields that contain commas
      if (field.includes(',')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    }).join(',');
    
    toonLines.push(`  ${dataRow}`);
  });
  
  return toonLines.join('\n');
}

/**
 * Convert TOON format back to questions array
 */
export function toonToQuestions(toonString: string): Question[] {
  const lines = toonString.trim().split('\n');
  
  if (lines.length === 0) return [];
  
  // Parse the schema line
  const schemaLine = lines[0];
  const schemaMatch = schemaLine.match(/questions\[(\d+)\]\{([^}]+)\}:/);
  
  if (!schemaMatch) {
    throw new Error('Invalid TOON format: Missing schema definition');
  }
  
  const expectedCount = parseInt(schemaMatch[1]);
  const fields = schemaMatch[2].split(',');
  
  // Validate expected fields for the new format
  const requiredFields = ['question', 'answer', 'explanation', 'option1', 'option2', 'option3', 'option4', 'context'];
  if (!requiredFields.every(field => fields.includes(field))) {
    throw new Error('Invalid TOON format: Missing required fields in schema');
  }
  
  const questions: Question[] = [];
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Remove leading spaces
    const dataLine = line.replace(/^\s+/, '');
    
    // Parse CSV-like data (handling commas in content)
    const parts = parseCSVLine(dataLine);
    
    if (parts.length !== fields.length) {
      throw new Error(`Invalid TOON format: Row ${i} has ${parts.length} fields, expected ${fields.length}`);
    }
    
    // Map fields to question object
    const question: any = {};
    const options: string[] = [];
    
    fields.forEach((field, index) => {
      if (field.startsWith('option')) {
        // Collect options
        options.push(parts[index]);
      } else {
        question[field] = parts[index];
      }
    });
    
    // Add options array to question
    question.options = options.filter(opt => opt.trim() !== '');
    
    questions.push(question as Question);
  }
  
  if (questions.length !== expectedCount) {
    throw new Error(`Invalid TOON format: Expected ${expectedCount} questions, found ${questions.length}`);
  }
  
  return questions;
}

/**
 * Parse a CSV-like line handling quoted values and commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
    i++;
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Detect if input string is TOON format vs JSON
 */
export function isToonFormat(input: string): boolean {
  const trimmed = input.trim();
  
  // Look for new schema-aware TOON format patterns
  const toonPatterns = [
    /^\w+\[\d+\]\{[^}]+\}:/,   // schema[n]{fields}: pattern
    /^\w+:\s+\w+/m,            // key: value pattern (simple fields)
    /^\w+\[\d+\]:/m,           // array[n]: pattern
  ];
  
  const isToon = toonPatterns.some(pattern => pattern.test(trimmed));
  
  // If it matches TOON patterns, it's TOON
  if (isToon) {
    return true;
  }
  
  // JSON format starts with [ or { (but not TOON patterns)
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
  // The new TOON format is already compact and doesn't need reformatting
  // Just ensure proper line breaks
  return compactToon.trim();
}