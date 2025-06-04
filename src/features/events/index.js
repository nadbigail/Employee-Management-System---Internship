import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit2,
  Filter as FilterIcon,
  Plus,
  Search,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

// Helper to conditionally apply dark mode classes
const darkClass = (lightClass, darkVariant) => `${lightClass} ${darkVariant}`;

const initialEvents = [
  {
    id: crypto.randomUUID(),
    eventName: 'Company Town Hall Q2',
    eventDate: '2025-06-15',
    eventTime: '10:00',
    location: 'Main Auditorium & Online',
    description: 'Quarterly company update, Q&A session with leadership.',
    attendees: ['All Employees', 'John Doe'],
    status: 'Upcoming',
    category: 'Company Wide'
  },
  {
    id: crypto.randomUUID(),
    eventName: 'React Workshop for Devs',
    eventDate: '2025-07-05',
    eventTime: '14:00',
    location: 'Training Room 3 / Zoom',
    description: 'Advanced React patterns and performance optimization.',
    attendees: ['Engineering Team', 'Alice Wonderland'],
    status: 'Upcoming',
    category: 'Workshop'
  },
  {
    id: crypto.randomUUID(),
    eventName: 'Product Launch: Alpha X',
    eventDate: '2025-05-20',
    eventTime: '11:00',
    location: 'Grand Ballroom, Hotel Central',
    description: 'Official launch event for our new flagship product Alpha X.',
    attendees: ['Sales Team', 'Marketing Team', 'Key Clients', 'Media'],
    status: 'Completed',
    category: 'Product Launch'
  },
  {
    id: crypto.randomUUID(),
    eventName: 'Team Building: Outdoor Adventure',
    eventDate: '2025-08-10',
    eventTime: '09:00',
    location: 'Pinecrest National Park',
    description: 'Annual team building event with various outdoor activities.',
    attendees: ['All Departments'],
    status: 'Upcoming',
    category: 'Social'
  },
  {
    id: crypto.randomUUID(),
    eventName: 'Charity Drive Kick-off',
    eventDate: '2025-04-28',
    eventTime: '09:30',
    location: 'Company Cafeteria',
    description: 'Kick-off meeting for the annual charity drive.',
    attendees: ['Volunteer Committee', 'HR Department'],
    status: 'Completed',
    category: 'CSR Activity'
  }
];

const EVENT_STATUS_OPTIONS = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled', 'Postponed'];
const EVENT_CATEGORY_OPTIONS = ['Company Wide', 'Departmental', 'Workshop', 'Seminar', 'Product Launch', 'Social', 'CSR Activity', 'Meeting'];

export default function EventManagementDashboard() {
  const [events, setEvents] = useState(initialEvents.map(e => ({...e, id: e.id || crypto.randomUUID()})));
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [duration, setDuration] = useState('All Time');

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);

  const statusDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const durationDropdownRef = useRef(null);
  const calendarRef = useRef(null);

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventAttendees, setNewEventAttendees] = useState('');
  const [newEventStatus, setNewEventStatus] = useState(EVENT_STATUS_OPTIONS[0]);
  const [newEventCategory, setNewEventCategory] = useState(EVENT_CATEGORY_OPTIONS[0]);

  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  const [calendarStartMonth, setCalendarStartMonth] = useState(today.getMonth());
  const [calendarStartYear, setCalendarStartYear] = useState(today.getFullYear());
  const [calendarEndMonth, setCalendarEndMonth] = useState(today.getMonth());
  const [calendarEndYear, setCalendarEndYear] = useState(today.getFullYear());
  const [selectedCalendarStartDate, setSelectedCalendarStartDate] = useState(null);
  const [selectedCalendarEndDate, setSelectedCalendarEndDate] = useState(null);

  const durationOptions = ['All Time', 'Today', 'This Week', 'This Month', 'Next 7 Days', 'Next 30 Days', 'Custom Range'];

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) setStatusDropdownOpen(false);
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) setCategoryDropdownOpen(false);
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) setDurationDropdownOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(event.target) && !durationDropdownRef.current?.contains(event.target)) {
        const durationButton = durationDropdownRef.current?.querySelector('[data-duration-button]');
        if (durationButton && durationButton.contains(event.target)) return;
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetFormFields = () => {
    setNewEventName('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventLocation('');
    setNewEventDescription('');
    setNewEventAttendees('');
    setNewEventStatus(EVENT_STATUS_OPTIONS[0]);
    setNewEventCategory(EVENT_CATEGORY_OPTIONS[0]);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!newEventName || !newEventDate || !newEventTime || !newEventLocation || !newEventStatus || !newEventCategory) {
      alert("Please fill in all required fields: Event Name, Date, Time, Location, Status, and Category.");
      return;
    }

    const eventData = {
      eventName: newEventName,
      eventDate: newEventDate,
      eventTime: newEventTime,
      location: newEventLocation,
      description: newEventDescription,
      attendees: newEventAttendees.split(',').map(att => att.trim()).filter(att => att),
      status: newEventStatus,
      category: newEventCategory,
    };

    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...eventData } : ev));
      alert('Event updated successfully!');
    } else {
      setEvents(prevEvents => [{ id: crypto.randomUUID(), ...eventData }, ...prevEvents]);
      alert('Event added successfully!');
    }
    resetFormFields();
    setEditingEvent(null);
    setShowAddEventModal(false);
  };

  const openAddModal = () => {
    setEditingEvent(null);
    resetFormFields();
    setShowAddEventModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setNewEventName(event.eventName);
    setNewEventDate(event.eventDate);
    setNewEventTime(event.eventTime);
    setNewEventLocation(event.location);
    setNewEventDescription(event.description);
    setNewEventAttendees(event.attendees.join(', '));
    setNewEventStatus(event.status);
    setNewEventCategory(event.category);
    setShowAddEventModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleExport = () => console.log('Exporting events...', filteredEvents);

  const parseEventDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-'); // Expects YYYY-MM-DD
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return null;
  };

  const filteredEvents = useMemo(() => {
    let tempEvents = [...events];

    if (statusFilter !== 'All') {
      tempEvents = tempEvents.filter(event => event.status === statusFilter);
    }
    if (categoryFilter !== 'All') {
      tempEvents = tempEvents.filter(event => event.category === categoryFilter);
    }

    if (duration !== 'All Time' && duration !== 'Custom Range') {
      const now = new Date();
      now.setHours(0,0,0,0); // Normalize to start of day for comparisons
      let startDateRange = new Date(now);
      let endDateRange = new Date(now);
      endDateRange.setHours(23,59,59,999);


      switch (duration) {
        case 'Today':
          // startDateRange and endDateRange are already set for today
          break;
        case 'This Week':
          const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
          const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to make Monday the start of the week
          startDateRange = new Date(now.setDate(now.getDate() + diffToMonday));
          endDateRange = new Date(startDateRange);
          endDateRange.setDate(startDateRange.getDate() + 6);
          endDateRange.setHours(23,59,59,999);
          break;
        case 'This Month':
          startDateRange = new Date(now.getFullYear(), now.getMonth(), 1);
          endDateRange = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23,59,59,999);
          break;
        case 'Next 7 Days':
          endDateRange = new Date(now);
          endDateRange.setDate(now.getDate() + 6);
          endDateRange.setHours(23,59,59,999);
          break;
        case 'Next 30 Days':
          endDateRange = new Date(now);
          endDateRange.setDate(now.getDate() + 29);
          endDateRange.setHours(23,59,59,999);
          break;
      }
      tempEvents = tempEvents.filter(event => {
        const eventDate = parseEventDate(event.eventDate);
        return eventDate && eventDate >= startDateRange && eventDate <= endDateRange;
      });
    } else if (duration.includes('To') && selectedCalendarStartDate && selectedCalendarEndDate) { // Custom Range
      const rangeStart = new Date(selectedCalendarStartDate.getFullYear(), selectedCalendarStartDate.getMonth(), selectedCalendarStartDate.getDate());
      const rangeEnd = new Date(selectedCalendarEndDate.getFullYear(), selectedCalendarEndDate.getMonth(), selectedCalendarEndDate.getDate(), 23, 59, 59, 999);
      tempEvents = tempEvents.filter(event => {
        const eventDate = parseEventDate(event.eventDate);
        return eventDate && eventDate >= rangeStart && eventDate <= rangeEnd;
      });
    }


    if (searchQuery) {
      tempEvents = tempEvents.filter(event =>
        Object.values(event).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    return tempEvents;
  }, [events, statusFilter, categoryFilter, duration, searchQuery, selectedCalendarStartDate, selectedCalendarEndDate]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEvents.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEvents.length / entriesPerPage);

  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleDurationSelect = (option) => {
    setDuration(option);
    setCurrentPage(1);
    if (option === 'Custom Range') {
      setShowCalendar(true);
      const todayForCalendar = new Date();
      const start = selectedCalendarStartDate || todayForCalendar;
      const end = selectedCalendarEndDate || todayForCalendar;
      setSelectedCalendarStartDate(start);
      setSelectedCalendarEndDate(end);
      setCalendarStartMonth(start.getMonth());
      setCalendarStartYear(start.getFullYear());
      setCalendarEndMonth(end.getMonth());
      setCalendarEndYear(end.getFullYear());
    } else {
      setDurationDropdownOpen(false);
      setShowCalendar(false);
      setSelectedCalendarStartDate(null);
      setSelectedCalendarEndDate(null);
    }
  };

  const formatDateForDisplay = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD for consistency
  };

  const handleApplyDateRange = () => {
    if (selectedCalendarStartDate && selectedCalendarEndDate) {
      setDuration(`${formatDateForDisplay(selectedCalendarStartDate)} To ${formatDateForDisplay(selectedCalendarEndDate)}`);
    } else if (selectedCalendarStartDate) {
      setDuration(formatDateForDisplay(selectedCalendarStartDate));
    }
    setShowCalendar(false);
    setDurationDropdownOpen(false);
    setCurrentPage(1);
  };

  const handleCancelDateRange = () => {
    setShowCalendar(false);
    setDurationDropdownOpen(false);
    if (!duration.includes('To') && duration !== 'Today' && !duration.startsWith('Last') && !duration.startsWith('Next') && duration !== 'All Time' && duration !== 'This Week' && duration !== 'This Month') {
      setDuration('All Time');
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => (new Date(year, month, 1).getDay() + 6) % 7; // Monday first

  const handleCalendarDateClick = (year, month, day) => {
    const newDate = new Date(year, month, day);
    if (!selectedCalendarStartDate || (selectedCalendarStartDate && selectedCalendarEndDate)) {
      setSelectedCalendarStartDate(newDate);
      setSelectedCalendarEndDate(null);
    } else {
      if (newDate < selectedCalendarStartDate) {
        setSelectedCalendarEndDate(selectedCalendarStartDate);
        setSelectedCalendarStartDate(newDate);
      } else {
        setSelectedCalendarEndDate(newDate);
      }
    }
  };

  const isCalendarDateSelected = (year, month, day) => {
    const date = new Date(year, month, day);
    if (selectedCalendarStartDate && selectedCalendarEndDate) {
      return date >= selectedCalendarStartDate && date <= selectedCalendarEndDate;
    }
    return selectedCalendarStartDate && date.getTime() === selectedCalendarStartDate.getTime();
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
      const isSelected = isCalendarDateSelected(year, month, i);
      const isCurrentDay = isTodayDate(year, month, i);
      days.push(
        <div
          key={i}
          className={`text-center py-1 text-sm cursor-pointer rounded
            ${isSelected ? 'bg-blue-600 text-white' : isCurrentDay ? 'text-green-600 font-semibold ring-1 ring-green-500' : 'text-gray-700 dark:text-gray-200'}
            ${!isSelected ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : ''}
          `}
          onClick={() => handleCalendarDateClick(year, month, i)}
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
        setCalendarStartMonth(newMonth);
        setCalendarStartYear(newYear);
      } else {
        setCalendarEndMonth(newMonth);
        setCalendarEndYear(newYear);
      }
    };

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2 px-1">
          <button onClick={() => handleMonthNav('prev')} className={darkClass("p-1 rounded hover:bg-gray-200", "dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300")}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-1">
            <select value={month} onChange={(e) => isStartCalendar ? setCalendarStartMonth(parseInt(e.target.value)) : setCalendarEndMonth(parseInt(e.target.value))}
                    className={darkClass("border rounded px-2 py-1 text-sm", "bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600")}>
              {monthNames.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => isStartCalendar ? setCalendarStartYear(parseInt(e.target.value)) : setCalendarEndYear(parseInt(e.target.value))}
                    className={darkClass("border rounded px-2 py-1 text-sm", "bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600")}>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={() => handleMonthNav('next')} className={darkClass("p-1 rounded hover:bg-gray-200", "dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300")}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {dayNames.map(day => <div key={day} className={darkClass("text-center font-medium text-gray-500", "dark:text-gray-400")}>{day}</div>)}
          {days}
        </div>
      </div>
    );
  };


  return (
    <div className={darkClass("px-4 sm:px-8 py-6 bg-gray-100 min-h-screen", "dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans")}>
      <div className={darkClass("flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm mb-6", "dark:bg-gray-800")}>
        {/* Date Range Filter */}
        <div className="flex items-center space-x-2 relative" ref={durationDropdownRef}>
          <span className={darkClass("text-sm font-medium text-gray-600", "dark:text-gray-300")}>Date Range</span>
          <button
            data-duration-button
            onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
            className={darkClass("border rounded-full px-3 py-1.5 text-sm w-56 text-left truncate flex items-center justify-between", "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600")}
          >
            <span>{duration}</span>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          {durationDropdownOpen && !showCalendar && (
            <div className={darkClass("absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10 border", "dark:bg-gray-700 dark:border-gray-600")}>
              {durationOptions.map((option) => (
                <div
                  key={option}
                  className={darkClass(`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${option === duration ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`,
                    `dark:hover:bg-gray-600 ${option === duration ? 'dark:text-white' : 'dark:text-gray-200'}`)}
                  onClick={() => handleDurationSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
          {showCalendar && (
            <div ref={calendarRef} className={darkClass("absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-20 p-4 border", "dark:bg-gray-800 dark:border-gray-700")} style={{ width: '640px' }}>
              <div className="grid grid-cols-2 gap-6">
                {renderCalendarMonth(calendarStartYear, calendarStartMonth, true)}
                {renderCalendarMonth(calendarEndYear, calendarEndMonth, false)}
              </div>
              <div className={darkClass("mt-4 pt-3 border-t flex justify-between items-center", "dark:border-gray-700")}>
                <div className={darkClass("text-xs text-gray-600", "dark:text-gray-300")}>
                  {selectedCalendarStartDate && selectedCalendarEndDate ? `${formatDateForDisplay(selectedCalendarStartDate)} To ${formatDateForDisplay(selectedCalendarEndDate)}`
                    : selectedCalendarStartDate ? `${formatDateForDisplay(selectedCalendarStartDate)} - Select end date`
                      : 'Select a date range'}
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCancelDateRange} className={darkClass("px-3 py-1 border rounded text-sm", "text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700")}>Cancel</button>
                  <button onClick={handleApplyDateRange} className={`px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 ${(!selectedCalendarStartDate || !selectedCalendarEndDate) ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!selectedCalendarStartDate || !selectedCalendarEndDate}>Apply</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 relative" ref={statusDropdownRef}>
          <span className={darkClass("text-sm font-medium text-gray-600", "dark:text-gray-300")}>Status</span>
          <button onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className={darkClass("border rounded-full px-3 py-1.5 text-sm min-w-[120px] text-left flex items-center justify-between", "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600")}>
            <span>{statusFilter}</span>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          {statusDropdownOpen && (
            <div className={darkClass("absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border", "dark:bg-gray-700 dark:border-gray-600")}>
              {['All', ...EVENT_STATUS_OPTIONS].map(option => (
                <div key={option} onClick={() => { setStatusFilter(option); setStatusDropdownOpen(false); setCurrentPage(1); }}
                     className={darkClass(`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${statusFilter === option ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`, `dark:hover:bg-gray-600 ${statusFilter === option ? 'dark:text-white' : 'dark:text-gray-200'}`)}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2 relative" ref={categoryDropdownRef}>
          <span className={darkClass("text-sm font-medium text-gray-600", "dark:text-gray-300")}>Category</span>
          <button onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className={darkClass("border rounded-full px-3 py-1.5 text-sm min-w-[150px] text-left flex items-center justify-between", "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600")}>
            <span>{categoryFilter}</span>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          {categoryDropdownOpen && (
            <div className={darkClass("absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10 border", "dark:bg-gray-700 dark:border-gray-600")}>
              {['All', ...EVENT_CATEGORY_OPTIONS].map(option => (
                <div key={option} onClick={() => { setCategoryFilter(option); setCategoryDropdownOpen(false); setCurrentPage(1);}}
                     className={darkClass(`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${categoryFilter === option ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'}`, `dark:hover:bg-gray-600 ${categoryFilter === option ? 'dark:text-white' : 'dark:text-gray-200'}`)}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className={darkClass("absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400", "dark:text-gray-500")} />
          <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                 className={darkClass("pl-10 pr-4 py-2 w-full rounded-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500", "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-blue-500")} />
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

        <button className={darkClass("flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm border hover:bg-gray-100", "text-gray-600 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700")}>
          <FilterIcon className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={openAddModal} className="flex items-center space-x-1 bg-blue-800 dark:bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
        <button onClick={handleExport} className="flex items-center space-x-1 bg-green-800 dark:bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 dark:hover:bg-green-700 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      <div className={darkClass("bg-white rounded-md shadow overflow-hidden", "dark:bg-gray-800")}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto">
            <thead className={darkClass("bg-gray-50", "dark:bg-gray-700")}>
            <tr className={darkClass("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", "dark:text-gray-300")}>
              <th className="py-3 px-4"><input type="checkbox" className={darkClass("rounded border-gray-300 text-blue-600 focus:ring-blue-500", "dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800")} /></th>
              <th className="py-3 px-4">Event Name</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Attendees</th>
              <th className="py-3 px-4">Action</th>
            </tr>
            </thead>
            <tbody className={darkClass("divide-y", "divide-gray-200 dark:divide-gray-700")}>
            {currentEntries.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-10 text-gray-500 dark:text-gray-400">No events found.</td></tr>
            ) : (
              currentEntries.map(event => (
                <tr key={event.id} className={darkClass("hover:bg-gray-50", "dark:hover:bg-gray-700/50")}>
                  <td className="py-3 px-4"><input type="checkbox" className={darkClass("rounded border-gray-300 text-blue-600 focus:ring-blue-500", "dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800")} /></td>
                  <td className={darkClass("py-3 px-4 whitespace-nowrap font-medium text-gray-900", "dark:text-gray-100")}>{event.eventName}</td>
                  <td className={darkClass("py-3 px-4 whitespace-nowrap text-gray-600", "dark:text-gray-300")}>{event.eventDate} at {event.eventTime}</td>
                  <td className={darkClass("py-3 px-4 whitespace-nowrap text-gray-600", "dark:text-gray-300")}>{event.location}</td>
                  <td className={darkClass("py-3 px-4 whitespace-nowrap text-gray-600", "dark:text-gray-300")}>{event.category}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${event.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                        event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100' :
                          event.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                            event.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'}`}>
                        {event.status}
                      </span>
                  </td>
                  <td className={darkClass("py-3 px-4 text-gray-600 max-w-xs truncate", "dark:text-gray-300")} title={event.attendees.join(', ')}>{event.attendees.join(', ')}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openEditModal(event)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Edit Event"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete Event"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
        {filteredEvents.length > 0 && (
          <div className={darkClass("flex flex-col sm:flex-row items-center justify-between p-4 text-sm border-t", "dark:border-gray-700")}>
            <div className={darkClass("flex items-center space-x-2 mb-2 sm:mb-0 text-gray-600", "dark:text-gray-400")}>
              <span>Show</span>
              <div className="relative inline-block">
                <select value={entriesPerPage} onChange={(e) => {setEntriesPerPage(Number(e.target.value)); setCurrentPage(1);}}
                        className={darkClass("appearance-none border rounded px-3 py-1.5 pr-8 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500", "dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600")}>
                  {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                <ChevronDown className={darkClass("pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700", "dark:text-gray-400")} />
              </div>
              <span>entries</span>
            </div>
            <div className={darkClass("flex items-center space-x-1 text-gray-600", "dark:text-gray-400")}>
              <span>Showing {Math.min(indexOfFirstEntry + 1, filteredEvents.length)} to {Math.min(indexOfLastEntry, filteredEvents.length)} of {filteredEvents.length} entries</span>
              <button onClick={handlePreviousPage} disabled={currentPage === 1} className={darkClass("px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50", "dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200")}>Previous</button>
              <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className={darkClass("px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50", "dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200")}>Next</button>
            </div>
          </div>
        )}
      </div>

      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
          <div className={darkClass("bg-white rounded-lg shadow-xl w-full max-w-lg p-6 transform transition-all", "dark:bg-gray-800")}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={darkClass("text-xl font-semibold text-gray-800", "dark:text-gray-100")}>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
              <button onClick={() => { setShowAddEventModal(false); setEditingEvent(null); resetFormFields();}} className={darkClass("text-gray-500 hover:text-gray-700", "dark:text-gray-400 dark:hover:text-gray-200")}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEvent}>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label htmlFor="eventName" className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Event Name</label>
                  <input type="text" id="eventName" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} required
                         className={darkClass("w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventDate" className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Date</label>
                    <input type="date" id="eventDate" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} required
                           className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")} />
                  </div>
                  <div>
                    <label htmlFor="eventTime" className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Time</label>
                    <input type="time" id="eventTime" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} required
                           className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")} />
                  </div>
                </div>
                <div>
                  <label htmlFor="eventLocation" className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Location</label>
                  <input type="text" id="eventLocation" value={newEventLocation} onChange={(e) => setNewEventLocation(e.target.value)} required
                         className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")} />
                </div>
                <div>
                  <label htmlFor="eventDescription" className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Description</label>
                  <textarea id="eventDescription" value={newEventDescription} onChange={(e) => setNewEventDescription(e.target.value)} rows="3"
                            className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")}></textarea>
                </div>
                <div>
                  <label htmlFor="eventAttendees" className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Attendees (comma-separated)</label>
                  <input type="text" id="eventAttendees" value={newEventAttendees} onChange={(e) => setNewEventAttendees(e.target.value)}
                         className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventStatus" className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Status</label>
                    <select id="eventStatus" value={newEventStatus} onChange={(e) => setNewEventStatus(e.target.value)} required
                            className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")}>
                      {EVENT_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="eventCategory" className={darkClass("block text-sm font-medium text-gray-700 mb-1", "dark:text-gray-300")}>Category</label>
                    <select id="eventCategory" value={newEventCategory} onChange={(e) => setNewEventCategory(e.target.value)} required
                            className={darkClass("w-full p-2 border rounded-md shadow-sm", "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100")}>
                      {EVENT_CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => { setShowAddEventModal(false); setEditingEvent(null); resetFormFields();}}
                        className={darkClass("px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50", "border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700")}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white">
                  {editingEvent ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

