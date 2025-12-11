import { describe, it, expect } from 'vitest';
import { questionsToToon, toonToQuestions, isToonFormat, parseQuizData, getSampleToonFormat } from './toon';
import type { Question } from '../types';

describe('TOON utilities', () => {
  const sampleQuestions: Question[] = [
    {
      question: "What is the capital of France?",
      answer: "A",
      explanation: "Paris is the capital and most populous city of France.",
      options: ["Paris", "London", "Berlin", "Madrid"],
      context: "European geography"
    },
    {
      question: "What is 2 + 2?",
      answer: "B", 
      explanation: "Basic arithmetic: 2 + 2 equals 4.",
      options: ["3", "4", "5", "6"],
      context: "Elementary mathematics"
    }
  ];

  describe('questionsToToon', () => {
    it('should convert questions array to TOON format', () => {
      const toonResult = questionsToToon(sampleQuestions);
      expect(typeof toonResult).toBe('string');
      expect(toonResult.length).toBeGreaterThan(0);
    });
  });

  describe('toonToQuestions', () => {
    it('should convert TOON format back to questions array', () => {
      const toonString = questionsToToon(sampleQuestions);
      const questions = toonToQuestions(toonString);
      
      expect(Array.isArray(questions)).toBe(true);
      expect(questions).toHaveLength(2);
      expect(questions[0]).toHaveProperty('question');
      expect(questions[0]).toHaveProperty('answer');
      expect(questions[0]).toHaveProperty('explanation');
      expect(questions[0]).toHaveProperty('options');
      expect(questions[0]).toHaveProperty('context');
    });
  });

  describe('isToonFormat', () => {
    it('should detect JSON format correctly', () => {
      const jsonString = JSON.stringify(sampleQuestions);
      expect(isToonFormat(jsonString)).toBe(false);
    });

    it('should detect TOON format correctly', () => {
      const toonString = questionsToToon(sampleQuestions);
      expect(isToonFormat(toonString)).toBe(true);
    });

    it('should handle empty strings', () => {
      expect(isToonFormat('')).toBe(false);
      expect(isToonFormat('   ')).toBe(false);
    });
  });

  describe('parseQuizData', () => {
    it('should parse JSON format', () => {
      const jsonString = JSON.stringify(sampleQuestions);
      const result = parseQuizData(jsonString);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].question).toBe(sampleQuestions[0].question);
    });

    it('should parse TOON format', () => {
      const toonString = questionsToToon(sampleQuestions);
      const result = parseQuizData(toonString);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('question');
    });
  });

  describe('getSampleToonFormat', () => {
    it('should return a valid TOON format string', () => {
      const sample = getSampleToonFormat();
      expect(typeof sample).toBe('string');
      expect(sample.length).toBeGreaterThan(0);
      expect(isToonFormat(sample)).toBe(true);
    });
  });
});