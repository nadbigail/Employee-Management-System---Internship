import { useState } from 'react';
import { Phone, Calendar, Plus, MoreHorizontal, User, Search, ChevronDown, X } from 'lucide-react';

export default function Dashboard() {
  const [meetingName, setMeetingName] = useState('');
  const [showPeopleDropdown, setShowPeopleDropdown] = useState(false);
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState(null);
  
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
      attendees: ['SN', 'NA', 'EW'] 
    },
    { 
      id: 2, 
      title: 'Monthly Office Group Meeting', 
      date: '25 May 2025', 
      time: '15:00-17:00 WIB',
      attendees: ['SN', 'NA', 'EW'] 
    }
  ];

  const handleAddPeopleClick = (meetingId) => {
    setActiveMeetingId(meetingId);
    setShowAddPeopleModal(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* New Meeting Card */}
          <div className="bg-gray-900 text-white rounded-lg p-6 flex flex-col items-center justify-center h-40">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
              <Phone className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg mb-1">New Meeting</p>
              <p className="text-sm text-gray-400">Start New Meeting</p>
            </div>
          </div>
          
          {/* Join Meeting Card */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow-sm h-40">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg mb-1">Join Meeting</p>
              <p className="text-sm text-gray-500">Via Invitation Link</p>
            </div>
          </div>
          
          {/* Schedule Meeting Card */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow-sm h-40">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg mb-1">Schedule Meeting</p>
              <p className="text-sm text-gray-500">Plan Your Meeting</p>
            </div>
          </div>
        </div>
        
        {/* Start New Meeting Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Start a new meeting now</h2>
          
          {/* Meeting Name Input */}
          <div className="mb-5">
            <div className="w-full border border-gray-300 rounded-lg p-4 flex justify-between items-center">
              <input
                type="text"
                placeholder="Name of the meeting"
                className="w-full text-gray-700 outline-none border-none bg-transparent"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
              />
            </div>
          </div>
          
          {/* Add People Dropdown */}
          <div className="mb-5 relative">
            <div 
              className="w-full border border-gray-300 rounded-lg p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setShowPeopleDropdown(!showPeopleDropdown)}
            >
              <span className="text-gray-600">Add People</span>
              <ChevronDown className="w-5 h-5" />
            </div>
            
            {showPeopleDropdown && (
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
                      className={`flex items-center justify-between p-3 hover:bg-gray-50 ${person.selected && person.isYou ? 'bg-blue-900 text-white' : ''}`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 ${person.selected && person.isYou ? 'bg-blue-500' : 'bg-gray-200'}`}>
                          {person.avatar}
                        </div>
                        <span>{person.name}</span>
                      </div>
                      {person.isYou && (
                        <span className={`text-xs px-2 py-1 rounded ${person.selected ? 'bg-blue-500' : 'bg-blue-500'} text-white`}>
                          it's you
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Start Now Button */}
          <button className="bg-gray-900 text-white py-3 px-8 rounded-lg font-medium">
            Start Now
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
                      <Calendar className="w-5 h-5" />
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
                      <div key={index} className="bg-gray-200 text-xs font-medium py-1 px-3 rounded">
                        {attendee}
                      </div>
                    ))}
                    <div 
                      className="bg-gray-200 text-xs py-1 px-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300"
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

function Clock({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}