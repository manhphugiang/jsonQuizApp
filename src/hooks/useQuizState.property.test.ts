import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useQuizState } from './useQuizState';

/**
 * Feature: interactive-quiz-app, Property 6: Mode immutability after start
 * Validates: Requirements 3.4
 * 
 * For any quiz that has started (currentQuestionIndex > 0 or timer has started), 
 * attempting to change the mode should have no effect on the mode state.
 */
describe('Property 6: Mode immutability after start', () => {
  it('should prevent mode changes after quiz has started (moved to next question)', () => {
    fc.assert(
      fc.property(
        // Generate random questions
        fc.array(
          fc.record({
            question: fc.string({ minLength: 1 }),
            answer: fc.constantFrom('A', 'B', 'C', 'D'),
            explanation: fc.string({ minLength: 1 }),
            options: fc.constant(['Option A', 'Option B', 'Option C', 'Option D'] as string[]),
            context: fc.string({ minLength: 1 }),
          }),
          { minLength: 2, maxLength: 10 }
        ),
        fc.constantFrom('practice' as const, 'test' as const),
        (questions, mode) => {
          const { result } = renderHook(() => useQuizState(questions, mode));

          // Initially, mode can be changed (quiz hasn't started)
          expect(result.current.canChangeMode).toBe(true);
          expect(result.current.state.mode).toBe(mode);

          // Start the quiz by moving to next question
          act(() => {
            result.current.recordAnswer('A');
            result.current.goToNext();
          });

          // After starting, mode cannot be changed
          expect(result.current.canChangeMode).toBe(false);
          
          // Mode should remain the same
          expect(result.current.state.mode).toBe(mode);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should allow mode change at the very beginning (index 0, no actions taken)', () => {
    fc.assert(
      fc.property(
        // Generate random questions
        fc.array(
          fc.record({
            question: fc.string({ minLength: 1 }),
            answer: fc.constantFrom('A', 'B', 'C', 'D'),
            explanation: fc.string({ minLength: 1 }),
            options: fc.constant(['Option A', 'Option B', 'Option C', 'Option D'] as string[]),
            context: fc.string({ minLength: 1 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        fc.constantFrom('practice' as const, 'test' as const),
        (questions, mode) => {
          const { result } = renderHook(() => useQuizState(questions, mode));

          // At the very beginning, mode can be changed
          expect(result.current.canChangeMode).toBe(true);
          expect(result.current.state.currentQuestionIndex).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should prevent mode changes in test mode once timer has been modified', () => {
    fc.assert(
      fc.property(
        // Generate random questions
        fc.array(
          fc.record({
            question: fc.string({ minLength: 1 }),
            answer: fc.constantFrom('A', 'B', 'C', 'D'),
            explanation: fc.string({ minLength: 1 }),
            options: fc.constant(['Option A', 'Option B', 'Option C', 'Option D'] as string[]),
            context: fc.string({ minLength: 1 }),
          }),
          { minLength: 2, maxLength: 10 }
        ),
        fc.integer({ min: 1, max: 3600 }),
        (questions, newTimerValue) => {
          const { result } = renderHook(() => useQuizState(questions, 'test'));

          const initialTimer = result.current.state.timer;
          
          // Initially can change mode
          expect(result.current.canChangeMode).toBe(true);

          // Modify timer (simulating countdown)
          if (newTimerValue !== initialTimer) {
            act(() => {
              result.current.updateTimer(newTimerValue);
            });

            // After timer modification, mode cannot be changed
            expect(result.current.canChangeMode).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
