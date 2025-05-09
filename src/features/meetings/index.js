import { useState } from 'react';
import { MoreHorizontal, Plus, Calendar, Clock, ChevronDown, X, Search, Calendar as CalendarIcon } from 'lucide-react';

export default function Dashboard() {
  const [meetingName, setMeetingName] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showAddPeopleDropdown, setShowAddPeopleDropdown] = useState(false);
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  const [displayYear, setDisplayYear] = useState(currentYear);
  
  const people = [
    { id: 'SN', name: 'Sara Nadya', avatar: 'SN', selected: false },
    { id: 'JD', name: 'John Doe', avatar: 'JD', selected: true, isYou: true },
    { id: 'NA', name: 'Nadine Abigail', avatar: 'NA', selected: false },
    { id: 'EA', name: 'Eunike Alfrita', avatar: 'EA', selected: false },
  ];

  const meetings = [
    { 
      id: 1, 
      title: 'Weekly Office Group Meeting', 
      date: '16 May 2025', 
      time: '15:00-17:00 WIB',
      attendees: ['SN', 'NA', 'EA'] 
    },
    { 
      id: 2, 
      title: 'Monthly Office Group Meeting', 
      date: '25 May 2025', 
      time: '15:00-17:00 WIB',
      attendees: ['SN', 'NA', 'EA'] 
    }
  ];

  const handleAddPeopleClick = (meetingId) => {
    setActiveMeetingId(meetingId);
    setShowAddPeopleModal(true);
  };

  const getMonthDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
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
      const date = new Date(displayYear, displayMonth, day);
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
    // Automatically set end time to be 1 hour after start time
    const [hours, minutes] = time.split(':').map(Number);
    let endHour = hours + 1;
    if (endHour >= 24) endHour = 23;
    const endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setSelectedEndTime(endTime);
  };

  const handleSelectEndTime = (time) => {
    setSelectedEndTime(time);
  };

  const handleSubmit = () => {
    // Here you would typically submit the new meeting data to a backend
    console.log({
      meetingName,
      selectedDate,
      selectedStartTime,
      selectedEndTime,
      meetingLink
    });
    
    // Reset form
    setMeetingName('');
    setSelectedDate('');
    setSelectedStartTime('');
    setSelectedEndTime('');
    setMeetingLink('');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Add a new meeting schedule */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Add a new meeting schedule</h2>
          
          {/* Meeting Name Input - Updated with gray background */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name of the meeting"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 outline-none"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </div>
          
          {/* Date and Time Picker */}
          <div className="mb-4 relative">
            <div 
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setShowDateTimePicker(!showDateTimePicker)}
            >
              <span className={selectedDate && selectedStartTime ? "text-gray-900" : "text-gray-500"}>
                {selectedDate && selectedStartTime 
                  ? `${selectedDate}, ${selectedStartTime}-${selectedEndTime} WIB`
                  : "Select Date and Time"}
              </span>
              <ChevronDown className="w-5 h-5" />
            </div>
            
            {showDateTimePicker && (
              <div className="absolute z-20 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg">
                <div className="p-4">
                  {/* Calendar Header */}
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="text-gray-500 hover:text-gray-700">
                      &lt;
                    </button>
                    <h4 className="font-medium">{monthNames[displayMonth]} {displayYear}</h4>
                    <button onClick={nextMonth} className="text-gray-500 hover:text-gray-700">
                      &gt;
                    </button>
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <div key={day} className="text-center text-sm text-gray-500 font-medium">
                        {day}
                      </div>
                    ))}
                    {days.map((day, index) => (
                      <div 
                        key={index} 
                        className={`text-center py-1 ${day ? 'cursor-pointer hover:bg-gray-100 rounded-full' : ''} ${
                          selectedDate === `${day} ${monthNames[displayMonth]} ${displayYear}` 
                            ? 'bg-blue-100 text-blue-700 rounded-full' 
                            : ''
                        }`}
                        onClick={() => handleSelectDate(day)}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Time Picker */}
                  <div className="flex space-x-4 mb-4">
                    <div className="w-1/2">
                      <p className="text-sm text-gray-500 mb-2">Start Time</p>
                      <select 
                        className="w-full border border-gray-300 rounded-md p-2"
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
                      <p className="text-sm text-gray-500 mb-2">End Time</p>
                      <select 
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={selectedEndTime}
                        onChange={(e) => handleSelectEndTime(e.target.value)}
                      >
                        <option value="">Select</option>
                        {timeOptions.map((time) => (
                          <option key={`end-${time}`} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      onClick={() => setShowDateTimePicker(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Meeting Link Input - Updated with gray background */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Meeting Link"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 outline-none"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
          
          {/* Add People Dropdown */}
          <div className="mb-4 relative">
            <div 
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setShowAddPeopleDropdown(!showAddPeopleDropdown)}
            >
              <span className="text-gray-500">Add People</span>
              <ChevronDown className="w-5 h-5" />
            </div>
            
            {showAddPeopleDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg">
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-9"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {people.map((person) => (
                    <div 
                      key={person.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm mr-3">
                          {person.avatar}
                        </div>
                        <span>{person.name}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-blue-600" 
                        checked={person.selected || person.isYou}
                        readOnly={person.isYou}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Add Button */}
          <button 
            className="bg-gray-900 text-white py-3 px-8 rounded-lg font-medium"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
        
        {/* Today's Meetings */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-1">You have 1 meetings today!</h2>
          <p className="text-gray-500 mb-6">2 hours left for the next meeting</p>
          
          {/* Meeting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-lg">{meeting.title}</h3>
                  <button className="text-gray-500">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-red-500 mr-2">
                      <CalendarIcon className="w-5 h-5" />
                    </span>
                    <span className="text-sm">{meeting.date}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">
                      <Clock className="w-5 h-5" />
                    </span>
                    <span className="text-sm">{meeting.time}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {meeting.attendees.map((attendee, index) => (
                      <div key={index} className="bg-gray-200 text-xs font-medium py-1 px-3 rounded-full">
                        {attendee}
                      </div>
                    ))}
                    <div 
                      className="bg-gray-200 text-xs py-1 px-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
                      onClick={() => handleAddPeopleClick(meeting.id)}
                    >
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>
                  <button className="bg-gray-900 text-white text-sm py-2 px-5 rounded-lg">
                    Join Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add People Modal */}
      {showAddPeopleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add People to Meeting</h3>
              <button 
                onClick={() => setShowAddPeopleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-9"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            <div className="max-h-64 overflow-y-auto mb-6">
              {people.map((person) => (
                <div 
                  key={person.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm mr-3">
                      {person.avatar}
                    </div>
                    <span>{person.name}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600" 
                    checked={person.selected || person.isYou}
                    readOnly={person.isYou}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddPeopleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-gray-900 text-white rounded-lg"
                onClick={() => setShowAddPeopleModal(false)}
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