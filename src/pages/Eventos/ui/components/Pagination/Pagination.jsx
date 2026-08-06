import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange, totalItems }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Calculate page range to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  const visiblePages = pages.slice(startPage - 1, endPage);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-6 bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center mb-4 sm:mb-0">
        <span className="text-sm text-gray-700 mr-2">Mostrar:</span>
        <select
          className="border border-gray-300 rounded-md text-sm p-1 focus:outline-none focus:ring-1 focus:ring-primary_color_1"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={18}>18</option>
          <option value={36}>36</option>
          <option value={54}>54</option>
        </select>
        <span className="text-sm text-gray-700 ml-4">
          Total: {totalItems} eventos
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdChevronLeft size={24} />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`w-8 h-8 rounded-md text-sm font-medium ${currentPage === 1 ? 'bg-primary_color_1 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-gray-400">...</span>}
          </>
        )}

        {visiblePages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-md text-sm font-medium ${currentPage === page ? 'bg-primary_color_1 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`w-8 h-8 rounded-md text-sm font-medium ${currentPage === totalPages ? 'bg-primary_color_1 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
