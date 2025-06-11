import React, { useState } from 'react';

function AddAttendanceModal({ extraObject, closeModal }) {
  const { employees, attendanceTypes, setAttendanceData, selectedEmployeeId } = extraObject;

  const [employeeId, setEmployeeId] = useState(selectedEmployeeId || employees[0]?.id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState(attendanceTypes[2]?.name || 'Present'); // Default to 'Present'

  const handleSave = () => {
    if (!employeeId || !date || !status) {
      alert("Please fill all fields.");
      return;
    }

    setAttendanceData(currentData => {
      const employeeRecords = currentData[employeeId] || {};
      const updatedRecords = { ...employeeRecords, [date]: status };
      return {
        ...currentData,
        [employeeId]: updatedRecords
      };
    });

    closeModal();
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="employee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
        <select
          id="employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(Number(e.target.value))}
          className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          {attendanceTypes.map(type => (
            <option key={type.name} value={type.name}>{type.name}</option>
          ))}
        </select>
      </div>

      <div className="modal-action mt-6">
        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default AddAttendanceModal;