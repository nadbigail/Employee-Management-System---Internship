import React, { useState } from 'react';

const LEAVE_TYPE_OPTIONS = ['Vacation', 'Sick Leave', 'Personal', 'Maternity/Paternity', 'Unpaid', 'Other'];

function AddLeaveModalBody({ closeModal, extraObject }) {
  const { setLeaves, editingLeave } = extraObject;

  const [formState, setFormState] = useState(editingLeave || {
    employeeName: '',
    leaveType: LEAVE_TYPE_OPTIONS[0],
    leaveStartDate: '',
    leaveEndDate: '',
    isPaid: true,
    reason: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newLeaveData = {
      ...formState,
      employeeAvatar: formState.employeeName.split(' ').map(n => n[0]).join(''),
      employeeDept: 'Unassigned',
      status: editingLeave ? editingLeave.status : 'Pending'
    };

    if (editingLeave) {
      setLeaves(currentLeaves => currentLeaves.map(l => l.id === editingLeave.id ? { ...l, ...newLeaveData } : l));
    } else {
      setLeaves(currentLeaves => [{ id: crypto.randomUUID(), ...newLeaveData }, ...currentLeaves]);
    }
    closeModal();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee Name</label>
        <input type="text" name="employeeName" value={formState.employeeName} onChange={handleInputChange} required className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"/>
      </div>
      <div>
        <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave Type</label>
        <select name="leaveType" value={formState.leaveType} onChange={handleInputChange} required className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
          {LEAVE_TYPE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="leaveStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
          <input type="date" name="leaveStartDate" value={formState.leaveStartDate} onChange={handleInputChange} required className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"/>
        </div>
        <div>
          <label htmlFor="leaveEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
          <input type="date" name="leaveEndDate" value={formState.leaveEndDate} onChange={handleInputChange} required className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"/>
        </div>
      </div>
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
        <textarea name="reason" value={formState.reason} onChange={handleInputChange} rows="3" required className="w-full p-2 border rounded-md shadow-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"></textarea>
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="isPaid" id="isPaid" checked={formState.isPaid} onChange={handleInputChange} className="h-4 w-4 rounded text-blue-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700"/>
        <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">This is a paid leave</label>
      </div>
      <div className="modal-action mt-6">
        <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
        <button type="submit" className="btn btn-primary">{editingLeave ? 'Save Changes' : 'Submit Request'}</button>
      </div>
    </form>
  );
}

export default AddLeaveModalBody;