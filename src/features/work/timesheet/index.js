import { useState, useRef, useEffect } from 'react';
import { Search, Download, Plus, Calendar, BarChart2, User, HelpCircle, Table, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TimeTrackingDashboard() {
  // State for the time entries
  const [timeEntries, setTimeEntries] = useState([]);
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  // State for filters
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [employeeSearchText, setEmployeeSearchText] = useState('');
  const [duration, setDuration] = useState('Start Date To End Date');
  const [employee, setEmployee] = useState('John Doe');
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [startMonth, setStartMonth] = useState(new Date().getMonth());
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(new Date().getMonth());
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  
  // References for dropdown elements
  const durationDropdownRef = useRef(null);
  const employeeDropdownRef = useRef(null);
  const calendarRef = useRef(null);

  // Duration options
  const durationOptions = [
    'Today',
    'Last 30 Days',
    'This Month',
    'Last Month',
    'Last 90 Days',
    'Last 6 Months',
    'Last 1 Year',
    'Custom Range'
  ];

  // Employee options
  const employeeOptions = [
    { id: 1, name: 'Sara Nadya', isYou: false, initials: 'SN' },
    { id: 2, name: 'John Doe', isYou: true, initials: 'JD' },
    { id: 3, name: 'Nadine Abigail', isYou: false, initials: 'NA' },
    { id: 4, name: 'Eunike Alfrita', isYou: false, initials: 'EA' },
  ];

  // Filtered employees based on search
  const filteredEmployees = employeeOptions.filter(emp => 
    emp.name.toLowerCase().includes(employeeSearchText.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) {
        setDurationDropdownOpen(false);
      }
      if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
        setEmployeeDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target) && !durationDropdownRef.current?.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current employee
  const currentEmployee = employeeOptions.find(emp => emp.name === employee) || employeeOptions[0];

  // Functions
  const handleLogTime = () => console.log('Log Time clicked');
  const handleExport = () => console.log('Export clicked');
  const handleNext = () => setCurrentPage(prev => prev + 1);
  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleEmployeeChange = (emp) => {
    setEmployee(emp.name);
    setEmployeeDropdownOpen(false);
  };

  const handleDurationSelect = (option) => {
    setDuration(option);
    if (option === 'Custom Range') {
      setShowCalendar(true);
    } else {
      setDurationDropdownOpen(false);
    }
  };

  const handleApplyDateRange = () => {
    setDuration(`${formatDate(selectedStartDate)} To ${formatDate(selectedEndDate)}`);
    setShowCalendar(false);
    setDurationDropdownOpen(false);
  };

  const handleCancelDateRange = () => {
    setShowCalendar(false);
    setDurationDropdownOpen(false);
  };

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (year, month, day) => {
    const newDate = new Date(year, month, day);
    
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(newDate);
      setSelectedEndDate(null);
    } else {
      if (newDate < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(newDate);
      } else {
        setSelectedEndDate(newDate);
      }
    }
  };

  const isDateSelected = (year, month, day) => {
    const date = new Date(year, month, day);
    
    if (selectedStartDate && selectedEndDate) {
      return date >= selectedStartDate && date <= selectedEndDate;
    }
    
    return selectedStartDate && date.getTime() === selectedStartDate.getTime();
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const renderCalendarMonth = (year, month, isStartMonth) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      const day = daysInPrevMonth - firstDay + i + 1;
      days.push(
        <div 
          key={`prev-${day}`} 
          className="text-gray-400 text-center py-1"
        >
          {day}
        </div>
      );
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelectedDate = isDateSelected(year, month, i);
      const isTodayDate = isToday(year, month, i);
      
      days.push(
        <div 
          key={i} 
          className={`
            text-center py-1 cursor-pointer
            ${isSelectedDate ? 'bg-blue-600 text-white' : ''}
            ${isTodayDate && !isSelectedDate ? 'text-green-600 font-bold' : ''}
            hover:bg-gray-200
          `}
          onClick={() => handleDateClick(year, month, i)}
        >
          {i}
        </div>
      );
    }
    
    // Next month days
    const totalCells = 42; // 6 rows x 7 columns
    const remainingCells = totalCells - days.length;
    
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div 
          key={`next-${i}`} 
          className="text-gray-400 text-center py-1"
        >
          {i}
        </div>
      );
    }
    
    const handlePrevMonth = () => {
      if (isStartMonth) {
        if (month === 0) {
          setStartMonth(11);
          setStartYear(year - 1);
        } else {
          setStartMonth(month - 1);
        }
      } else {
        if (month === 0) {
          setEndMonth(11);
          setEndYear(year - 1);
        } else {
          setEndMonth(month - 1);
        }
      }
    };

    const handleNextMonth = () => {
      if (isStartMonth) {
        if (month === 11) {
          setStartMonth(0);
          setStartYear(year + 1);
        } else {
          setStartMonth(month + 1);
        }
      } else {
        if (month === 11) {
          setEndMonth(0);
          setEndYear(year + 1);
        } else {
          setEndMonth(month + 1);
        }
      }
    };

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <button onClick={handlePrevMonth} className="text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <select 
              value={months[month]} 
              onChange={(e) => {
                const selectedMonth = months.indexOf(e.target.value);
                if (isStartMonth) {
                  setStartMonth(selectedMonth);
                } else {
                  setEndMonth(selectedMonth);
                }
              }}
              className="border rounded px-2 py-1"
            >
              {months.map((m, idx) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select 
              value={year} 
              onChange={(e) => {
                const selectedYear = parseInt(e.target.value);
                if (isStartMonth) {
                  setStartYear(selectedYear);
                } else {
                  setEndYear(selectedYear);
                }
              }}
              className="border rounded px-2 py-1"
            >
              {Array.from({ length: 10 }, (_, i) => year - 5 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button onClick={handleNextMonth} className="text-gray-700">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          <div className="text-center font-medium text-gray-700">Mon</div>
          <div className="text-center font-medium text-gray-700">Tue</div>
          <div className="text-center font-medium text-gray-700">Wed</div>
          <div className="text-center font-medium text-gray-700">Thu</div>
          <div className="text-center font-medium text-gray-700">Fri</div>
          <div className="text-center font-medium text-gray-700">Sat</div>
          <div className="text-center font-medium text-gray-700">Sun</div>
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Top filters bar */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm mb-6">
        <div className="flex items-center">
          {/* Duration filter */}
          <div className="flex items-center px-4 py-3 relative" ref={durationDropdownRef}>
            <span className="text-sm font-medium text-gray-700 mr-2">Duration</span>
            <div 
              className="bg-gray-100 rounded-md px-3 py-1 text-sm cursor-pointer"
              onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
            >
              <span className="text-gray-700">{duration}</span>
            </div>
            
            {/* Duration dropdown */}
            {durationDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10">
                {durationOptions.map((option, index) => (
                  <div 
                    key={index}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      option === duration ? 'bg-blue-500 text-white' : ''
                    }`}
                    onClick={() => handleDurationSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
            
            {/* Calendar for date range */}
            {showCalendar && (
              <div 
                ref={calendarRef}
                className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-20 p-4 w-auto"
                style={{ width: '620px' }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Month Calendar */}
                  {renderCalendarMonth(startYear, startMonth, true)}
                  
                  {/* End Month Calendar */}
                  {renderCalendarMonth(endYear, endMonth, false)}
                </div>
                
                {/* Selected date range */}
                <div className="mt-4 py-2 border-t flex justify-between items-center">
                  <div className="text-sm">
                    {selectedStartDate && selectedEndDate
                      ? `${formatDate(selectedStartDate)} To ${formatDate(selectedEndDate)}`
                      : selectedStartDate
                      ? `${formatDate(selectedStartDate)} To -`
                      : 'Select a date range'}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelDateRange}
                      className="px-4 py-1 border border-gray-300 hover:bg-gray-100 rounded text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApplyDateRange}
                      className="px-4 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      disabled={!selectedStartDate || !selectedEndDate}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Vertical divider */}
          <div className="h-8 w-px bg-gray-300"></div>
          
          {/* Employee filter */}
          <div className="flex items-center px-4 py-3 relative" ref={employeeDropdownRef}>
            <span className="text-sm font-medium text-gray-700 mr-2">Employee</span>
            <div 
              className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-1 cursor-pointer"
              onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
            >
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                {currentEmployee.initials}
              </div>
              <span className="text-sm text-gray-700">{currentEmployee.name}</span>
              {currentEmployee.isYou && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">It's You</span>
              )}
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            {/* Employee dropdown */}
            {employeeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-10">
                {/* Search box */}
                <div className="p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full px-3 py-2 border rounded-md"
                    value={employeeSearchText}
                    onChange={(e) => setEmployeeSearchText(e.target.value)}
                  />
                </div>
                
                {/* Employee list */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredEmployees.map((emp) => (
                    <div 
                      key={emp.id}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        emp.name === employee ? 'bg-red-500 text-white' : ''
                      }`}
                      onClick={() => handleEmployeeChange(emp)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                          {emp.initials}
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{emp.name}</p>
                        </div>
                        {emp.isYou && (
                          <span className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded">it's you</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-gray-300"></div>
        </div>
        
        <div className="flex items-center flex-grow ml-4">
          {/* Search bar */}
          <div className="relative flex-grow px-2">
            <div className="flex items-center bg-gray-100 rounded-md w-full">
              <Search className="ml-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Start typing to search"
                className="w-full py-2 px-2 bg-gray-100 border-none rounded-md focus:outline-none focus:ring-0 text-sm"
              />
            </div>
          </div>
          
          {/* Vertical divider */}
          <div className="h-8 w-px bg-gray-300 mx-1"></div>
          
          {/* Filters button*/}
          <div className="px-4 py-2">
            <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action buttons and view selector */}
      <div className="flex justify-between mb-6">
        <div className="flex gap-3">
          <button 
            onClick={handleLogTime}
            className="flex items-center space-x-1 bg-blue-700 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900"
          >
            <Plus className="w-4 h-4" />
            <span>Log Time</span>
          </button>
          
          <button 
            onClick={handleExport}
            className="flex items-center space-x-1 border border-gray-300 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
        
        {/* View toggles */}
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button className="bg-black text-white px-4 py-2">
            <Table className="w-5 h-5" />
          </button>
          <button className="bg-white px-4 py-2 border-l border-gray-300">
            <Calendar className="w-5 h-5" />
          </button>
          <button className="bg-white px-4 py-2 border-l border-gray-300">
            <BarChart2 className="w-5 h-5" />
          </button>
          <button className="bg-white px-4 py-2 border-l border-gray-300">
            <User className="w-5 h-5" />
          </button>
          <button className="bg-white px-4 py-2 border-l border-gray-300">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b">
                <th className="py-3 px-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Start Time</th>
                <th className="py-3 px-4">End Time</th>
                <th className="py-3 px-4">Total Hours</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">No data available in table</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 text-sm border-t">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <div className="relative inline-block">
              <select
                className="appearance-none border rounded px-4 py-1 bg-white pr-8"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <span>entries</span>
          </div>

          <div className="flex items-center">
            <span className="mr-4">Showing 0 to 0 of 0 entries</span>
            <button 
              onClick={handlePrevious}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 mr-1"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              onClick={handleNext}
              className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200 text-blue-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}