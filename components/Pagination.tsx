'use client';

import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  // ページ番号の表示ロジック
  if (totalPages <= 7) {
    // 7ページ以下なら全て表示
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 8ページ以上の場合は省略記号を入れる
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="ページネーション">
      {/* 前へボタン */}
      {currentPage > 1 ? (
        <Link
          href={`/page/${currentPage - 1}`}
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
            href={`/page/${pageNum}`}
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
          href={`/page/${currentPage + 1}`}
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
