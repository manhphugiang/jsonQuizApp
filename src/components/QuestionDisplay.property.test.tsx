import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { QuestionDisplay } from './QuestionDisplay';
import type { Question } from '../types';

/**
 * Feature: interactive-quiz-app, Property 18: Keyboard shortcut visibility
 * Validates: Requirements 8.4
 * 
 * For any displayed question with options, each option should be rendered 
 * with its associated keyboard shortcut (1-4 or A-D) visible to the user.
 */
describe('Property 18: Keyboard shortcut visibility', () => {
  it('should display keyboard shortcuts for all options', () => {
    fc.assert(
      fc.property(
        // Generate random questions with 1-4 options
        fc.record({
          question: fc.string({ minLength: 1 }),
          answer: fc.constantFrom('A', 'B', 'C', 'D'),
          explanation: fc.string({ minLength: 1 }),
          options: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 4 }),
          context: fc.string({ minLength: 1 }),
        }),
        (question: Question) => {
          render(
            <QuestionDisplay
              question={question}
              selectedAnswer={null}
              onAnswerSelect={() => {}}
              showFeedback={false}
            />
          );

          const answerLabels = ['A', 'B', 'C', 'D'];

          // Check that each option has its keyboard shortcut visible
          question.options.forEach((_, idx) => {
            const label = answerLabels[idx];

            // Check for the letter label (A, B, C, D)
            const labelElements = screen.getAllByText(label);
            expect(labelElements.length).toBeGreaterThan(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display exactly the right number of shortcuts matching options count', () => {
    fc.assert(
      fc.property(
        // Generate random questions with varying option counts
        fc.record({
          question: fc.string({ minLength: 1 }),
          answer: fc.constantFrom('A', 'B', 'C', 'D'),
          explanation: fc.string({ minLength: 1 }),
          options: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 4 }),
          context: fc.string({ minLength: 1 }),
        }),
        (question: Question) => {
          render(
            <QuestionDisplay
              question={question}
              selectedAnswer={null}
              onAnswerSelect={() => {}}
              showFeedback={false}
            />
          );

          const answerLabels = ['A', 'B', 'C', 'D'];
          
          // Count how many option labels are present
          let visibleLabelsCount = 0;
          for (let i = 0; i < question.options.length; i++) {
            const label = answerLabels[i];
            const labelElements = screen.queryAllByText(label);
            if (labelElements.length > 0) {
              visibleLabelsCount++;
            }
          }

          // The number of visible labels should match the number of options
          expect(visibleLabelsCount).toBe(question.options.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display keyboard shortcuts legend', () => {
    fc.assert(
      fc.property(
        fc.record({
          question: fc.string({ minLength: 1 }),
          answer: fc.constantFrom('A', 'B', 'C', 'D'),
          explanation: fc.string({ minLength: 1 }),
          options: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 4 }),
          context: fc.string({ minLength: 1 }),
        }),
        (question: Question) => {
          render(
            <QuestionDisplay
              question={question}
              selectedAnswer={null}
              onAnswerSelect={() => {}}
              showFeedback={false}
            />
          );
          
          // Check that the keyboard shortcuts legend is present
          const shortcutElements = screen.getAllByText(/Keyboard shortcuts/i);
          expect(shortcutElements.length).toBeGreaterThan(0);
          
          const oneToFourElements = screen.getAllByText(/1-4/);
          expect(oneToFourElements.length).toBeGreaterThan(0);
          
          const aToDElements = screen.getAllByText(/A-D/);
          expect(aToDElements.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
