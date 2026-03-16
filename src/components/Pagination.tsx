// src/components/Pagination.tsx
'use client';

import Link from 'next/link';

/**
 * ページネーションのプロパティ。
 */
type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

/**
 * 表示するページ番号の配列を生成する（省略は `'...'` で表現）。
 */
export function generatePageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

/**
 * ページネーションUI。
 */
export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  // ページ番号からURLを生成（1ページ目は / それ以外は /blog/page/N）
  const getPageUrl = (pageNum: number) => {
    return pageNum === 1 ? '/' : `/blog/page/${pageNum}`;
  };

  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <nav className="flex justify-center items-center gap-2 mt-4" aria-label="ページネーション">
      {/* 前へボタン */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 rounded-md bg-secondary text-text hover:bg-accent transition-colors"
        >
          前へ
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md bg-secondary/50 text-text/50 cursor-not-allowed">
          前へ
        </span>
      )}

      {/* ページ番号 */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-text/60">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Link
            key={pageNum}
            href={getPageUrl(pageNum)}
            className={`px-4 py-2 rounded-md transition-colors ${
              isActive
                ? 'bg-accent text-background font-bold'
                : 'bg-secondary text-text hover:bg-accent hover:text-background'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* 次へボタン */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 rounded-md bg-secondary text-text hover:bg-accent transition-colors"
        >
          次へ
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md bg-secondary/50 text-text/50 cursor-not-allowed">
          次へ
        </span>
      )}
    </nav>
  );
}
