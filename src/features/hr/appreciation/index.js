import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, Award, TrendingUp, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const darkClass = (lightClass, darkVariant) => `${lightClass} ${darkVariant}`;

const diligentEmployeesData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    department: 'Engineering',
    score: 98.5,
    color: 'bg-green-500'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    department: 'Product',
    score: 97.2,
    color: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Linda Garcia',
    avatar: 'LG',
    department: 'Marketing',
    score: 96.8,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    avatar: 'DR',
    department: 'Sales',
    score: 95.1,
    color: 'bg-indigo-500'
  },
  {
    id: 5,
    name: 'Emily White',
    avatar: 'EW',
    department: 'Human Resources',
    score: 94.5,
    color: 'bg-pink-500'
  },
];

const projectLeadersData = [
  {
    id: 1,
    name: 'Alex Martinez',
    avatar: 'AM',
    department: 'Engineering',
    projects: 12,
    color: 'bg-red-500'
  },
  {
    id: 2,
    name: 'Jessica Lee',
    avatar: 'JL',
    department: 'Engineering',
    projects: 10,
    color: 'bg-yellow-500'
  },
  {
    id: 3,
    name: 'Robert Brown',
    avatar: 'RB',
    department: 'Product',
    projects: 9,
    color: 'bg-teal-500'
  },
  {
    id: 4,
    name: 'Maria Hernandez',
    avatar: 'MH',
    department: 'Design',
    projects: 8,
    color: 'bg-orange-500'
  },
  {
    id: 5,
    name: 'Kevin Wilson',
    avatar: 'KW',
    department: 'Sales',
    projects: 7,
    color: 'bg-cyan-500'
  },
];

export default function AppreciationDashboard() {
  const [duration, setDuration] = useState('This Month');
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  const [calendarStartMonth, setCalendarStartMonth] = useState(today.getMonth());
  const [calendarStartYear, setCalendarStartYear] = useState(today.getFullYear());
  const [calendarEndMonth, setCalendarEndMonth] = useState(today.getMonth());
  const [calendarEndYear, setCalendarEndYear] = useState(today.getFullYear());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const durationDropdownRef = useRef(null);
  const calendarRef = useRef(null);

  const durationOptions = ['All Time', 'This Week', 'This Month', 'Custom Range'];

  useEffect(() => {
    function handleClickOutside(event) {
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) {
        setDurationDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target) && !durationDropdownRef.current?.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDurationSelect = (option) => {
    setDuration(option);
    setDurationDropdownOpen(false);
    if (option === 'Custom Range') {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
    }
  };

  const filteredDiligentData = useMemo(() => {
    if (duration === 'All Time') return diligentEmployeesData;
    // Implementasikan logika filter tanggal di sini jika diperlukan
    return diligentEmployeesData;
  }, [duration, selectedStartDate, selectedEndDate]);

  const filteredProjectsData = useMemo(() => {
    if (duration === 'All Time') return projectLeadersData;
    // Implementasikan logika filter tanggal di sini jika diperlukan
    return projectLeadersData;
  }, [duration, selectedStartDate, selectedEndDate]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Award className="w-5 h-5 text-yellow-500"/>;
      case 2: return <Award className="w-5 h-5 text-gray-400"/>;
      case 3: return <Award className="w-5 h-5 text-yellow-700"/>;
      default: return <span className="text-sm font-semibold">{rank}</span>;
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => (new Date(year, month, 1).getDay() + 6) % 7; // Monday first

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

  const renderCalendarMonth = (year, month, isStartCalendar) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(<div key={`prev-${i}`} className="py-1"></div>);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSelected = selectedStartDate && selectedEndDate && date >= selectedStartDate && date <= selectedEndDate;
      const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();

      days.push(
        <div key={i} onClick={() => handleDateClick(year, month, i)}
             className={`text-center py-1 text-sm cursor-pointer rounded ${isSelected ? 'bg-blue-600 text-white' : isToday ? 'text-green-600 font-semibold ring-1 ring-green-500' : 'text-gray-700 dark:text-gray-200'} ${!isSelected ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : ''}`}>
          {i}
        </div>
      );
    }

    const handleMonthNav = (dir) => {
      let newDate = new Date(year, month);
      newDate.setMonth(newDate.getMonth() + dir);
      if (isStartCalendar) { setCalendarStartMonth(newDate.getMonth()); setCalendarStartYear(newDate.getFullYear()); }
      else { setCalendarEndMonth(newDate.getMonth()); setCalendarEndYear(newDate.getFullYear()); }
    };

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2 px-1">
          <button onClick={() => handleMonthNav(-1)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"><ChevronLeft className="w-5 h-5"/></button>
          <span className="font-semibold">{monthNames[month]} {year}</span>
          <button onClick={() => handleMonthNav(1)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"><ChevronRight className="w-5 h-5"/></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs">{dayNames.map(day => <div key={day} className="text-center font-medium text-gray-500 dark:text-gray-400">{day}</div>)}{days}</div>
      </div>
    );
  };


  return (
    <div className={darkClass("px-4 sm:px-8 py-6 bg-gray-100 min-h-screen", "dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans")}>
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Appreciation Board</h1>
        <div className="relative" ref={durationDropdownRef}>
          <button onClick={() => setDurationDropdownOpen(!durationDropdownOpen)} className={darkClass("border rounded-md px-4 py-2 text-sm w-48 text-left flex items-center justify-between", "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700")}>
            <span>{duration}</span><ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
          </button>
          {durationDropdownOpen && !showCalendar && (
            <div className={darkClass("absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border", "dark:bg-gray-800 dark:border-gray-600")}>
              {durationOptions.map(option => (<div key={option} onClick={() => handleDurationSelect(option)} className={darkClass("px-4 py-2 cursor-pointer text-sm hover:bg-gray-100", "dark:hover:bg-gray-700")}>{option}</div>))}
            </div>
          )}
          {showCalendar && (
            <div ref={calendarRef} className={darkClass("absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl z-20 p-4 border", "dark:bg-gray-800 dark:border-gray-700")} style={{width: '640px'}}>
              <div className="grid grid-cols-2 gap-6">{renderCalendarMonth(calendarStartYear, calendarStartMonth, true)}{renderCalendarMonth(calendarEndYear, calendarEndMonth, false)}</div>
              <div className="mt-4 pt-3 border-t flex justify-end gap-2 dark:border-gray-700">
                <button onClick={() => setShowCalendar(false)} className="px-3 py-1 border rounded text-sm hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-gray-700">Cancel</button>
                <button onClick={() => { setShowCalendar(false); setDurationDropdownOpen(false); }} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Apply</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={darkClass("bg-white rounded-md shadow-sm overflow-hidden", "dark:bg-gray-800")}>
          <div className={darkClass("p-4 border-b", "dark:border-gray-700")}><h2 className="text-lg font-semibold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-500"/>Most Diligent Employees</h2></div>
          <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className={darkClass("bg-gray-50", "dark:bg-gray-700")}><tr className={darkClass("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", "dark:text-gray-300")}><th className="p-3 text-center">Rank</th><th className="p-3">Employee</th><th className="p-3">Department</th><th className="p-3 text-right">Attendance Score</th></tr></thead><tbody className={darkClass("divide-y", "divide-gray-200 dark:divide-gray-700")}>{filteredDiligentData.map((employee, index) => (<tr key={employee.id} className={darkClass("hover:bg-gray-50", "dark:hover:bg-gray-700/50")}><td className="p-3 w-16 text-center flex justify-center items-center h-full">{getRankIcon(index + 1)}</td><td className="p-3 whitespace-nowrap"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full ${employee.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}>{employee.avatar}</div><span className={darkClass("font-medium text-gray-900", "dark:text-gray-100")}>{employee.name}</span></div></td><td className="p-3 whitespace-nowrap text-gray-600 dark:text-gray-300">{employee.department}</td><td className="p-3 whitespace-nowrap text-right"><div className="flex items-center justify-end gap-2"><span className="font-semibold text-gray-700 dark:text-gray-200">{employee.score}%</span><div className={darkClass("w-24 h-2 bg-gray-200 rounded-full overflow-hidden", "dark:bg-gray-600")}><div className="h-full bg-green-500" style={{width: `${employee.score}%`}}></div></div></div></td></tr>))}</tbody></table></div>
        </div>
        <div className={darkClass("bg-white rounded-md shadow-sm overflow-hidden", "dark:bg-gray-800")}>
          <div className={darkClass("p-4 border-b", "dark:border-gray-700")}><h2 className="text-lg font-semibold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500"/>Most Projects Completed</h2></div>
          <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className={darkClass("bg-gray-50", "dark:bg-gray-700")}><tr className={darkClass("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", "dark:text-gray-300")}><th className="p-3 text-center">Rank</th><th className="p-3">Employee</th><th className="p-3">Department</th><th className="p-3 text-center">Projects Done</th></tr></thead><tbody className={darkClass("divide-y", "divide-gray-200 dark:divide-gray-700")}>{filteredProjectsData.map((employee, index) => (<tr key={employee.id} className={darkClass("hover:bg-gray-50", "dark:hover:bg-gray-700/50")}><td className="p-3 w-16 text-center flex justify-center items-center h-full">{getRankIcon(index + 1)}</td><td className="p-3 whitespace-nowrap"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full ${employee.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}>{employee.avatar}</div><span className={darkClass("font-medium text-gray-900", "dark:text-gray-100")}>{employee.name}</span></div></td><td className="p-3 whitespace-nowrap text-gray-600 dark:text-gray-300">{employee.department}</td><td className="p-3 whitespace-nowrap text-center"><span className={darkClass("px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full", "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100")}>{employee.projects}</span></td></tr>))}</tbody></table></div>
        </div>
      </div>
    </div>
  );
}