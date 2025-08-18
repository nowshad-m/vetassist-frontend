"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import visits from "@/data/visits.json";
import Breadcrumb from "@/components/Breadcrumb";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current time for the indicator line
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Generate time slots from 7 AM to 6 PM
  const timeSlots = [];
  for (let hour = 7; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Generate week days
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Filter visits for today
  const todayVisits = visits.filter(visit => {
    // For demo purposes, we'll show all visits as "today's"
    return true;
  });

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format short date
  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Navigate to previous/next day or week
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Get appointment color based on status
  const getAppointmentColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'In-Progress':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'Completed':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-neutral-500 hover:bg-neutral-600';
    }
  };

  // Get appointment background color for display
  const getAppointmentBgColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'In-Progress':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'Completed':
        return 'bg-green-100 border-green-200 text-green-800';
      default:
        return 'bg-neutral-100 border-neutral-200 text-neutral-800';
    }
  };

  const weekDays = getWeekDays();

  return (
    <div className="py-4 sm:py-8">
      <Breadcrumb 
        items={[
          { label: "Dashboard" }
        ]} 
      />
      
      {/* Header with Calendar Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
            {viewMode === 'day' ? 'Today\'s Schedule' : 'Weekly Schedule'}
          </h1>
          <span className="text-lg text-neutral-600">
            {viewMode === 'day' ? formatDate(currentDate) : `${formatShortDate(weekDays[0])} - ${formatShortDate(weekDays[6])}`}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Date Navigation */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigateDate('prev')}
              className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => navigateDate('next')}
              className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'day' 
                  ? 'bg-white text-primary-700 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week' 
                  ? 'bg-white text-primary-700 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">{todayVisits.length}</div>
          <div className="text-sm text-neutral-600 font-medium">Total Visits</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-500">
            {todayVisits.filter(v => v.status === "New").length}
          </div>
          <div className="text-sm text-neutral-600 font-medium">New Cases</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-500">
            {todayVisits.filter(v => v.status === "In-Progress").length}
          </div>
          <div className="text-sm text-neutral-600 font-medium">In Progress</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-500">
            {todayVisits.filter(v => v.status === "Completed").length}
          </div>
          <div className="text-sm text-neutral-600 font-medium">Completed</div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="card p-0 overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-neutral-800">Dr. Veterinarian</span>
                <span className="text-sm text-neutral-500">({todayVisits.length} appointments)</span>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'day' ? (
          /* Day View */
          <div className="relative">
            {/* Current Time Indicator */}
            <div 
              className="absolute left-0 right-0 z-10 flex items-center"
              style={{ 
                top: `${((currentHour - 7) * 60 + currentMinute) * 0.8}px` 
              }}
            >
              <div className="w-16 h-0.5 bg-primary-500"></div>
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="ml-2 text-xs font-medium text-primary-700">
                {currentHour.toString().padStart(2, '0')}:{currentMinute.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Time Slots and Appointments */}
            <div className="grid grid-cols-1 gap-0">
              {timeSlots.map((time, timeIndex) => {
                const visitAtThisTime = todayVisits.find(v => v.time === time);
                const isCurrentTime = time === `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
                
                return (
                  <div 
                    key={time} 
                    className={`relative min-h-[60px] border-b border-neutral-100 ${
                      isCurrentTime ? 'bg-primary-50' : ''
                    }`}
                  >
                    {/* Time Label */}
                    <div className="absolute left-4 top-2 w-12 text-xs font-medium text-neutral-500">
                      {time}
                    </div>
                    
                    {/* Appointment Card */}
                    {visitAtThisTime && (
                      <div className="ml-20 mr-4 my-1">
                        <Link 
                          href={`/case/${visitAtThisTime.id}`}
                          className="block bg-white border border-neutral-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              {/* Animal Icon */}
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </div>
                              
                              {/* Visit Details */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-neutral-800">
                                    {visitAtThisTime.stock_class_name}
                                  </span>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    getAppointmentBgColor(visitAtThisTime.status)
                                  }`}>
                                    {visitAtThisTime.status}
                                  </span>
                                </div>
                                <p className="text-sm text-neutral-600">{visitAtThisTime.farm_name}</p>
                              </div>
                            </div>
                            
                            {/* Action Icons */}
                            <div className="flex items-center space-x-1">
                              <div className="p-1 text-neutral-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Week View */
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Week Header */}
              <div className="grid grid-cols-8 border-b border-neutral-200">
                <div className="p-3 bg-neutral-50 font-medium text-neutral-700">Time</div>
                {weekDays.map((day, index) => (
                  <div key={index} className="p-3 bg-neutral-50 font-medium text-neutral-700 text-center">
                    <div className="text-sm font-semibold">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-xs text-neutral-500">{day.getDate()}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time, timeIndex) => (
                <div key={time} className="grid grid-cols-8 border-b border-neutral-100 min-h-[60px]">
                  {/* Time Label */}
                  <div className="p-2 bg-neutral-50 text-xs font-medium text-neutral-500 flex items-center">
                    {time}
                  </div>
                  
                  {/* Day Columns */}
                  {weekDays.map((day, dayIndex) => {
                    const visitAtThisTime = todayVisits.find(v => v.time === time);
                    const isToday = day.toDateString() === new Date().toDateString();
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`p-1 border-l border-neutral-100 ${
                          isToday ? 'bg-primary-50' : ''
                        }`}
                      >
                        {visitAtThisTime && (
                          <Link 
                            href={`/case/${visitAtThisTime.id}`}
                            className={`block w-full h-full min-h-[50px] rounded-lg p-2 text-white text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${getAppointmentColor(visitAtThisTime.status)}`}
                          >
                            <div className="font-semibold mb-1">{visitAtThisTime.stock_class_name}</div>
                            <div className="text-white/90">{visitAtThisTime.farm_name}</div>
                            <div className="text-white/80 text-[10px] mt-1">{visitAtThisTime.status}</div>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/history"
              className="btn-secondary"
            >
              View History
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
