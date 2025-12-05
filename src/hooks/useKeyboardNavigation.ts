import { useEffect, useRef } from 'react';

interface KeyboardNavigationProps {
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onScrollUp: () => void;
  onScrollDown: () => void;
  enabled: boolean;
}

/**
 * Custom hook for keyboard navigation
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9
 */
export function useKeyboardNavigation({
  onAnswerSelect,
  onNext,
  onPrevious,
  onScrollUp,
  onScrollDown,
  enabled,
}: KeyboardNavigationProps) {
  // Use refs to avoid recreating the event listener on every render
  const handlersRef = useRef({
    onAnswerSelect,
    onNext,
    onPrevious,
    onScrollUp,
    onScrollDown,
  });

  // Update refs when handlers change
  useEffect(() => {
    handlersRef.current = {
      onAnswerSelect,
      onNext,
      onPrevious,
      onScrollUp,
      onScrollDown,
    };
  }, [onAnswerSelect, onNext, onPrevious, onScrollUp, onScrollDown]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      try {
        console.log('Key pressed:', event.key, 'Target:', (event.target as HTMLElement).tagName);
        
        // Don't handle keyboard events if user is typing in an input/textarea
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          console.log('Ignoring key - user is typing in input field');
          return;
        }

        // Requirements 2.1-2.5: Answer selection with 1-4 or A-D
        const key = event.key.toUpperCase();
        
        // Number keys 1-4
        if (key >= '1' && key <= '4') {
          event.preventDefault();
          event.stopPropagation();
          const answerIndex = parseInt(key) - 1;
          const answer = String.fromCharCode(65 + answerIndex); // Convert to A-D
          handlersRef.current.onAnswerSelect(answer);
          return;
        }

        // Letter keys A-D
        if (key >= 'A' && key <= 'D') {
          event.preventDefault();
          event.stopPropagation();
          handlersRef.current.onAnswerSelect(key);
          return;
        }

        // Requirement 2.6: Right arrow for next/submit
        console.log('Checking ArrowRight:', event.key, event.key === 'ArrowRight');
        if (event.key === 'ArrowRight') {
          console.log('ArrowRight detected, calling onNext');
          console.log('Event target:', target.tagName, 'Event defaultPrevented:', event.defaultPrevented);
          event.preventDefault();
          event.stopPropagation();
          console.log('About to call handlersRef.current.onNext');
          handlersRef.current.onNext();
          console.log('onNext called successfully');
          return;
        }

        // Requirement 2.7: Left arrow for previous
        if (event.key === 'ArrowLeft') {
          console.log('ArrowLeft detected, calling onPrevious');
          console.log('Event target:', target.tagName, 'Event defaultPrevented:', event.defaultPrevented);
          event.preventDefault();
          event.stopPropagation();
          handlersRef.current.onPrevious();
          console.log('onPrevious called successfully');
          return;
        }

        // Requirement 2.8: Down arrow for scrolling down
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          event.stopPropagation();
          handlersRef.current.onScrollDown();
          return;
        }

        // Requirement 2.9: Up arrow for scrolling up
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          event.stopPropagation();
          handlersRef.current.onScrollUp();
          return;
        }
        
        console.log('No handler matched for key:', event.key);
      } catch (error) {
        console.error('Error in keyboard handler:', error);
      }
    };

    console.log('Adding keyboard event listener, enabled:', enabled);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('Removing keyboard event listener');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled]);
}
