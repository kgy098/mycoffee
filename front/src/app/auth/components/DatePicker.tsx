'use client';

import { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

const warningIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g clipPath="url(#clip0_1366_13821)">
        <path d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6818 1.33334 7.99992 1.33334C4.31802 1.33334 1.33325 4.31811 1.33325 8.00001C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z" stroke="#EF4444" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 5.33334V8.00001" stroke="#EF4444" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 10.6667H8.00667" stroke="#EF4444" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1366_13821">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default function DatePicker({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  className = '',
  placeholder = '날짜를 선택하세요',
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split('-');
      setDisplayValue(`${year} / ${month} / ${day}`);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const openDatePicker = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.showPicker?.();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block mb-2 text-[12px] font-bold text-gray-0 leading-[16px]">
        {label}
      </label>
      <div className="relative">
        {/* Calendar icon on the right - clickable */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-20">
          <button
            type="button"
            onClick={openDatePicker}
            className="cursor-pointer p-1 rounded transition-colors hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 2V6" stroke="#B3B3B3" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 2V6" stroke="#B3B3B3" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#B3B3B3" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 10H21" stroke="#B3B3B3" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        {/* Hidden date input */}
        <input
          type="date"
          id={id}
          lang="ko"
          ref={inputRef}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-gray-0 focus:ring-[#FF7939] focus:border-[#FF7939] placeholder:font-normal font-bold"
          value={value}
          onChange={handleDateChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          min="1930-01-01"
          max={new Date().toISOString().split('T')[0]}
        />
        
        {/* Visible text input */}
        <input
          type="text"
          lang="ko"
          className={`bg-white border text-gray-0 text-[12px] rounded-lg focus:ring-[#FF7939] focus:border-[#FF7939] block w-full pr-10 py-2.5 px-4 cursor-pointer placeholder:font-normal font-bold ${
            error 
              ? 'border-[#EF4444]' 
              : isFocused 
                ? 'border-[#FF7939]' 
                : 'border-[#E6E6E6]'
          }`}
          placeholder={placeholder}
          value={displayValue}
          readOnly
          onClick={openDatePicker}
          onFocus={openDatePicker}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-2">
          {warningIcon()}
          <span className="text-[#EF4444] text-[12px] font-normal">{error}</span>
        </div>
      )}
    </div>
  );
}