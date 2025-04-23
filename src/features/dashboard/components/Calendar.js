import moment from 'moment';
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const events = [
    {
      id: 0,
      title: 'Task 1',
      start: new Date(2023, 9, 1), // October 1, 2023
      end: new Date(2023, 9, 1),
      type: 'task',
    },
    {
      id: 1,
      title: 'Holiday',
      start: new Date(2023, 9, 2), // October 2, 2023
      end: new Date(2023, 9, 2),
      type: 'holiday',
    },
    {
      id: 2,
      title: 'Event',
      start: new Date(2023, 9, 3), // October 3, 2023
      end: new Date(2023, 9, 3),
      type: 'event',
    },
    {
      id: 3,
      title: 'Ticket',
      start: new Date(2023, 9, 4), // October 4, 2023
      end: new Date(2023, 9, 4),
      type: 'ticket',
    },
    {
      id: 4,
      title: 'Leave',
      start: new Date(2023, 9, 5), // October 5, 2023
      end: new Date(2023, 9, 5),
      type: 'leave',
    },
  ];

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.type) {
      case 'task':
        backgroundColor = 'blue';
        break;
      case 'holiday':
        backgroundColor = 'red';
        break;
      case 'event':
        backgroundColor = 'green';
        break;
      case 'ticket':
        backgroundColor = 'orange';
        break;
      case 'leave':
        backgroundColor = 'purple';
        break;
      default:
        backgroundColor = 'gray';
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block',
      },
    };
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-700">My Calendar</h2>
      </div>
      <div className="text-sm text-gray-700">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, width: '100%' }} // Adjust height and width
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={(event) => `${event.title} - ${event.type}`}
          views={['month', 'week', 'day', 'agenda']} // Allow switching views
          defaultView="month" // Set default view
        />
      </div>
    </div>
  );
};

export default MyCalendar;