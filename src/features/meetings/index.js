import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MoreHorizontal, Plus, Clock, ChevronDown, X, Search, Calendar as CalendarIcon, Trash2, ChevronLeft, ChevronRight, Edit2 as EditIcon } from 'lucide-react';

export default function Dashboard() {
  const [meetingName, setMeetingName] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showAddPeopleDropdown, setShowAddPeopleDropdown] = useState(false);
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState(null); // For 'Add People' to existing meeting card
  const [editingMeetingId, setEditingMeetingId] = useState(null); // For editing a meeting via the main form
  const [searchTerm, setSearchTerm] = useState('');

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  const [displayYear, setDisplayYear] = useState(currentYear);

  const [people, setPeople] = useState([
    { id: 'SN', name: 'Sara Nadya', avatar: 'SN', selected: false },
    { id: 'JD', name: 'John Doe', avatar: 'JD', selected: true, isYou: true },
    { id: 'NA', name: 'Nadine Abigail', avatar: 'NA', selected: false },
    { id: 'EA', name: 'Eunike Alfrita', avatar: 'EA', selected: false },
  ]);

  const initialMeetingsData = [
    {
      id: '1',
      title: 'Weekly Office Group Meeting',
      date: '16 May 2025',
      time: '15:00-17:00 WIB',
      attendees: ['SN', 'NA', 'EA', 'JD'],
      link: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      title: 'Monthly Office Group Meeting',
      date: '25 May 2025',
      time: '15:00-17:00 WIB',
      attendees: ['SN', 'NA', 'JD'],
      link: 'https://meet.google.com/xyz-uvwx-rst'
    }
  ];

  const [meetings, setMeetings] = useState(initialMeetingsData.map(m => ({...m, id: m.id || crypto.randomUUID()})));

  const resetFormFields = () => {
    setMeetingName('');
    setMeetingLink('');
    setSelectedDate('');
    setSelectedStartTime('');
    setSelectedEndTime('');
    setShowDateTimePicker(false);
    setShowAddPeopleDropdown(false);
    setPeople(prev => prev.map(person =>
      person.isYou ? { ...person, selected: true } : { ...person, selected: false }
    ));
  };

  const handleOpenEditMeetingForm = (meetingId) => {
    const meetingToEdit = meetings.find(m => m.id === meetingId);
    if (meetingToEdit) {
      setEditingMeetingId(meetingId);
      setMeetingName(meetingToEdit.title);
      setMeetingLink(meetingToEdit.link || '');
      setSelectedDate(meetingToEdit.date);

      const [startTime, endTime] = meetingToEdit.time.replace(' WIB', '').split('-');
      setSelectedStartTime(startTime);
      setSelectedEndTime(endTime);

      setPeople(prevPeople => prevPeople.map(person => ({
        ...person,
        selected: meetingToEdit.attendees.includes(person.id)
      })));

      setShowDateTimePicker(false);
      setShowAddPeopleDropdown(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingMeetingId(null);
    resetFormFields();
  };

  const handleAddPeopleClickOnCard = (meetingId) => {
    setActiveMeetingId(meetingId);
    const currentMeeting = meetings.find(m => m.id === meetingId);
    if (currentMeeting) {
      setPeople(prevPeople => prevPeople.map(person => ({
        ...person,
        selected: currentMeeting.attendees.includes(person.id)
      })));
    }
    setSearchTerm('');
    setShowAddPeopleModal(true);
  };

  const handlePersonSelect = (personId) => {
    setPeople(prev => prev.map(person =>
      person.id === personId && !person.isYou
        ? { ...person, selected: !person.selected }
        : person
    ));
  };

  const getMonthDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = getMonthDays(displayYear, displayMonth);

  const nextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const prevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleSelectDate = (day) => {
    if (day) {
      const formattedDate = `${day} ${monthNames[displayMonth]} ${displayYear}`;
      setSelectedDate(formattedDate);
    }
  };

  const timeOptions = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour = i.toString().padStart(2, '0');
      const minute = j.toString().padStart(2, '0');
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  const handleSelectStartTime = (time) => {
    setSelectedStartTime(time);
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      let endHour = hours + 1;
      if (endHour >= 24) endHour = 23;
      const endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      if (!selectedEndTime || selectedEndTime <= time) { // Auto-set end time only if not set or invalid
        setSelectedEndTime(endTime);
      }
    } else {
      setSelectedEndTime('');
    }
  };

  const handleSelectEndTime = (time) => {
    setSelectedEndTime(time);
  };

  const handleMeetingFormSubmit = () => {
    if (!meetingName || !selectedDate || !selectedStartTime || !selectedEndTime) {
      alert('Please fill in meeting name, date, start time, and end time.');
      return;
    }

    const currentSelectedPeople = people
      .filter(person => person.selected)
      .map(person => person.id);

    const meetingData = {
      title: meetingName,
      date: selectedDate,
      time: `${selectedStartTime}-${selectedEndTime} WIB`,
      attendees: currentSelectedPeople,
      link: meetingLink
    };

    if (editingMeetingId) {
      setMeetings(prevMeetings => prevMeetings.map(m =>
        m.id === editingMeetingId ? { ...m, ...meetingData } : m
      ));
      alert('Meeting updated successfully!');
      setEditingMeetingId(null);
    } else {
      setMeetings(prev => [{ ...meetingData, id: crypto.randomUUID() }, ...prev]);
      alert('Meeting added successfully!');
    }
    resetFormFields();
  };

  const addPeopleToExistingMeeting = () => {
    if (activeMeetingId) {
      const updatedAttendees = people
        .filter(person => person.selected)
        .map(person => person.id);

      setMeetings(prevMeetings => prevMeetings.map(meeting =>
        meeting.id === activeMeetingId
          ? { ...meeting, attendees: updatedAttendees }
          : meeting
      ));
    }
    setShowAddPeopleModal(false);
    setActiveMeetingId(null);
    setPeople(prev => prev.map(person =>
      person.isYou ? { ...person, selected: true } : { ...person, selected: false }
    ));
  };

  const handleDeleteMeeting = (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(prevMeetings => prevMeetings.filter(m => m.id !== meetingId));
    }
  };

  const filteredPeopleForDropdown = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTodaysMeetings = () => {
    const todayDate = new Date();
    const todayString = `${todayDate.getDate()} ${monthNames[todayDate.getMonth()]} ${todayDate.getFullYear()}`;
    return meetings.filter(meeting => meeting.date === todayString);
  };

  const todaysMeetings = getTodaysMeetings();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6 text-gray-900 dark:text-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            {editingMeetingId ? 'Edit Meeting Schedule' : 'Add a new meeting schedule'}
          </h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name of the meeting"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </div>
          <div className="mb-4 relative">
            <div
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setShowDateTimePicker(!showDateTimePicker)}
            >
            <span className={selectedDate && selectedStartTime ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}>
              {selectedDate && selectedStartTime && selectedEndTime
                ? `${selectedDate}, ${selectedStartTime}-${selectedEndTime} WIB`
                : "Select Date and Time"}
            </span>
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>

            {showDateTimePicker && (
              <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full disabled:opacity-50" type="button">
                      <ChevronLeft size={20}/>
                    </button>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">{monthNames[displayMonth]} {displayYear}</h4>
                    <button onClick={nextMonth} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full" type="button">
                      <ChevronRight size={20}/>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {day}
                      </div>
                    ))}
                    {days.map((day, index) => (
                      <div
                        key={index}
                        className={`text-center py-1 text-sm ${day ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full' : ''} ${
                          selectedDate === `${day} ${monthNames[displayMonth]} ${displayYear}`
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-white rounded-full'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => handleSelectDate(day)}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-4 mb-4">
                    <div className="w-1/2">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Start Time</p>
                      <select
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 outline-none"
                        value={selectedStartTime}
                        onChange={(e) => handleSelectStartTime(e.target.value)}
                      >
                        <option value="">Select</option>
                        {timeOptions.map((time) => (
                          <option key={`start-${time}`} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/2">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">End Time</p>
                      <select
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 outline-none"
                        value={selectedEndTime}
                        onChange={(e) => handleSelectEndTime(e.target.value)}
                      >
                        <option value="">Select</option>
                        {timeOptions.filter(time => !selectedStartTime || time > selectedStartTime).map((time) => (
                          <option key={`end-${time}`} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm"
                      onClick={() => setShowDateTimePicker(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Meeting Link (Optional)"
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
          <div className="mb-6 relative">
            <div
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setShowAddPeopleDropdown(!showAddPeopleDropdown)}
            >
            <span className="text-gray-500 dark:text-gray-400">
              {people.filter(p => p.selected && !p.isYou).length > 0
                ? `${people.filter(p => p.selected && !p.isYou).length} people selected (+ You)`
                : "Add People"
              }
            </span>
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>

            {showAddPeopleDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg">
                <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 pl-9 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredPeopleForDropdown.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => handlePersonSelect(person.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-500 flex items-center justify-center text-sm mr-3 text-gray-700 dark:text-gray-300">
                          {person.avatar}
                        </div>
                        <span className="text-gray-800 dark:text-gray-200 text-sm">{person.name}</span>
                        {person.isYou && <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">(You)</span>}
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70"
                        checked={person.selected}
                        readOnly={person.isYou}
                        disabled={person.isYou}
                      />
                    </div>
                  ))}
                </div>
                <div className="p-2 flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setShowAddPeopleDropdown(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              className="bg-gray-900 dark:bg-blue-600 text-white dark:text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-blue-700 w-full sm:w-auto"
              onClick={handleMeetingFormSubmit}
            >
              {editingMeetingId ? 'Save Changes' : 'Add Meeting'}
            </button>
            {editingMeetingId && (
              <button
                type="button"
                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-8 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 w-full sm:w-auto"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-1 dark:text-white">
            You have {meetings.length} meeting{meetings.length === 1 ? '' : 's'} total!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {todaysMeetings.length > 0
              ? `${todaysMeetings.length} meeting${todaysMeetings.length === 1 ? '' : 's'} today`
              : "No meetings scheduled for today."
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 break-all">{meeting.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenEditMeetingForm(meeting.id)}
                        className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1"
                        title="Edit Meeting"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMeeting(meeting.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
                        title="Delete Meeting"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                    <span className="text-red-500 dark:text-red-400 mr-2">
                      <CalendarIcon className="w-5 h-5" />
                    </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{meeting.date}</span>
                    </div>
                    <div className="flex items-center">
                    <span className="text-red-500 dark:text-red-400 mr-2">
                      <Clock className="w-5 h-5" />
                    </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{meeting.time}</span>
                    </div>
                    {meeting.link && (
                      <div className="mt-2 text-sm text-blue-600 dark:text-blue-400 break-all">
                        <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{meeting.link}</a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {meeting.attendees.map((attendeeId, index) => {
                      const person = people.find(p => p.id === attendeeId);
                      return (
                        <div key={index} className="bg-gray-200 dark:bg-gray-700 text-xs font-medium py-1 px-3 rounded-full text-gray-800 dark:text-gray-200">
                          {person ? person.avatar : attendeeId}
                        </div>
                      );
                    })}
                    <div
                      className="bg-gray-200 dark:bg-gray-700 text-xs py-1 px-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                      onClick={() => handleAddPeopleClickOnCard(meeting.id)}
                      title="Add people"
                    >
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>
                  <a
                    href={meeting.link || '#'}
                    target={meeting.link ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`bg-gray-900 dark:bg-blue-600 text-white dark:text-white text-sm py-2 px-5 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 ${!meeting.link ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => !meeting.link && e.preventDefault()}
                  >
                    Join Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddPeopleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Add People to Meeting</h3>
              <button
                onClick={() => {
                  setShowAddPeopleModal(false);
                  setActiveMeetingId(null);
                  setPeople(prev => prev.map(person =>
                    person.isYou ? { ...person, selected: true } : { ...person, selected: false }
                  ));
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 pl-9 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            </div>
            <div className="max-h-64 overflow-y-auto mb-6">
              {filteredPeopleForDropdown.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handlePersonSelect(person.id)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm mr-3 text-gray-700 dark:text-gray-300">
                      {person.avatar}
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{person.name}</span>
                    {person.isYou && <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">(You)</span>}
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70"
                    checked={person.selected}
                    readOnly={person.isYou}
                    disabled={person.isYou}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddPeopleModal(false);
                  setActiveMeetingId(null);
                  setPeople(prev => prev.map(person =>
                    person.isYou ? { ...person, selected: true } : { ...person, selected: false }
                  ));
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-900 dark:bg-blue-600 text-white dark:text-white rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 text-sm"
                onClick={addPeopleToExistingMeeting}
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
