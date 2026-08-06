import React from 'react';

const StatusTabs = ({ options, selected, onSelect }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
      {options.map((option) => {
        const isSelected = selected === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              isSelected
                ? 'bg-primary_color_1 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option.label}
            <span
              className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusTabs;
