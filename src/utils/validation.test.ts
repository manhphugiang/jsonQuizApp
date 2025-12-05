import { describe, it, expect } from 'vitest';
import { validateQuestion, validateQuestions } from './validation';

describe('validateQuestion', () => {
  it('should validate a correct question object', () => {
    const validQuestion = {
      question: 'What is 2+2?',
      answer: 'A',
      explanation: 'Basic arithmetic',
      options: ['4', '3', '5', '6'],
      context: 'Math basics'
    };

    const result = validateQuestion(validQuestion);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject question missing required field', () => {
    const invalidQuestion = {
      question: 'What is 2+2?',
      answer: 'A',
      // missing explanation
      options: ['4', '3', '5', '6'],
      context: 'Math basics'
    };

    const result = validateQuestion(invalidQuestion);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.includes('explanation'))).toBe(true);
  });

  it('should reject question with empty string fields', () => {
    const invalidQuestion = {
      question: '',
      answer: 'A',
      explanation: 'Basic arithmetic',
      options: ['4', '3', '5', '6'],
      context: 'Math basics'
    };

    const result = validateQuestion(invalidQuestion);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('question'))).toBe(true);
  });

  it('should reject question with invalid options array', () => {
    const invalidQuestion = {
      question: 'What is 2+2?',
      answer: 'A',
      explanation: 'Basic arithmetic',
      options: [],
      context: 'Math basics'
    };

    const result = validateQuestion(invalidQuestion);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('options'))).toBe(true);
  });

  it('should reject non-object input', () => {
    const result = validateQuestion(null);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('object'))).toBe(true);
  });
});

describe('validateQuestions', () => {
  it('should validate an array of correct questions', () => {
    const validQuestions = [
      {
        question: 'What is 2+2?',
        answer: 'A',
        explanation: 'Basic arithmetic',
        options: ['4', '3', '5', '6'],
        context: 'Math basics'
      },
      {
        question: 'What is 3+3?',
        answer: 'B',
        explanation: 'More arithmetic',
        options: ['5', '6', '7', '8'],
        context: 'Math basics'
      }
    ];

    const result = validateQuestions(validQuestions);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject non-array input', () => {
    const result = validateQuestions({ question: 'test' });
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('array'))).toBe(true);
  });

  it('should reject empty array', () => {
    const result = validateQuestions([]);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('at least one'))).toBe(true);
  });

  it('should identify which question has errors', () => {
    const questions = [
      {
        question: 'What is 2+2?',
        answer: 'A',
        explanation: 'Basic arithmetic',
        options: ['4', '3', '5', '6'],
        context: 'Math basics'
      },
      {
        question: 'What is 3+3?',
        answer: 'B',
        // missing explanation
        options: ['5', '6', '7', '8'],
        context: 'Math basics'
      }
    ];

    const result = validateQuestions(questions);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Question 2'))).toBe(true);
  });
});
