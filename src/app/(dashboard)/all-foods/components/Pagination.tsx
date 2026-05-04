'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Komponen pagination reusable.
 * Menampilkan nomor halaman dengan ellipsis untuk range besar,
 * serta tombol Previous/Next.
 */
function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Buat array nomor halaman yang akan ditampilkan
  function getPageNumbers(): (number | '...')[] {
    const pages: (number | '...')[] = [];

    if (totalPages <= 5) {
      // Tampilkan semua jika 5 halaman atau kurang
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Selalu tampilkan halaman 1
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      // Halaman sekitar current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');

      // Selalu tampilkan halaman terakhir
      pages.push(totalPages);
    }

    return pages;
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-6 pb-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 p-0 rounded-lg"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={16} />
      </Button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="h-9 w-9 flex items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 p-0 rounded-lg text-sm font-medium ${
              currentPage === page
                ? 'bg-primary text-primary-foreground pointer-events-none'
                : ''
            }`}
            aria-label={`Halaman ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 p-0 rounded-lg"
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}

export default Pagination;
