/**
 * Validation result for question structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates that a question object contains all required fields
 * Requirements: 1.1, 1.3, 1.5
 */
export function validateQuestion(obj: any): ValidationResult {
  const errors: string[] = [];

  if (!obj || typeof obj !== 'object') {
    errors.push('Question must be an object');
    return { isValid: false, errors };
  }

  // Check for required fields
  if (typeof obj.question !== 'string' || obj.question.trim() === '') {
    errors.push('Missing or invalid "question" field');
  }

  if (typeof obj.answer !== 'string' || obj.answer.trim() === '') {
    errors.push('Missing or invalid "answer" field');
  }

  if (typeof obj.explanation !== 'string' || obj.explanation.trim() === '') {
    errors.push('Missing or invalid "explanation" field');
  }

  if (!Array.isArray(obj.options) || obj.options.length === 0) {
    errors.push('Missing or invalid "options" field (must be a non-empty array)');
  } else {
    // Validate that all options are strings
    const invalidOptions = obj.options.some((opt: any) => typeof opt !== 'string');
    if (invalidOptions) {
      errors.push('All options must be strings');
    }
  }

  if (typeof obj.context !== 'string' || obj.context.trim() === '') {
    errors.push('Missing or invalid "context" field');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates an array of questions
 * Requirements: 1.1, 1.2, 1.3, 1.5
 */
export function validateQuestions(data: any): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    errors.push('Data must contain an array of questions');
    return { isValid: false, errors };
  }

  if (data.length === 0) {
    errors.push('Data must contain at least one question');
    return { isValid: false, errors };
  }

  // Validate each question
  data.forEach((question, index) => {
    const result = validateQuestion(question);
    if (!result.isValid) {
      errors.push(`Question ${index + 1}: ${result.errors.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates input string and parses it as JSON or TOON
 * Requirements: 1.1, 1.2, 1.3, 1.5
 */
export async function validateAndParseQuizData(input: string): Promise<{ isValid: boolean; errors: string[]; data?: any }> {
  const errors: string[] = [];

  if (!input || input.trim() === '') {
    errors.push('Input cannot be empty');
    return { isValid: false, errors };
  }

  try {
    // Try to parse as JSON first
    const jsonData = JSON.parse(input);
    const validationResult = validateQuestions(jsonData);
    
    if (validationResult.isValid) {
      return { isValid: true, errors: [], data: jsonData };
    } else {
      return { isValid: false, errors: validationResult.errors };
    }
  } catch (jsonError) {
    // If JSON parsing fails, try TOON format
    try {
      const { parseQuizData } = await import('./toon');
      const toonData = parseQuizData(input);
      const validationResult = validateQuestions(toonData);
      
      if (validationResult.isValid) {
        return { isValid: true, errors: [], data: toonData };
      } else {
        return { isValid: false, errors: validationResult.errors };
      }
    } catch (toonError) {
      errors.push('Invalid format: Input must be valid JSON or TOON format');
      errors.push(`JSON error: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}`);
      errors.push(`TOON error: ${toonError instanceof Error ? toonError.message : 'Unknown error'}`);
      return { isValid: false, errors };
    }
  }
}
