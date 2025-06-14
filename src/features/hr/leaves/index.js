import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil';
import {
  Plus, Search, X, Edit2, Trash2, Check, Calendar, Type
} from 'lucide-react';
import moment from 'moment';

const darkClass = (lightClass, darkVariant) => `${lightClass} ${darkVariant}`;

const initialLeaveData = [
  { id: crypto.randomUUID(), employeeName: 'Alice Johnson', employeeAvatar: 'AJ', employeeDept: 'Engineering', leaveStartDate: '2025-06-23', leaveEndDate: '2025-06-25', leaveType: 'Vacation', isPaid: true, reason: 'Family trip to the mountains for some well-deserved rest and quality time.', status: 'Approved' },
  { id: crypto.randomUUID(), employeeName: 'Bob Williams', employeeAvatar: 'BW', employeeDept: 'Marketing', leaveStartDate: '2025-06-10', leaveEndDate: '2025-06-10', leaveType: 'Sick Leave', isPaid: true, reason: 'Fever and headache.', status: 'Pending' },
  { id: crypto.randomUUID(), employeeName: 'Nadine Abigail', employeeAvatar: 'NA', employeeDept: 'Product', leaveStartDate: '2025-07-01', leaveEndDate: '2025-07-05', leaveType: 'Vacation', isPaid: true, reason: 'Annual leave.', status: 'Pending' },
  { id: crypto.randomUUID(), employeeName: 'John Doe', employeeAvatar: 'JD', employeeDept: 'IT', leaveStartDate: '2025-06-15', leaveEndDate: '2025-06-15', leaveType: 'Personal', isPaid: false, reason: 'Family emergency, need to attend to a personal matter.', status: 'Approved' },
  { id: crypto.randomUUID(), employeeName: 'Eunike Alfrita', employeeAvatar: 'EA', employeeDept: 'HR', leaveStartDate: '2025-05-28', leaveEndDate: '2025-05-29', leaveType: 'Sick Leave', isPaid: true, reason: 'Scheduled medical check-up.', status: 'Rejected' },
  { id: crypto.randomUUID(), employeeName: 'David Brown', employeeAvatar: 'DB', employeeDept: 'Finance', leaveStartDate: '2025-07-10', leaveEndDate: '2025-07-12', leaveType: 'Vacation', isPaid: true, reason: 'Holiday trip.', status: 'Pending' },
  { id: crypto.randomUUID(), employeeName: 'Nadine Abigail', employeeAvatar: 'NA', employeeDept: 'Product', leaveStartDate: '2025-08-01', leaveEndDate: '2025-08-15', leaveType: 'Maternity/Paternity', isPaid: true, reason: 'Maternity Leave', status: 'Approved' },
];

const LEAVE_STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];
const LEAVE_TYPE_OPTIONS = ['Vacation', 'Sick Leave', 'Personal', 'Maternity/Paternity', 'Unpaid', 'Other'];

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusClasses = {
    Approved: darkClass("bg-green-100 text-green-800", "dark:bg-green-700 dark:text-green-100"),
    Pending: darkClass("bg-yellow-100 text-yellow-800", "dark:bg-yellow-700 dark:text-yellow-100"),
    Rejected: darkClass("bg-red-100 text-red-800", "dark:bg-red-700 dark:text-red-100"),
  };
  return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const LeaveCard = ({ leave, onUpdateStatus, onEdit, onDelete, role }) => {
  const { employeeName, employeeAvatar, employeeDept, leaveStartDate, leaveEndDate, leaveType, reason, status } = leave;

  return (
    <div className={darkClass("bg-white rounded-lg shadow-md p-4 mb-4", "dark:bg-gray-800")}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-800 flex-shrink-0 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold text-sm">{employeeAvatar}</div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">{employeeName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{employeeDept}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Calendar size={14} />
          <span>{moment(leaveStartDate).format("D MMM YY")} - {moment(leaveEndDate).format("D MMM YY")}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Type size={14} />
          <span>{leaveType}</span>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        <p className="font-medium text-gray-700 dark:text-gray-200">Reason:</p>
        <p className="line-clamp-3">{reason}</p>
      </div>

      {role === 'admin' && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-3 dark:border-gray-700">
          {status === 'Pending' ? (
            <>
              <button onClick={() => onUpdateStatus(leave, 'Approved')} className="btn btn-sm btn-success text-white flex-grow sm:flex-grow-0 min-w-[80px]"><Check size={14} className="mr-1"/>Approve</button>
              <button onClick={() => onUpdateStatus(leave, 'Rejected')} className="btn btn-sm btn-error text-white flex-grow sm:flex-grow-0 min-w-[80px]"><X size={14} className="mr-1"/>Reject</button>
              <button onClick={() => onEdit(leave)} className="btn btn-sm btn-ghost"><Edit2 size={14}/></button>
            </>
          ) : (
            <button onClick={() => onDelete(leave.id)} className="btn btn-sm btn-ghost text-red-500"><Trash2 size={14}/></button>
          )}
        </div>
      )}
    </div>
  );
};

export default function EmployeeLeavesDashboard() {
  const { role, name } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [leaves, setLeaves] = useState(initialLeaveData);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const handleOpenAddModal = () => {
    dispatch(openModal({
      title: "Add New Leave Request",
      bodyType: MODAL_BODY_TYPES.LEAVE_ADD_NEW,
      extraObject: { setLeaves, role, name }
    }));
  };

  const handleOpenEditModal = (leave) => {
    dispatch(openModal({
      title: "Edit Leave Request",
      bodyType: MODAL_BODY_TYPES.LEAVE_ADD_NEW,
      extraObject: { setLeaves, editingLeave: leave, role, name }
    }));
  };

  const handleUpdateStatus = (leaveId, status) => {
    setLeaves(leaves.map(l => l.id === leaveId ? { ...l, status } : l));
  };

  const handleDeleteLeave = (leaveId) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      setLeaves(leaves.filter(l => l.id !== leaveId));
    }
  };

  const openConfirmationModal = (leave, newStatus) => {
    dispatch(openModal({
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.LEAVE_REQUEST_CONFIRMATION,
      extraObject: {
        message: `Are you sure you want to ${newStatus.toLowerCase()} this leave request?`,
        onConfirm: () => handleUpdateStatus(leave.id, newStatus),
      }
    }))
  };

  const filteredLeaves = useMemo(() => {
    let filtered = [...leaves];
    if (role === 'employee') {
      filtered = filtered.filter(leave => leave.employeeName === name);
    }

    if (role === 'admin') {
      filtered = filtered.filter(leave => {
        const searchMatch = searchQuery === '' || leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || leave.reason.toLowerCase().includes(searchQuery.toLowerCase());
        const statusMatch = statusFilter === 'All' || leave.status === statusFilter;
        const typeMatch = typeFilter === 'All' || leave.leaveType === typeFilter;
        return searchMatch && statusMatch;
      });
    }
    return filtered;
  }, [leaves, searchQuery, statusFilter, typeFilter, role, name]);

  const currentEntries = filteredLeaves.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const getLeaveDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if(isNaN(startDate) || isNaN(endDate)) return 'N/A';
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div className={darkClass("px-4 sm:px-6 md:px-8 py-6 bg-gray-100 min-h-screen", "dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans")}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Leave Management</h1>
        <button onClick={handleOpenAddModal} className="flex items-center justify-center space-x-1.5 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm w-full sm:w-auto">
          <Plus className="w-4 h-4"/>
          <span>Add Leave Request</span>
        </button>
      </div>

      {role === 'admin' && (
        <div className={darkClass("flex flex-col sm:flex-row sm:flex-wrap gap-4 items-start sm:items-center bg-white p-4 rounded-lg shadow-sm mb-6", "dark:bg-gray-800")}>
          <div className="relative w-full sm:w-auto sm:flex-grow sm:max-w-xs">
            <Search className={darkClass("absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400", "dark:text-gray-500")}/>
            <input
              type="text"
              placeholder="Search by employee or reason..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className={darkClass("pl-10 pr-4 py-2 w-full rounded-md bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm", "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-blue-500")}
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className={darkClass("text-sm font-medium text-gray-600", "dark:text-gray-300")}>Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={darkClass("border rounded-md px-3 py-1.5 text-sm w-full sm:w-auto", "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 dark:border-gray-600")}
            >
              <option>All</option>
              {LEAVE_STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className={darkClass("text-sm font-medium text-gray-600", "dark:text-gray-300")}>Type:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className={darkClass("border rounded-md px-3 py-1.5 text-sm w-full sm:w-auto", "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 dark:border-gray-600")}
            >
              <option>All</option>
              {LEAVE_TYPE_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="block lg:hidden">
        {currentEntries.length > 0 ? currentEntries.map(leave => (
          <LeaveCard
            key={leave.id}
            leave={leave}
            onUpdateStatus={openConfirmationModal}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteLeave}
            role={role}
          />
        )) : <p className="text-center text-gray-500 py-8 text-sm">No leave requests found.</p>}
      </div>

      <div className={darkClass("hidden lg:block bg-white rounded-md shadow overflow-hidden", "dark:bg-gray-800")}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto">
            <thead className={darkClass("bg-gray-50", "dark:bg-gray-700")}>
            <tr className={darkClass("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", "dark:text-gray-300")}>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Leave Date</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Leave Type</th>
              <th className="py-3 px-4">Reason</th>
              {role === 'admin' && <th className="py-3 px-4">Paid</th>}
              <th className="py-3 px-4">Leave Status</th>
              {role === 'admin' && <th className="py-3 px-4 text-center">Action</th>}
            </tr>
            </thead>
            <tbody className={darkClass("divide-y", "divide-gray-200 dark:divide-gray-700")}>
            {currentEntries.length > 0 ? currentEntries.map(leave => (
              <tr key={leave.id} className={darkClass("hover:bg-gray-50", "dark:hover:bg-gray-700/50")}>
                <td className="py-3 px-4 whitespace-nowrap"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-blue-200 dark:bg-blue-800 flex-shrink-0 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold text-sm">{leave.employeeAvatar}</div><div><div className="font-medium text-gray-900 dark:text-gray-100">{leave.employeeName}</div><div className="text-xs text-gray-500 dark:text-gray-400">{leave.employeeDept}</div></div></div></td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{leave.leaveStartDate} to {leave.leaveEndDate}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{getLeaveDuration(leave.leaveStartDate, leave.leaveEndDate)}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{leave.leaveType}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300 max-w-xs truncate" title={leave.reason}>{leave.reason}</td>
                {role === 'admin' && <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{leave.isPaid ? 'Yes' : 'No'}</td>}
                <td className="py-3 px-4"><StatusBadge status={leave.status} /></td>
                {role === 'admin' && (<td className="py-3 px-4 text-center">{leave.status === 'Pending' ? (<div className="flex items-center justify-center gap-2"><button onClick={() => openConfirmationModal(leave, 'Approved')} className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-700" title="Approve"><Check size={14}/></button><button onClick={() => openConfirmationModal(leave, 'Rejected')} className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-700" title="Reject"><X size={14}/></button><button onClick={() => handleOpenEditModal(leave)} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700" title="Edit"><Edit2 size={14}/></button></div>) : (<button onClick={() => handleDeleteLeave(leave.id)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 dark:hover:bg-gray-700 dark:text-gray-400" title="Delete"><Trash2 size={16}/></button>)}</td>)}
              </tr>
            )) : (
              <tr><td colSpan={role === 'admin' ? 8 : 6} className="text-center py-10 text-gray-500">No leave requests found.</td></tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}