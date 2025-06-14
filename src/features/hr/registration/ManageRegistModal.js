import React, { useState } from 'react';
import moment from 'moment';

function ManageRegistrationModal({ extraObject, closeModal }) {
  const { request, handleRequestStatus } = extraObject;

  const getInitialRole = () => {
    if (request.status.includes('admin')) return 'Admin';
    return 'Employee';
  };

  const [selectedRole, setSelectedRole] = useState(getInitialRole());

  const onApprove = () => {
    const newStatus = `Approved as ${selectedRole.toLowerCase()}`;
    handleRequestStatus(request.id, newStatus);
    closeModal();
  };

  const onReject = () => {
    handleRequestStatus(request.id, 'Rejected');
    closeModal();
  };

  return (
    <div className="text-left">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center font-bold text-blue-700 text-lg">
          {(request.firstName[0] || '') + (request.lastName[0] || '')}
        </div>
        <div>
          <h3 className="font-semibold text-lg dark:text-gray-100">{request.firstName} {request.lastName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{request.emailId}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{request.department}</p>
        </div>
      </div>

      <h4 className="font-semibold mb-2 dark:text-gray-200">Select Role for this user:</h4>
      <div className="space-y-3">
        <div className="p-3 border rounded-lg dark:border-gray-600 flex items-center cursor-pointer" onClick={() => setSelectedRole('Employee')}>
          <input type="radio" name="role-select" className="radio radio-primary" checked={selectedRole === 'Employee'} readOnly />
          <div className="ml-3">
            <p className="font-semibold dark:text-gray-200">Employee</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Standard user access.</p>
          </div>
        </div>
        <div className="p-3 border rounded-lg dark:border-gray-600 flex items-center cursor-pointer" onClick={() => setSelectedRole('Admin')}>
          <input type="radio" name="role-select" className="radio radio-primary" checked={selectedRole === 'Admin'} readOnly />
          <div className="ml-3">
            <p className="font-semibold dark:text-gray-200">Admin</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Full system access.</p>
          </div>
        </div>
      </div>

      <div className="modal-action mt-6">
        <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
        {request.status === 'Pending' && <button className="btn btn-error" onClick={onReject}>Reject</button>}
        <button className="btn btn-success text-white" onClick={onApprove}>Approve as {selectedRole}</button>
      </div>
    </div>
  )
}

export default ManageRegistrationModal;