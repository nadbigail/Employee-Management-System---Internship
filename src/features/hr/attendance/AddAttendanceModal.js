import React, { useState } from 'react';
import moment from 'moment';

function AddAttendanceModal({ extraObject, closeModal }) {
  const { employees, setAttendanceData, editingLog, role, name: loggedInUserName } = extraObject;

  const getInitialState = () => {
    if (editingLog) {
      return { ...editingLog };
    }
    return {
      employeeId: role === 'admin' ? (employees[0]?.id || '') : (employees.find(e => e.name === loggedInUserName)?.id || ''),
      name: role === 'admin' ? (employees[0]?.name || '') : loggedInUserName,
      date: moment().format("YYYY-MM-DD"),
      clockIn: moment().format("HH:mm"),
      clockOut: '',
      location: 'Jakarta Office',
      status: 'Present',
    };
  };

  const [formState, setFormState] = useState(getInitialState());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({...prev, [name]: value}));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formState.employeeId || !formState.date || !formState.status) {
      alert("Employee, Date, and Status are required.");
      return;
    }

    const selectedEmployee = employees.find(e => e.id === Number(formState.employeeId));

    const newLogData = {
      ...formState,
      id: editingLog?.id || crypto.randomUUID(),
      name: selectedEmployee.name,
      employeeId: Number(formState.employeeId),
    };

    setAttendanceData(currentData => {
      if (editingLog) {
        return currentData.map(log => log.id === editingLog.id ? newLogData : log);
      } else {
        return [newLogData, ...currentData];
      }
    });

    closeModal();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
        <select
          name="employeeId"
          value={formState.employeeId}
          onChange={handleInputChange}
          disabled={role !== 'admin'}
          required
          className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-200 disabled:dark:bg-gray-800"
        >
          {role === 'admin' ? (
            employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)
          ) : (
            <option value={formState.employeeId}>{formState.name}</option>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
        <input type="date" name="date" value={formState.date} onChange={handleInputChange} required className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"/>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="clockIn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clock In</label>
          <input type="time" name="clockIn" value={formState.clockIn} onChange={handleInputChange} className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"/>
        </div>
        <div>
          <label htmlFor="clockOut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clock Out</label>
          <input type="time" name="clockOut" value={formState.clockOut} onChange={handleInputChange} className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"/>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
        <input type="text" name="location" value={formState.location} onChange={handleInputChange} required className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"/>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
        <select name="status" value={formState.status} onChange={handleInputChange} className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
          {['Present', 'Late', 'Half Day', 'Absent', 'On Leave', 'Holiday', 'Day Off'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="modal-action mt-6">
        <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button type="submit" className="btn btn-primary">
          {editingLog ? 'Save Changes' : 'Add Log'}
        </button>
      </div>
    </form>
  );
}

export default AddAttendanceModal;