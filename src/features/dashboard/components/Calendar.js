import React, {useState, useCallback} from 'react';
import moment from 'moment';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const initialEvents = [
  {
    id: 0,
    title: 'Submit monthly report',
    start: new Date(2025, 5, 10),
    end: new Date(2025, 5, 10),
    type: 'task',
  },
  {
    id: 1,
    title: 'National Holiday',
    start: new Date(2025, 5, 12),
    end: new Date(2025, 5, 12),
    type: 'holiday',
  },
  {
    id: 2,
    title: 'Company wide gathering',
    start: new Date(2025, 5, 15),
    end: new Date(2025, 5, 17),
    type: 'event',
  },
  {
    id: 3,
    title: "John Doe's Birthday",
    start: new Date(2025, 5, 23),
    end: new Date(2025, 5, 23),
    type: 'birthday',
  },
  {
    id: 4,
    title: 'Review project proposal',
    start: new Date(2025, 5, 5),
    end: new Date(2025, 5, 5),
    type: 'task',
  },
  {
    id: 5,
    title: "Jane Smith's Birthday",
    start: new Date(2025, 6, 1),
    end: new Date(2025, 6, 1),
    type: 'birthday',
  },
  {
    id: 6,
    title: 'Rafi Dirgantara – Organized a successful internal workshop on AI tools',
    start: new Date(2025, 4, 8),
    end: new Date(2025, 4, 8),
    type: 'appreciation',
  },
  {
    id: 7,
    title: 'Felicia Anggraini – Completed system migration 3 days ahead of schedule',
    start: new Date(2025, 4, 10),
    end: new Date(2025, 4, 10),
    type: 'appreciation',
  },
  {
    id: 8,
    title: 'Kevin Hartanto – Praised by client for fast response on the ABC project',
    start: new Date(2025, 4, 12),
    end: new Date(2025, 4, 12),
    type: 'appreciation',
  },
];



const MyCalendar = () => {
  const [myEvents, setMyEvents] = useState(initialEvents);

  const handleSelectSlot = useCallback(
    ({start, end}) => {
      const title = window.prompt('New Event name');
      if (title) {
        const typeOptions = ['task', 'holiday', 'event', 'ticket', 'leave', 'birthday'];
        let type = window.prompt(`Event type (${typeOptions.join('/')}):`);
        if (!typeOptions.includes(type)) {
          type = 'task';
        }

        setMyEvents((prev) => [
          ...prev,
          {
            id: prev.length > 0 ? Math.max(...prev.map(e => e.id)) + 1 : 0,
            start,
            end,
            title,
            type,
          },
        ]);
      }
    },
    [setMyEvents]
  );

  const handleSelectEvent = useCallback(
    (event) => {
      if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
        setMyEvents((prev) => prev.filter((ev) => ev.id !== event.id));
      }
    },
    [setMyEvents]
  );

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
      case 'birthday':
        backgroundColor = 'teal';
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

  const defaultDate = Date.now()

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-700">My Calendar</h2>
      </div>
      <div className="text-sm text-gray-700">
        <Calendar
          localizer={localizer}
          events={myEvents}
          startAccessor="start"
          endAccessor="end"
          style={{height: 500, width: '100%'}}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={(event) => `${event.title} - ${event.type}`}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          defaultDate={defaultDate}
          className="rbc-calendar"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </div>
  );
};

export default MyCalendar;