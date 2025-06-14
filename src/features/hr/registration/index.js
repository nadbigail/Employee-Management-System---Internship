import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil';
import { Search, Check, X, Eye, Edit2, Mail, Phone, Building, Calendar } from 'lucide-react';
import moment from 'moment';

const darkClass = (lightClass, darkVariant) => `${lightClass} ${darkVariant}`;

const initialRequestsData = [
  { id: 'a1', firstName: 'Alice', lastName: 'Johnson', emailId: 'alice.johnson@email.com', contact: '+62 812-3456-7890', department: 'Marketing', registrationDate: '2025-06-10', status: 'Pending' },
  { id: 'b2', firstName: 'Bob', lastName: 'Wilson', emailId: 'bob.wilson@email.com', contact: '+62 813-4567-8901', department: 'IT', registrationDate: '2025-06-09', status: 'Pending' },
  { id: 'c3', firstName: 'Carol', lastName: 'Davis', emailId: 'carol.davis@email.com', contact: '+62 814-5678-9012', department: 'HR', registrationDate: '2025-06-08', status: 'Approved as admin' },
  { id: 'd4', firstName: 'David', lastName: 'Brown', emailId: 'david.brown@email.com', contact: '+62 815-6789-0123', department: 'Finance', registrationDate: '2025-06-07', status: 'Rejected' },
  { id: 'e5', firstName: 'Eva', lastName: 'Martinez', emailId: 'eva.martinez@email.com', contact: '+62 816-7890-1234', department: 'Operations', registrationDate: '2025-06-06', status: 'Pending' },
  { id: 'f6', firstName: 'Hannah', lastName: 'Lopez', emailId: 'hannah.lopez@email.com', contact: '+62 816-7890-1234', department: 'Executive', registrationDate: '2025-06-06', status: 'Pending' },
];

const StatusBadge = ({ status }) => {
  const statusClasses = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
    'Approved as admin': "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100",
    'Approved': "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100",
    Rejected: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100",
  };
  return <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100'}`}>{status}</span>;
};

// Komponen Card untuk Tampilan Mobile
const RequestCard = ({ request, onManage, onReject }) => {
  return (
    <div className={darkClass("bg-white rounded-lg shadow-md p-4 mb-4", "dark:bg-gray-800")}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 flex-shrink-0 flex items-center justify-center font-bold text-blue-700 dark:text-blue-200 text-lg">
            {(request.firstName[0] || '') + (request.lastName ? request.lastName[0] : '')}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{request.firstName} {request.lastName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{request.department}</p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="border-t dark:border-gray-700 my-3"></div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2"><Mail size={14} /><a href={`mailto:${request.emailId}`} className="hover:underline">{request.emailId}</a></div>
        <div className="flex items-center gap-2"><Phone size={14} /><span>{request.contact || '-'}</span></div>
        <div className="flex items-center gap-2"><Calendar size={14} /><span>Registered on {moment(request.registrationDate).format('D MMM YYYY')}</span></div>
      </div>

      <div className="border-t dark:border-gray-700 mt-3 pt-3 flex items-center justify-end gap-2">
        {request.status === 'Pending' ? (
          <>
            <button onClick={() => onManage(request)} className="btn btn-sm btn-success text-white flex-grow"><Check size={16} className="mr-1"/>Approve</button>
            <button onClick={() => onReject(request.id, 'Rejected')} className="btn btn-sm btn-error text-white flex-grow"><X size={16} className="mr-1"/>Reject</button>
          </>
        ) : (
          <button onClick={() => onManage(request)} className="btn btn-sm btn-ghost"><Edit2 size={14}/> Manage</button>
        )}
      </div>
    </div>
  );
};


export default function RegistrationDashboard() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('registrationRequests')) || initialRequestsData;
    setRequests(storedRequests);
  }, []);

  const handleRequestStatus = (id, newStatus) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('registrationRequests', JSON.stringify(updatedRequests));
  };

  const openManageModal = (request) => {
    dispatch(openModal({
      title: "Manage Registration",
      bodyType: MODAL_BODY_TYPES.MANAGE_REGISTRATION,
      extraObject: { request, handleRequestStatus }
    }));
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const searchMatch = (
        (req.firstName + " " + req.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.emailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.department && req.department.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      const statusMatch = statusFilter === 'All' || req.status === statusFilter || (statusFilter === 'Approved' && req.status.includes('Approved'));
      return searchMatch && statusMatch;
    }).sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
  }, [requests, searchQuery, statusFilter]);

  const pendingCount = useMemo(() => requests.filter(r => r.status === 'Pending').length, [requests]);

  return (
    <div className={darkClass("px-4 sm:px-8 py-6 bg-gray-100 min-h-screen", "dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans")}>
      <div className="flex items-center justify-between mb-4">
        <div><h1 className="text-2xl font-bold">Registration Requests</h1><p className="text-gray-500 dark:text-gray-400">Review and approve employee registration requests</p></div>
        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full"><span className="font-bold text-lg">{pendingCount}</span><span className="text-sm">Pending</span></div>
      </div>
      <div className={darkClass("flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm mb-6", "dark:bg-gray-800")}>
        <div className="relative flex-grow max-w-sm"><Search className={darkClass("absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400", "dark:text-gray-500")}/><input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={darkClass("pl-10 pr-4 py-2 w-full rounded-md bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500", "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400")} /></div>
        <div className="flex items-center space-x-2"><label className="text-sm font-medium">Status:</label><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={darkClass("select select-bordered select-sm", "dark:bg-gray-700 dark:border-gray-600")}><option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select></div>
      </div>

      <div className="md:hidden">
        {filteredRequests.map(req => (
          <RequestCard key={req.id} request={req} onManage={openManageModal} onReject={handleRequestStatus} />
        ))}
      </div>

      <div className={darkClass("hidden md:block bg-white rounded-lg shadow-sm overflow-hidden", "dark:bg-gray-800")}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className={darkClass("bg-gray-50 text-gray-500 uppercase", "dark:bg-gray-700 dark:text-gray-400")}><tr><th className="py-3 px-4 text-left">Candidate</th><th className="py-3 px-4 text-left">Contact</th><th className="py-3 px-4 text-left">Department</th><th className="py-3 px-4 text-left">Registration Date</th><th className="py-3 px-4 text-left">Status</th><th className="py-3 px-4 text-center">Actions</th></tr></thead>
            <tbody className="divide-y dark:divide-gray-700">
            {filteredRequests.map(req => (
              <tr key={req.id}>
                <td className="p-4 whitespace-nowrap"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center font-bold text-blue-700">{(req.firstName[0] || '') + (req.lastName ? req.lastName[0] : '')}</div><div><div className="font-semibold">{req.firstName} {req.lastName}</div><div className="text-xs text-gray-500">{req.department}</div></div></div></td>
                <td className="p-4 whitespace-nowrap"><div className="flex flex-col"><a href={`mailto:${req.emailId}`} className="hover:underline">{req.emailId}</a><span className="text-gray-500">{req.contact}</span></div></td>
                <td className="p-4 whitespace-nowrap">{req.department}</td>
                <td className="p-4 whitespace-nowrap">{moment(req.registrationDate).format('DD/M/YYYY')}</td>
                <td className="p-4 whitespace-nowrap"><StatusBadge status={req.status} /></td>
                <td className="p-4 whitespace-nowrap"><div className="flex items-center justify-center gap-2">{req.status === 'Pending' ? (<><button onClick={() => openManageModal(req)} className="btn btn-xs btn-success text-white"><Check size={14}/>Approve</button><button onClick={() => handleRequestStatus(req.id, 'Rejected')} className="btn btn-xs btn-error text-white"><X size={14}/>Reject</button></>) : (<button onClick={() => openManageModal(req)} className="btn btn-xs btn-ghost"><Edit2 size={14}/>Manage</button>)}</div></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}