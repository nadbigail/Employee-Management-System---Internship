import { BarChart2, Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Download, Edit2, Filter, HelpCircle, Plus, Search, Table as TableIcon, Trash2, User, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

// Helper to conditionally apply dark mode classes
const darkClass = (lightClass, darkVariant) => `${lightClass} ${darkVariant}`;

const initialTimeEntries = [
  {
    id: '1',
    code: 'TSK001',
    task: 'Design Landing Page',
    employee: 'Alice Johnson',
    project: 'Website Revamp',
    startTime: '2025-05-01T09:00',
    endTime: '2025-05-01T17:00',
    hours: '8h',
  },
  {
    id: '2',
    code: 'TSK002',
    task: 'Fix Payment Bug',
    employee: 'John Doe',
    project: 'Mobile App Phase 2',
    startTime: '2025-05-02T10:00',
    endTime: '2025-05-02T16:00',
    hours: '6h',
  },
  {
    id: '3',
    code: 'TSK003',
    task: 'Develop Dashboard',
    employee: 'Nadine Abigail',
    project: 'Internal Tools',
    startTime: '2025-05-03T08:30',
    endTime: '2025-05-03T17:00',
    hours: '8.5h',
  },
];

const PROJECTS_LIST = ['Website Revamp', 'Mobile App Phase 2', 'Internal Tools', 'Marketing Campaign Q2', 'Client X Support'];
const TASK_CODES_LIST = ['TSK001', 'TSK002', 'TSK003', 'TSK004', 'TSK005', 'GEN001'];


export default function TimeTrackingDashboard() {
  const [timeEntries, setTimeEntries] = useState(() => {
    const savedEntries = localStorage.getItem('timeTrackingEntries');
    return savedEntries ? JSON.parse(savedEntries) : initialTimeEntries.map(entry => ({
      ...entry,
      id: entry.id || crypto.randomUUID()
    }));
  });

  const [mainSearchQuery, setMainSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [employeeSearchText, setEmployeeSearchText] = useState('');
  const [duration, setDuration] = useState('All Time'); // Default to All Time
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState('All');


  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  const [startMonth, setStartMonth] = useState(today.getMonth());
  const [startYear, setStartYear] = useState(today.getFullYear());
  const [endMonth, setEndMonth] = useState(today.getMonth());
  const [endYear, setEndYear] = useState(today.getFullYear());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const durationDropdownRef = useRef(null);
  const employeeDropdownRef = useRef(null);
  const calendarRef = useRef(null);

  const [showLogTimeModal, setShowLogTimeModal] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);
  const [logFormData, setLogFormData] = useState({
    code: '',
    task: '',
    employee: 'John Doe', // Default to "You"
    project: PROJECTS_LIST[0] || '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    localStorage.setItem('timeTrackingEntries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  const durationOptions = [
    'All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'
  ];

  const employeeOptions = useMemo(() => {
    const uniqueEmployees = [...new Set(timeEntries.map(entry => entry.employee))];
    if (!uniqueEmployees.includes('John Doe')) {
      uniqueEmployees.unshift('John Doe'); // Ensure "You" is an option
    }
    return uniqueEmployees.sort().map((name, index) => ({
      id: index + 1,
      name: name,
      isYou: name === 'John Doe',
      initials: name.split(' ').map(n => n[0]).join('').toUpperCase()
    }));
  }, [timeEntries]);

  const currentSelectedEmployeeDetails = employeeOptions.find(emp => emp.name === selectedEmployeeFilter) || employeeOptions.find(e => e.isYou && selectedEmployeeFilter === 'All') || employeeOptions[0] || {
    name: 'All',
    initials: 'All',
    isYou: false
  };


  const filteredEmployeesForDropdown = employeeOptions.filter(emp =>
    emp.name.toLowerCase().includes(employeeSearchText.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) {
        setDurationDropdownOpen(false);
      }
      if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
        setEmployeeDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target) && !durationDropdownRef.current?.contains(event.target)) {
        const durationButton = durationDropdownRef.current?.querySelector('[data-duration-button]');
        if (durationButton && durationButton.contains(event.target)) return;
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogFormChange = (e) => {
    const {name, value} = e.target;
    setLogFormData(prev => ({...prev, [name]: value}));
  };

  const calculateHours = (start, end) => {
    if (!start || !end) return '0h';
    const startTime = new Date(start);
    const endTime = new Date(end);
    if (isNaN(startTime) || isNaN(endTime) || endTime <= startTime) return '0h';
    const diffMs = endTime - startTime;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return `${diffHrs.toFixed(1)}h`;
  };

  const handleLogTimeSubmit = (e) => {
    e.preventDefault();
    const hours = calculateHours(logFormData.startTime, logFormData.endTime);
    if (editingLogId) {
      setTimeEntries(timeEntries.map(entry =>
        entry.id === editingLogId ? {...entry, ...logFormData, hours} : entry
      ));
    } else {
      setTimeEntries([{...logFormData, id: crypto.randomUUID(), hours}, ...timeEntries]);
    }
    setShowLogTimeModal(false);
    setEditingLogId(null);
  };

  const openCreateLogModal = () => {
    setEditingLogId(null);
    const now = new Date();
    const defaultStartTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setLogFormData({
      code: TASK_CODES_LIST[0] || '',
      task: '',
      employee: 'John Doe',
      project: PROJECTS_LIST[0] || '',
      startTime: defaultStartTime,
      endTime: '',
    });
    setShowLogTimeModal(true);
  };

  const openEditLogModal = (log) => {
    setEditingLogId(log.id);
    setLogFormData({...log});
    setShowLogTimeModal(true);
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      setTimeEntries(timeEntries.filter(entry => entry.id !== logId));
    }
  };

  const handleExport = () => console.log('Export clicked');

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [datePart, timePart] = dateString.split('T');
    if (!datePart || !timePart) {
      const d = new Date(dateString);
      return isNaN(d) ? null : d;
    }
    return new Date(dateString);
  };


  const filteredTimeEntries = useMemo(() => {
    let entries = timeEntries;

    if (selectedEmployeeFilter !== 'All') {
      entries = entries.filter(entry => entry.employee === selectedEmployeeFilter);
    }

    if (duration !== 'All Time' && duration !== 'Custom Range') {
      const now = new Date();
      let startDateRange = new Date();
      let endDateRange = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      switch (duration) {
        case 'Today':
          startDateRange = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'Last 7 Days':
          startDateRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
          break;
        case 'Last 30 Days':
          startDateRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
          break;
        case 'This Month':
          startDateRange = new Date(now.getFullYear(), now.getMonth(), 1);
          endDateRange = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
        case 'Last Month':
          startDateRange = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDateRange = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
          break;
      }
      entries = entries.filter(entry => {
        const entryDate = parseDate(entry.startTime);
        return entryDate && entryDate >= startDateRange && entryDate <= endDateRange;
      });
    } else if (selectedStartDate && selectedEndDate && duration.includes('To')) { // Custom Range
      const rangeStart = new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), selectedStartDate.getDate());
      const rangeEnd = new Date(selectedEndDate.getFullYear(), selectedEndDate.getMonth(), selectedEndDate.getDate(), 23, 59, 59, 999);
      entries = entries.filter(entry => {
        const entryDate = parseDate(entry.startTime);
        return entryDate && entryDate >= rangeStart && entryDate <= rangeEnd;
      });
    }
    // If duration is 'All Time', no date filtering is applied here.

    if (mainSearchQuery) {
      entries = entries.filter(entry =>
        entry.task.toLowerCase().includes(mainSearchQuery.toLowerCase()) ||
        entry.code.toLowerCase().includes(mainSearchQuery.toLowerCase()) ||
        entry.project.toLowerCase().includes(mainSearchQuery.toLowerCase()) ||
        entry.employee.toLowerCase().includes(mainSearchQuery.toLowerCase())
      );
    }
    return entries;
  }, [timeEntries, mainSearchQuery, selectedEmployeeFilter, duration, selectedStartDate, selectedEndDate]);


  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredTimeEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredTimeEntries.length / entriesPerPage);

  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleEmployeeFilterChange = (emp) => {
    setSelectedEmployeeFilter(emp.name);
    setEmployeeDropdownOpen(false);
    setCurrentPage(1);
  };

  const handleDurationSelect = (option) => {
    setDuration(option);
    setCurrentPage(1);
    if (option === 'Custom Range') {
      setShowCalendar(true);
      const todayForCalendar = new Date();
      const start = selectedStartDate || todayForCalendar;
      const end = selectedEndDate || todayForCalendar;
      setSelectedStartDate(start);
      setSelectedEndDate(end);
      setStartMonth(start.getMonth());
      setStartYear(start.getFullYear());
      setEndMonth(end.getMonth());
      setEndYear(end.getFullYear());
    } else {
      setDurationDropdownOpen(false);
      setShowCalendar(false);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
    }
  };

  const formatDateForDisplay = (date) => {
    if (!date) return '';
    const options = {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'};
    return date.toLocaleDateString('en-US', options);
  };

  const handleApplyDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      setDuration(`${formatDateForDisplay(selectedStartDate)} To ${formatDateForDisplay(selectedEndDate)}`);
    } else if (selectedStartDate) {
      setDuration(formatDateForDisplay(selectedStartDate));
    }
    setShowCalendar(false);
    setDurationDropdownOpen(false);
    setCurrentPage(1);
  };

  const handleCancelDateRange = () => {
    setShowCalendar(false);
    setDurationDropdownOpen(false);
    if (!duration.includes('To') && duration !== 'Today' && !duration.startsWith('Last') && duration !== 'All Time' && duration !== 'This Month') {
      setDuration('All Time');
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => (new Date(year, month, 1).getDay() + 6) % 7;

  const handleDateClick = (year, month, day) => {
    const newDate = new Date(year, month, day);
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
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

  const isTodayDate = (year, month, day) => {
    const todayCal = new Date();
    return day === todayCal.getDate() && month === todayCal.getMonth() && year === todayCal.getFullYear();
  };

  const renderCalendarMonth = (year, month, isStartCalendar) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`prev-${i}`} className="py-1"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = isDateSelected(year, month, i);
      const isCurrentDay = isTodayDate(year, month, i);
      days.push(
        <div
          key={i}
          className={`text-center py-1 text-sm cursor-pointer rounded
            ${isSelected ? 'bg-blue-600 text-white' : isCurrentDay ? 'text-green-600 font-semibold ring-1 ring-green-500' : 'text-gray-700 dark:text-gray-200'}
            ${!isSelected ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : ''}
          `}
          onClick={() => handleDateClick(year, month, i)}
        >
          {i}
        </div>
      );
    }

    const handleMonthNav = (direction) => {
      let newMonth, newYear;
      if (direction === 'prev') {
        newMonth = month === 0 ? 11 : month - 1;
        newYear = month === 0 ? year - 1 : year;
      } else {
        newMonth = month === 11 ? 0 : month + 1;
        newYear = month === 11 ? year + 1 : year;
      }
      if (isStartCalendar) {
        setStartMonth(newMonth);
        setStartYear(newYear);
      } else {
        setEndMonth(newMonth);
        setEndYear(newYear);
      }
    };

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2 px-1">
          <button onClick={() => handleMonthNav('prev')}
                  className={darkClass("p-1 rounded hover:bg-gray-200", "dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300")}>
            <ChevronLeft className="w-5 h-5"/>
          </button>
          <div className="flex items-center space-x-1">
            <select
              value={month}
              onChange={(e) => isStartCalendar ? setStartMonth(parseInt(e.target.value)) : setEndMonth(parseInt(e.target.value))}
              className={darkClass("border rounded px-2 py-1 text-sm", "bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600")}
            >
              {monthNames.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
            </select>
            <select
              value={year}
              onChange={(e) => isStartCalendar ? setStartYear(parseInt(e.target.value)) : setEndYear(parseInt(e.target.value))}
              className={darkClass("border rounded px-2 py-1 text-sm", "bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600")}
            >
              {Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i).map(y => <option key={y}
                                                                                                     value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={() => handleMonthNav('next')}
                  className={darkClass("p-1 rounded hover:bg-gray-200", "dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300")}>
            <ChevronRight className="w-5 h-5"/>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {dayNames.map(day => <div key={day}
                                    className={darkClass("text-center font-medium text-gray-500", "dark:text-gray-400")}>{day}</div>)}
          {days}
        </div>
      </div>
    );
  };


  return (
    <div
      className={darkClass("px-4 sm:px-8 py-6 bg-gray-100 min-h-screen", "dark:bg-gray-900 text-gray-800 dark:text-gray-100")}>
      <div
        className={darkClass("flex flex-wrap gap-4 items-center bg-white p-4 rounded shadow mb-6", "dark:bg-gray-800")}>
        <div className="flex items-center space-x-2 relative" ref={durationDropdownRef}>
          <span className={darkClass("text-sm text-gray-600", "dark:text-gray-300")}>Duration</span>
          <button
            data-duration-button
            onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
            className={darkClass("border rounded px-3 py-1.5 text-sm w-56 text-left truncate", "bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600")}
          >
            {duration}
          </button>
          {durationDropdownOpen && !showCalendar && (
            <div
              className={darkClass("absolute top-full left-0 mt-1 w-56 bg-white rounded shadow-lg z-10 border", "dark:bg-gray-700 dark:border-gray-600")}>
              {durationOptions.map((option) => (
                <div
                  key={option}
                  className={darkClass(`px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 ${option === duration ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`,
                    `dark:hover:bg-gray-600 ${option === duration ? 'dark:text-white' : 'dark:text-gray-200'}`)}
                  onClick={() => handleDurationSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
          {showCalendar && (
            <div
              ref={calendarRef}
              className={darkClass("absolute top-full left-0 mt-1 bg-white rounded shadow-lg z-20 p-4 border", "dark:bg-gray-800 dark:border-gray-700")}
              style={{width: '640px'}}
            >
              <div className="grid grid-cols-2 gap-6">
                {renderCalendarMonth(startYear, startMonth, true)}
                {renderCalendarMonth(endYear, endMonth, false)}
              </div>
              <div
                className={darkClass("mt-4 pt-3 border-t flex justify-between items-center", "dark:border-gray-700")}>
                <div className={darkClass("text-xs text-gray-600", "dark:text-gray-300")}>
                  {selectedStartDate && selectedEndDate ? `${formatDateForDisplay(selectedStartDate)} - ${formatDateForDisplay(selectedEndDate)}`
                    : selectedStartDate ? `${formatDateForDisplay(selectedStartDate)} - Select end date`
                      : 'Select a date range'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelDateRange}
                    className={darkClass("px-3 py-1 border rounded text-sm", "text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700")}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyDateRange}
                    className={`px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 ${(!selectedStartDate || !selectedEndDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!selectedStartDate || !selectedEndDate}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 relative" ref={employeeDropdownRef}>
          <span className={darkClass("text-sm text-gray-600", "dark:text-gray-300")}>Employee</span>
          <button
            onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
            className={darkClass("border rounded px-3 py-1.5 text-sm flex items-center space-x-2 min-w-[180px]", "bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600")}
          >
            <div
              className={`w-5 h-5 ${currentSelectedEmployeeDetails.isYou ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'} rounded-full flex items-center justify-center text-white text-xs font-semibold`}>
              {currentSelectedEmployeeDetails.initials}
            </div>
            <span className="text-gray-700 dark:text-gray-100 truncate">{currentSelectedEmployeeDetails.name}</span>
            {currentSelectedEmployeeDetails.isYou && selectedEmployeeFilter !== 'All' && (
              <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-sm">You</span>
            )}
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 ml-auto"/>
          </button>
          {employeeDropdownOpen && (
            <div
              className={darkClass("absolute top-full left-0 mt-1 w-64 bg-white rounded shadow-lg z-10 border", "dark:bg-gray-700 dark:border-gray-600")}>
              <div className="p-2 border-b dark:border-gray-600">
                <button
                  onClick={() => handleEmployeeFilterChange({name: 'All', initials: 'All', isYou: false})}
                  className={darkClass(`w-full text-left px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 ${selectedEmployeeFilter === 'All' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`,
                    `dark:hover:bg-gray-600 ${selectedEmployeeFilter === 'All' ? 'dark:text-white' : 'dark:text-gray-200'}`)}
                >
                  All Employees
                </button>
                <input
                  type="text"
                  placeholder="Search employees..."
                  className={darkClass("w-full border rounded px-2 py-1 text-sm mt-1", "bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500 placeholder-gray-400 dark:placeholder-gray-400")}
                  value={employeeSearchText}
                  onChange={(e) => setEmployeeSearchText(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredEmployeesForDropdown.map((emp) => (
                  <div
                    key={emp.id}
                    className={darkClass(`p-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-2 ${emp.name === selectedEmployeeFilter ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`,
                      `dark:hover:bg-gray-600 ${emp.name === selectedEmployeeFilter ? 'dark:text-white' : 'dark:text-gray-200'}`)}
                    onClick={() => handleEmployeeFilterChange(emp)}
                  >
                    <div
                      className={`w-7 h-7 ${emp.isYou ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-500'} rounded-full flex items-center justify-center text-white dark:text-gray-800 text-xs font-semibold`}>
                      {emp.initials}
                    </div>
                    <span className="text-sm">{emp.name}</span>
                    {emp.isYou && (
                      <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-sm ml-auto">You</span>)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-grow max-w-xs">
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className={darkClass("border pl-8 pr-3 py-1.5 rounded text-sm w-full", "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-400")}
            value={mainSearchQuery}
            onChange={(e) => {
              setMainSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search
            className={darkClass("absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400", "dark:text-gray-300")}/>
        </div>

        <button
          className={darkClass("ml-auto border px-3 py-1.5 text-sm rounded flex items-center", "text-gray-600 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700")}>
          <Filter className="mr-2 w-4 h-4"/>
          Filters
        </button>
      </div>


      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={openCreateLogModal}
            className="flex items-center space-x-1 bg-blue-800 dark:bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4"/>
            <span>Log Time</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-1 bg-green-800 dark:bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 dark:hover:bg-green-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4"/>
            <span>Export</span>
          </button>
        </div>
        <div className={darkClass("flex border rounded overflow-hidden", "border-gray-300 dark:border-gray-600")}>
          {[{Icon: TableIcon, active: true, name: 'Table'}, {Icon: CalendarIcon, name: 'Calendar'}, {
            Icon: BarChart2,
            name: 'Reports'
          }, {Icon: User, name: 'Team'}, {Icon: HelpCircle, name: 'Help'}].map(({Icon, active, name}, idx) => (
            <button
              key={idx}
              title={name}
              className={`px-3 py-1.5 border-l first:border-l-0
                ${active ? 'bg-gray-600 dark:bg-gray-700 text-white' : darkClass('bg-white hover:bg-gray-50', 'dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300')}
                ${darkClass('border-gray-300', 'dark:border-gray-600')}
              `}
            >
              <Icon className="w-5 h-5"/>
            </button>
          ))}
        </div>
      </div>

      <div className={darkClass("bg-white rounded shadow", "dark:bg-gray-800")}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto">
            <thead className={darkClass("bg-gray-50 text-left text-gray-600", "dark:bg-gray-700 dark:text-gray-300")}>
            <tr>
              <th className={darkClass("px-4 py-3 border-b w-10", "dark:border-gray-600")}>
                <input type="checkbox"
                       className={darkClass("rounded border-gray-300 text-blue-600 focus:ring-blue-500", "dark:border-gray-500 dark:bg-gray-700 dark:focus:ring-offset-gray-800")}/>
              </th>
              <th className={darkClass("px-4 py-3 border-b", "dark:border-gray-600")}>#</th>
              <th className={darkClass("px-4 py-3 border-b", "dark:border-gray-600")}>Code</th>
              <th className={darkClass("px-4 py-3 border-b", "dark:border-gray-600")}>Task</th>
              <th className={darkClass("px-4 py-3 border-b", "dark:border-gray-600")}>Project</th>
              <th className={darkClass("px-4 py-3 border-b", "dark:border-gray-600")}>Employee</th>
              <th className={darkClass("px-4 py-3 border-b", "dark:border-gray-600")}>Start Time</th>
              <th className={darkClass("px-4 py-3 border-b", "dark:border-gray-600")}>End Time</th>
              <th className={darkClass("px-4 py-3 border-b", "dark:border-gray-600")}>Total Hours</th>
              <th className={darkClass("px-4 py-3 border-b", "dark:border-gray-600")}>Action</th>
            </tr>
            </thead>
            <tbody className={darkClass("divide-y", "divide-gray-200 dark:divide-gray-700")}>
            {currentEntries.length > 0 ? currentEntries.map((item, index) => (
              <tr key={item.id || index} className={darkClass("hover:bg-gray-50", "dark:hover:bg-gray-700/50")}>
                <td className={darkClass("px-4 py-2 border-b", "dark:border-gray-600")}>
                  <input type="checkbox"
                         className={darkClass("rounded border-gray-300 text-blue-600 focus:ring-blue-500", "dark:border-gray-500 dark:bg-gray-700 dark:focus:ring-offset-gray-800")}/>
                </td>
                <td
                  className={darkClass("px-4 py-2 border-b text-gray-500", "dark:border-gray-600 dark:text-gray-400")}>{(indexOfFirstEntry + index + 1)}</td>
                <td className={darkClass("px-4 py-2 border-b", "dark:border-gray-600")}>{item.code}</td>
                <td className={darkClass("px-4 py-2 border-b", "dark:border-gray-600")}>{item.task}</td>
                <td className={darkClass("px-4 py-2 border-b", "dark:border-gray-600")}>{item.project}</td>
                <td className={darkClass("px-4 py-2 border-b", "dark:border-gray-600")}>{item.employee}</td>
                <td
                  className={darkClass("px-4 py-2 border-b", "dark:border-gray-600")}>{item.startTime ? new Date(item.startTime).toLocaleString() : '-'}</td>
                <td
                  className={darkClass("px-4 py-2 border-b", "dark:border-gray-600")}>{item.endTime ? new Date(item.endTime).toLocaleString() : '-'}</td>
                <td className={darkClass("px-4 py-2 border-b", "dark:border-gray-600")}>{item.hours}</td>
                <td className={darkClass("px-4 py-2 border-b", "dark:border-gray-600")}>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => openEditLogModal(item)}
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 p-1" title="Edit Log">
                      <Edit2 size={16}/></button>
                    <button onClick={() => handleDeleteLog(item.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1" title="Delete Log">
                      <Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="text-center py-10 text-gray-500 dark:text-gray-400">No time entries found.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {filteredTimeEntries.length > 0 && (
          <div
            className={darkClass("flex flex-col sm:flex-row justify-between items-center mt-0 p-4 text-sm border-t", "dark:border-gray-700 text-gray-600 dark:text-gray-300")}>
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span>Show</span>
              <div className="relative inline-block">
                <select
                  className={darkClass("appearance-none border rounded px-3 py-1 pr-7", "bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600")}
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                <ChevronDown
                  className={darkClass("pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 w-5 h-full text-gray-500", "dark:text-gray-400")}/>
              </div>
              <span>entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Showing {Math.min(indexOfFirstEntry + 1, filteredTimeEntries.length)} to {Math.min(indexOfLastEntry, filteredTimeEntries.length)} of {filteredTimeEntries.length} entries</span>
              <button
                onClick={handlePrevious}
                className={darkClass("px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50", "dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:opacity-50")}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className={darkClass("px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50", "dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:opacity-50")}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showLogTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={darkClass("bg-white rounded-lg shadow-xl w-full max-w-lg p-6", "dark:bg-gray-800")}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={darkClass("text-xl font-semibold text-gray-800", "dark:text-gray-100")}>
                {editingLogId ? 'Edit Time Entry' : 'Log New Time'}
              </h3>
              <button onClick={() => setShowLogTimeModal(false)}
                      className={darkClass("text-gray-500 hover:text-gray-700", "dark:text-gray-400 dark:hover:text-gray-200")}>
                <X size={24}/>
              </button>
            </div>
            <form onSubmit={handleLogTimeSubmit}>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label htmlFor="logTaskCode"
                         className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Task
                    Code</label>
                  <select name="code" id="logTaskCode" value={logFormData.code} onChange={handleLogFormChange} required
                          className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")}>
                    <option value="" disabled>Select Code</option>
                    {TASK_CODES_LIST.map(code => <option key={code} value={code}>{code}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="logTask"
                         className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Task
                    Description</label>
                  <input type="text" name="task" id="logTask" value={logFormData.task} onChange={handleLogFormChange}
                         required placeholder="e.g., Implemented feature X"
                         className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")}/>
                </div>
                <div>
                  <label htmlFor="logProject"
                         className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Project</label>
                  <select name="project" id="logProject" value={logFormData.project} onChange={handleLogFormChange}
                          required
                          className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")}>
                    <option value="" disabled>Select Project</option>
                    {PROJECTS_LIST.map(proj => <option key={proj} value={proj}>{proj}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="logEmployee"
                         className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Employee</label>
                  <select name="employee" id="logEmployee" value={logFormData.employee} onChange={handleLogFormChange}
                          required
                          className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")}>
                    {employeeOptions.map(emp => <option key={emp.id}
                                                        value={emp.name}>{emp.name}{emp.isYou ? ' (You)' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="logStartTime"
                         className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Start
                    Time</label>
                  <input type="datetime-local" name="startTime" id="logStartTime" value={logFormData.startTime}
                         onChange={handleLogFormChange} required
                         className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")}/>
                </div>
                <div>
                  <label htmlFor="logEndTime"
                         className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>End
                    Time</label>
                  <input type="datetime-local" name="endTime" id="logEndTime" value={logFormData.endTime}
                         onChange={handleLogFormChange} required
                         className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")}/>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowLogTimeModal(false)}
                        className={darkClass("px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50", "border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700")}>
                  Cancel
                </button>
                <button type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white">
                  {editingLogId ? 'Save Changes' : 'Log Time'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}