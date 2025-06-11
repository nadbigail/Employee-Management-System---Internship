import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { RRule } from 'rrule';
import { openModal } from '../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../utils/globalConstantUtil';
import TitleCard from '../../components/Cards/TitleCard';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const initialEvents = [
    {
        id: 1,
        title: 'Company Wide Gathering',
        start: new Date(2025, 5, 15, 10, 0),
        end: new Date(2025, 5, 17, 12, 0),
        type: 'event',
    },
    {
        id: 2,
        title: 'John Doe\'s Birthday',
        start: new Date(2025, 5, 23),
        end: new Date(2025, 5, 23),
        allDay: true,
        type: 'birthday',
    },
    {
        id: 3,
        title: 'Weekly Stand-up',
        start: new Date(2025, 5, 2, 9, 0),
        end: new Date(2025, 5, 2, 9, 30),
        rrule: 'FREQ=MONTHLY;COUNT=3',
        type: 'task',
    },
    {
        id: 4,
        title: 'Monthly Report Due',
        start: new Date(2025, 4, 28, 17, 0),
        end: new Date(2025, 4, 28, 17, 30),
        rrule: 'FREQ=MONTHLY;COUNT=3',
        type: 'task',
    }
];

const eventStyleGetter = (event) => {
    const styleMap = {
        task: 'bg-blue-500',
        holiday: 'bg-red-500',
        event: 'bg-green-500',
        birthday: 'bg-teal-500',
    };
    const backgroundColor = styleMap[event.type] || 'bg-gray-500';
    return {
        className: `${backgroundColor} text-white border-0 p-1 rounded`,
        style: {
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0',
            display: 'block',
        },
    };
};

function CalendarPage() {
    const dispatch = useDispatch();
    const [events, setEvents] = useState(initialEvents);
    const [dateRange, setDateRange] = useState({
        start: moment().startOf('month').toDate(),
        end: moment().endOf('month').toDate()
    });

    const expandedEvents = useMemo(() => {
        return events.flatMap(event => {
            if (event.rrule) {
                const ruleOptions = RRule.parseString(event.rrule);
                ruleOptions.dtstart = moment(event.start).toDate();
                const rule = new RRule(ruleOptions);
                const dates = rule.between(dateRange.start, dateRange.end);

                return dates.map(date => {
                    const eventDuration = moment(event.end).diff(moment(event.start));
                    return {
                        ...event,
                        start: moment(date).toDate(),
                        end: moment(date).add(eventDuration).toDate(),
                    };
                });
            }
            return event;
        });
    }, [events, dateRange]);

    const handleSelectSlot = useCallback(({ start, end }) => {
        dispatch(openModal({
            title: 'Add New Event',
            bodyType: MODAL_BODY_TYPES.EVENT_ADD_NEW,
            extraObject: {
                start: start.toISOString(),
                end: end.toISOString(),
                setEvents
            }
        }));
    }, [dispatch]);

    const handleSelectEvent = useCallback((event) => {
        const originalEvent = events.find(e => e.id === event.id) || event;
        dispatch(openModal({
            title: 'Edit Event',
            bodyType: MODAL_BODY_TYPES.EVENT_ADD_NEW,
            extraObject: {
                event: { ...originalEvent, start: new Date(originalEvent.start), end: new Date(originalEvent.end) },
                setEvents,
                events
            }
        }));
    }, [dispatch, events]);

    const handleRangeChange = useCallback((range) => {
        let start, end;
        if (Array.isArray(range)) {
            start = range[0];
            end = range[range.length - 1];
        } else {
            start = range.start;
            end = range.end;
        }
        setDateRange({ start, end });
    }, []);

    return (
      <TitleCard title="Calendar" topMargin="mt-2">
          <Calendar
            localizer={localizer}
            events={expandedEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '75vh' }}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day', 'agenda']}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onRangeChange={handleRangeChange}
          />
      </TitleCard>
    );
}

export default CalendarPage;