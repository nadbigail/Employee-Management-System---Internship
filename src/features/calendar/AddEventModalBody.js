import React, { useState, useEffect } from 'react';
import { RRule } from 'rrule';
import moment from 'moment';

const Input = ({ label, name, type, value, onChange, required, className }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full p-2 border rounded-md shadow-sm ${className || ''} border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100`}
    />
  </div>
);

function AddEventModalBody({ closeModal, extraObject }) {
  const { event, setEvents, start, end } = extraObject;
  const isNewEvent = !event;

  const [title, setTitle] = useState(event?.title || '');
  const [type, setType] = useState(event?.type || 'event');
  const [allDay, setAllDay] = useState(event?.allDay || false);
  const [startDate, setStartDate] = useState(moment(event?.start || start).format('YYYY-MM-DD'));
  const [startTime, setStartTime] = useState(moment(event?.start || start).format('HH:mm'));
  const [endDate, setEndDate] = useState(moment(event?.end || end).format('YYYY-MM-DD'));
  const [endTime, setEndTime] = useState(moment(event?.end || end).format('HH:mm'));

  const [isRecurring, setIsRecurring] = useState(!!event?.rrule);
  const [recurrenceRule, setRecurrenceRule] = useState({
    freq: RRule.WEEKLY,
    interval: 1,
    byday: null,
    until: '',
  });

  useEffect(() => {
    if (event?.rrule) {
      const ruleStringForParsing = event.rrule.startsWith('RRULE:') ? event.rrule.substring(6) : event.rrule;
      const rule = RRule.parseString(ruleStringForParsing);
      setRecurrenceRule({
        freq: rule.freq,
        interval: rule.interval || 1,
        byday: rule.byweekday?.map(d => d.weekday),
        until: rule.until ? moment(rule.until).format('YYYY-MM-DD') : ''
      });
    }
  }, [event]);

  const handleSave = () => {
    const combinedStart = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm').toDate();
    const combinedEnd = moment(`${endDate} ${endTime}`, 'YYYY-MM-DD HH:mm').toDate();

    let rruleString = null;
    if (isRecurring) {
      const options = {
        freq: recurrenceRule.freq,
        interval: recurrenceRule.interval,
        dtstart: combinedStart,
        until: recurrenceRule.until ? moment(recurrenceRule.until).endOf('day').toDate() : null,
        byweekday: recurrenceRule.byday,
      };
      rruleString = new RRule(options).toString();
    }

    const newEventData = {
      id: event?.id || Date.now(),
      title,
      type,
      allDay,
      start: combinedStart,
      end: combinedEnd,
      rrule: rruleString
    };

    if (isNewEvent) {
      setEvents(currentEvents => [...currentEvents, newEventData]);
    } else {
      setEvents(currentEvents => currentEvents.map(e => (e.id === event.id ? newEventData : e)));
    }
    closeModal();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(currentEvents => currentEvents.filter(e => e.id !== event.id));
      closeModal();
    }
  };

  return (
    <div className="space-y-4">
      <Input label="Event Title" name="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Start Date" name="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        {!allDay && <Input label="Start Time" name="startTime" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="End Date" name="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        {!allDay && <Input label="End Time" name="endTime" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />}
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="isRecurring" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="h-4 w-4 rounded text-blue-600" />
        <label htmlFor="isRecurring" className="ml-2 block text-sm">Repeat this event</label>
      </div>

      {isRecurring && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
          <select value={recurrenceRule.freq} onChange={e => setRecurrenceRule(p => ({...p, freq: Number(e.target.value)}))} className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500">
            <option value={RRule.DAILY}>Daily</option>
            <option value={RRule.WEEKLY}>Weekly</option>
            <option value={RRule.MONTHLY}>Monthly</option>
            <option value={RRule.YEARLY}>Yearly</option>
          </select>
          <Input label="Repeat until" name="until" type="date" value={recurrenceRule.until} onChange={e => setRecurrenceRule(p => ({...p, until: e.target.value}))} />
        </div>
      )}

      <div className="modal-action mt-6">
        {!isNewEvent && (
          <button className="btn btn-error" onClick={handleDelete}>Delete</button>
        )}
        <div className="flex-grow"></div>
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default AddEventModalBody;