'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Pagination.module.scss';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  initialPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({ initialPage, totalPages, basePath }) => {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`${basePath}?page=${newPage}`);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, initialPage - 5);
    const endPage = Math.min(totalPages, startPage + 9);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === initialPage ? styles.active : ''}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.pagination__btn}>
        {totalPages > 10 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              disabled={initialPage === 1}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => handlePageChange(Math.max(1, initialPage - 10))}
              disabled={initialPage <= 10}
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(initialPage - 1)}
          disabled={initialPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(initialPage + 1)}
          disabled={initialPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
        {totalPages > 10 && (
          <>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, initialPage + 10))}
              disabled={initialPage > totalPages - 10}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={initialPage === totalPages}
            >
              <ChevronsRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Pagination;