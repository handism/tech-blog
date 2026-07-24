// tests/text-tokenizer.test.ts
import { describe, expect, it } from 'vitest';
import { tokenizeForSearch } from '@/src/lib/text-tokenizer';

describe('tokenizeForSearch', () => {
  describe('文字種ごとの分割', () => {
    it('連続する漢字は1つのトークンとして扱う', () => {
      expect(tokenizeForSearch('東京都渋谷区')).toBe('東京都渋谷区');
    });

    it('ひらがなとカタカナを別トークンに分割する', () => {
      expect(tokenizeForSearch('ひらがなカタカナ')).toBe('ひらがな カタカナ');
    });

    it('英数字を1つのトークンとして扱う', () => {
      expect(tokenizeForSearch('JavaScript')).toBe('JavaScript');
    });

    it('# を含む英数字トークンを正しく処理する', () => {
      expect(tokenizeForSearch('C#')).toBe('C#');
    });

    it('+ を含む英数字トークンを正しく処理する', () => {
      expect(tokenizeForSearch('C++')).toBe('C++');
    });

    it('数字のみのトークンを処理する', () => {
      expect(tokenizeForSearch('12345')).toBe('12345');
    });
  });

  describe('混合テキストの分割', () => {
    it('英字・記号・漢字・ひらがなが混在するテキストを文字種ごとに分割する', () => {
      const result = tokenizeForSearch('Next.jsでSSGする');
      // . は英数字でも記号クラスでもないので区切りになる
      // "Next" "js" "で" "SSG" "する"
      expect(result).toBe('Next js で SSG する');
    });

    it('漢字とひらがなの連続を正しく分割する', () => {
      const result = tokenizeForSearch('技術的な学びを記録する');
      // 漢字: 技術的 → ひらがな: な → 漢字: 学 → ひらがな: びを → 漢字: 記録 → ひらがな: する
      expect(result).toBe('技術的 な 学 びを 記録 する');
    });

    it('カタカナと英字の混在を正しく処理する', () => {
      const result = tokenizeForSearch('TypeScriptのコンパイラ');
      expect(result).toBe('TypeScript の コンパイラ');
    });
  });

  describe('エッジケース', () => {
    it('空文字列をそのまま返す', () => {
      expect(tokenizeForSearch('')).toBe('');
    });

    it('空白のみの文字列をそのまま返す', () => {
      expect(tokenizeForSearch('   ')).toBe('   ');
    });

    it('英数字のみのテキストをそのまま返す', () => {
      expect(tokenizeForSearch('hello world')).toBe('hello world');
    });

    it('記号のみのテキストをそのまま返す（マッチなしでフォールバック）', () => {
      // 記号はどのグループにもマッチしないので元のテキストがそのまま返る
      expect(tokenizeForSearch('...')).toBe('...');
    });

    it('繰り返し文字種の切り替えに対応する', () => {
      const result = tokenizeForSearch('AWSのVPCを作成する');
      expect(result).toBe('AWS の VPC を 作成 する');
    });
  });
});
