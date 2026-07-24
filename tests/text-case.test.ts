import { describe, expect, it } from 'vitest';
import {
  toWords,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
  toSentenceCase,
} from '@/src/components/tools/text-toolkit/TextCase';

describe('TextCase conversion functions', () => {
  describe('toWords', () => {
    it('空文字列の場合は空配列を返す', () => {
      expect(toWords('')).toEqual([]);
    });

    it('キャメルケース、スネークケース、ケバブケース、スペース区切りを単語に分割する', () => {
      expect(toWords('helloWorldTest')).toEqual(['hello', 'World', 'Test']);
      expect(toWords('hello_world_test')).toEqual(['hello', 'world', 'test']);
      expect(toWords('hello-world-test')).toEqual(['hello', 'world', 'test']);
      expect(toWords('hello world test')).toEqual(['hello', 'world', 'test']);
    });
  });

  describe('toCamelCase', () => {
    it('文字列をキャメルケースに変換する', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('HELLO_WORLD')).toBe('helloWorld');
      expect(toCamelCase('kebab-case-string')).toBe('kebabCaseString');
      expect(toCamelCase('')).toBe('');
    });
  });

  describe('toPascalCase', () => {
    it('文字列をパスカルケースに変換する', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
      expect(toPascalCase('snake_case_string')).toBe('SnakeCaseString');
      expect(toPascalCase('')).toBe('');
    });
  });

  describe('toSnakeCase', () => {
    it('文字列をスネークケースに変換する', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('PascalCaseString')).toBe('pascal_case_string');
      expect(toSnakeCase('')).toBe('');
    });
  });

  describe('toKebabCase', () => {
    it('文字列をケバブケースに変換する', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('snake_case_string')).toBe('snake-case-string');
      expect(toKebabCase('')).toBe('');
    });
  });

  describe('toConstantCase', () => {
    it('文字列をコンスタントケース(SCREAMING_SNAKE_CASE)に変換する', () => {
      expect(toConstantCase('helloWorld')).toBe('HELLO_WORLD');
      expect(toConstantCase('kebab-case-string')).toBe('KEBAB_CASE_STRING');
      expect(toConstantCase('')).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('文字列をタイトルケースに変換する', () => {
      expect(toTitleCase('hello_world_test')).toBe('Hello World Test');
      expect(toTitleCase('camelCaseString')).toBe('Camel Case String');
      expect(toTitleCase('')).toBe('');
    });
  });

  describe('toSentenceCase', () => {
    it('文字列をセンテンスケースに変換する', () => {
      expect(toSentenceCase('hello_world_test')).toBe('Hello world test');
      expect(toSentenceCase('camelCaseString')).toBe('Camel case string');
      expect(toSentenceCase('')).toBe('');
    });
  });
});
