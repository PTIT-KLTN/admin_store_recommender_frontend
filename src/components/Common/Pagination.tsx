import React from 'react';
import { Pagination as PaginationType } from '../../models/pagination';

interface PaginationProps extends Pick<PaginationType, 'currentPage' | 'totalPages' | 'hasPrevious' | 'hasNext'> {
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
  onPageChange,
}) => {
  const delta = 2;
  const current = currentPage + 1;
  const left = Math.max(1, current - delta);
  const right = Math.min(totalPages, current + delta);

  const range: (number | string)[] = [];

  if (left > 1) {
    range.push(1);
    if (left > 2) range.push('...');
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages) {
    if (right < totalPages - 1) range.push('...');
    range.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center space-x-1 py-4">
      <button
        disabled={!hasPrevious}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
        aria-label="Previous Page"
      >
        ‹ Prev
      </button>

      {range.map((item, idx) =>
        typeof item === 'string' ? (
          <span key={idx} className="px-2 text-gray-500">
            {item}
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item - 1)}
            className={`px-3 py-1 border rounded transition-colors focus:outline-none
              ${item === current
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            aria-label={`Page ${item}`}
          >
            {item}
          </button>
        )
      )}

      <button
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
        aria-label="Next Page"
      >
        Next ›
      </button>
    </nav>
  );
};

export default Pagination;
