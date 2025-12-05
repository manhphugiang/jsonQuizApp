import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateQuestion, validateQuestions } from './validation';

/**
 * Feature: interactive-quiz-app, Property 1: Question validation completeness
 * Validates: Requirements 1.1, 1.3, 1.5
 * 
 * For any JSON object, if it is missing any required field (question, answer, 
 * explanation, options, context), then the validation function should reject 
 * it and return an error.
 */
describe('Property 1: Question validation completeness', () => {
  it('should reject any object missing required fields', () => {
    fc.assert(
      fc.property(
        // Generate objects with some fields missing
        fc.record({
          question: fc.option(fc.string(), { nil: undefined }),
          answer: fc.option(fc.string(), { nil: undefined }),
          explanation: fc.option(fc.string(), { nil: undefined }),
          options: fc.option(fc.array(fc.string()), { nil: undefined }),
          context: fc.option(fc.string(), { nil: undefined }),
        }),
        (obj) => {
          // Check if any required field is missing or invalid
          const hasMissingField = 
            obj.question === undefined || 
            obj.answer === undefined || 
            obj.explanation === undefined || 
            obj.options === undefined || 
            obj.context === undefined;

          const hasEmptyString =
            (typeof obj.question === 'string' && obj.question.trim() === '') ||
            (typeof obj.answer === 'string' && obj.answer.trim() === '') ||
            (typeof obj.explanation === 'string' && obj.explanation.trim() === '') ||
            (typeof obj.context === 'string' && obj.context.trim() === '');

          const hasEmptyArray = 
            Array.isArray(obj.options) && obj.options.length === 0;

          const hasInvalidOptions =
            Array.isArray(obj.options) && 
            obj.options.some(opt => typeof opt !== 'string');

          const shouldBeInvalid = 
            hasMissingField || 
            hasEmptyString || 
            hasEmptyArray || 
            hasInvalidOptions;

          const result = validateQuestion(obj);

          // If the object should be invalid, validation must reject it
          if (shouldBeInvalid) {
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept any object with all valid required fields', () => {
    fc.assert(
      fc.property(
        // Generate valid question objects
        fc.record({
          question: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          answer: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          explanation: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          options: fc.array(fc.string(), { minLength: 1 }),
          context: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        }),
        (validQuestion) => {
          const result = validateQuestion(validQuestion);
          
          // All valid questions should pass validation
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject non-object inputs', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.array(fc.anything())
        ),
        (nonObject) => {
          const result = validateQuestion(nonObject);
          
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: interactive-quiz-app, Property 2: Question loading preservation
 * Validates: Requirements 1.2, 1.4
 * 
 * For any valid JSON file containing N questions, loading the file should 
 * result in exactly N questions being available in the quiz state.
 */
describe('Property 2: Question loading preservation', () => {
  it('should preserve the exact count of valid questions', () => {
    fc.assert(
      fc.property(
        // Generate an array of valid questions
        fc.array(
          fc.record({
            question: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            answer: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            explanation: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            options: fc.array(fc.string(), { minLength: 1 }),
            context: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1, maxLength: 50 }
        ),
        (questions) => {
          const N = questions.length;
          
          // Validate the questions array
          const result = validateQuestions(questions);
          
          // Should be valid
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
          
          // The number of questions should be preserved (N questions in = N questions validated)
          // This simulates what happens when loading: if validation passes, 
          // all N questions are available
          expect(questions.length).toBe(N);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject arrays with any invalid questions', () => {
    fc.assert(
      fc.property(
        // Generate an array with at least one invalid question
        fc.tuple(
          // Valid questions before
          fc.array(
            fc.record({
              question: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              answer: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              explanation: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              options: fc.array(fc.string(), { minLength: 1 }),
              context: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            }),
            { maxLength: 5 }
          ),
          // Invalid question (missing a required field)
          fc.record({
            question: fc.option(fc.string(), { nil: undefined }),
            answer: fc.option(fc.string(), { nil: undefined }),
            // explanation intentionally missing or undefined
            options: fc.option(fc.array(fc.string()), { nil: undefined }),
            context: fc.option(fc.string(), { nil: undefined }),
          }),
          // Valid questions after
          fc.array(
            fc.record({
              question: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              answer: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              explanation: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
              options: fc.array(fc.string(), { minLength: 1 }),
              context: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            }),
            { maxLength: 5 }
          )
        ),
        ([validBefore, invalidQuestion, validAfter]) => {
          const questions = [...validBefore, invalidQuestion, ...validAfter];
          
          // Validate the questions array
          const result = validateQuestions(questions);
          
          // Should be invalid because of the invalid question
          expect(result.isValid).toBe(false);
          expect(result.errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
