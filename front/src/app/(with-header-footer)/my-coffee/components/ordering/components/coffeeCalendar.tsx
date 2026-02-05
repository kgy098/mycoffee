"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPageProps {
  deliveryDate: Date | null;
  setDeliveryDate: (date: Date) => void;
}

export default function CalendarPage({
  deliveryDate,
  setDeliveryDate,
}: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date()); // Today
  const [selectedDate, setSelectedDate] = useState<Date | null>(deliveryDate);

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Check if previous month navigation should be disabled
  const isPrevMonthDisabled = () => {
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    return currentYear <= todayYear && currentMonth <= todayMonth;
  };

  const days = getDaysInMonth(currentDate);

  //isToday
  const isToday = (date: number) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if a specific date is selected
  const isSelected = (date: number) => {
    if (!selectedDate) return false;
    return (
      date === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
  
    if (day < new Date().getDate()) {
      alert("You can't select past day");
      return;
    }

    const selectedDateObj = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selectedDateObj);
    setDeliveryDate(selectedDateObj);
  };

  const currentYearAndMonth = `${currentDate.getFullYear()}.${
    currentDate.getMonth() + 1 < 10
      ? `0${currentDate.getMonth() + 1}`
      : currentDate.getMonth() + 1
  }`;

  return (
    <>
      {/* Calendar Container */}
      <div className="bg-white rounded-2xl p-4 border border-border-default calendar-shadow">
        {/* Header */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <button
            onClick={() => navigateMonth("prev")}
            disabled={isPrevMonthDisabled()}
            className={`rounded-full transition-colors ${
              isPrevMonthDisabled()
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft
              width={16}
              height={16}
              className={`${
                isPrevMonthDisabled()
                  ? "text-icon-disabled"
                  : "text-action-secondary"
              }`}
            />
          </button>

          <h1 className="text-normal leading-[20px] font-bold">
            {currentYearAndMonth}
          </h1>

          <button
            onClick={() => navigateMonth("next")}
            className="hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight
              width={16}
              height={16}
              className="text-action-secondary"
            />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center">
              <span className="text-xs leading-[18px] font-bold text-text-secondary">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className="aspect-square flex items-center justify-center"
            >
              {day && (
                <button
                  onClick={() => handleDateSelect(day)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm leading-[20px] font-normal transition-all duration-200 hover:bg-gray-100 ${
                    isSelected(day)
                      ? "bg-action-secondary text-action-primary"
                      : //   if day is equal  today
                      isToday(day)
                      ? "text-action-primary"
                      : "text-text-primary hover:text-gray-900"
                  }`}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
