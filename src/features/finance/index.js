import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../utils/globalConstantUtil';
import {
  Plus, Search, X, Edit2, Check,
} from 'lucide-react';
import moment from 'moment';

const darkClass = (lightClass, darkVariant) => `${lightClass} ${darkVariant}`;

const initialExpenses = [
  { id: crypto.randomUUID(), requestedBy: 'Alice Johnson', employeeDept: 'Engineering', itemName: 'Macbook Pro 14"', price: 2100.00, purchasedFrom: 'Official Apple Store', purchaseDate: '2025-06-25', reason: 'New laptop for lead developer', status: 'Approved' },
  { id: crypto.randomUUID(), requestedBy: 'Bob Williams', employeeDept: 'Marketing', itemName: 'Social Media Ads', price: 500.00, purchasedFrom: 'Meta Inc.', purchaseDate: '2025-06-28', reason: 'Q3 Campaign Budget', status: 'Pending' },
  { id: crypto.randomUUID(), requestedBy: 'Nadine Abigail', employeeDept: 'Product', itemName: 'Figma Subscription (1 Year)', price: 180.00, purchasedFrom: 'Figma', purchaseDate: '2025-07-01', reason: 'Annual design tool license renewal', status: 'Pending' },
  { id: crypto.randomUUID(), requestedBy: 'John Doe', employeeDept: 'IT', itemName: 'Server Rack', price: 850.75, purchasedFrom: 'Data Center Solutions', purchaseDate: '2025-06-18', reason: 'Infrastructure upgrade', status: 'Approved' },
  { id: crypto.randomUUID(), requestedBy: 'Eunike Alfrita', employeeDept: 'HR', itemName: 'Team Building Catering', price: 350.00, purchasedFrom: 'Local Catering Co.', purchaseDate: '2025-05-20', reason: 'Catering for quarterly team event. Invoice attached.', status: 'Rejected' },
];

const EXPENSE_STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];

const StatusBadge = ({ status }) => {
  const statusClasses = { Approved: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100", Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100", Rejected: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100", };
  return <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100'}`}>{status}</span>;
};

export default function FinanceDashboard() {
  const { role, name, department } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [expenses, setExpenses] = useState(() => {
    try { const saved = localStorage.getItem('expenseRequests'); return saved ? JSON.parse(saved) : initialExpenses; } catch (error) { return initialExpenses; }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => { localStorage.setItem('expenseRequests', JSON.stringify(expenses)); }, [expenses]);

  const canApprove = role === 'admin' || department === 'Finance Accounting & Tax';

  const handleOpenAddModal = () => { dispatch(openModal({ title: "Add New Expense Request", bodyType: MODAL_BODY_TYPES.EXPENSE_ADD_NEW, extraObject: { setExpenses, requestedBy: name, role, department } })); };
  const handleOpenEditModal = (expense) => { dispatch(openModal({ title: "Edit Expense Request", bodyType: MODAL_BODY_TYPES.EXPENSE_ADD_NEW, extraObject: { setExpenses, editingExpense: expense, role, department } })); };

  const handleUpdateStatus = (id, newStatus) => {
    if(!canApprove) return alert("You don't have permission to perform this action.");
    setExpenses(prev => prev.map(exp => exp.id === id ? {...exp, status: newStatus} : exp));
  };

  const openConfirmationModal = (expense, newStatus) => {
    if (!canApprove) return;
    dispatch(openModal({ title: "Confirm Action", bodyType: MODAL_BODY_TYPES.CONFIRMATION, extraObject: { message: `Are you sure you want to ${newStatus.toLowerCase()} this expense request?`, onConfirm: () => handleUpdateStatus(expense.id, newStatus), } }));
  };

  const filteredExpenses = useMemo(() => {
    let data = [...expenses];
    if (role === 'employee' && !canApprove) { data = data.filter(exp => exp.requestedBy === name); }
    return data.filter(expense => (searchQuery === '' || expense.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || expense.requestedBy.toLowerCase().includes(searchQuery.toLowerCase())) && (statusFilter === 'All' || expense.status === statusFilter)).sort((a,b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
  }, [expenses, searchQuery, statusFilter, role, name, canApprove]);

  return (
    <div className={darkClass("px-4 sm:px-8 py-6 bg-gray-100 min-h-screen", "dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans")}>
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Finance - Expenses</h1>
        <button onClick={handleOpenAddModal} className="btn btn-sm btn-primary"><Plus className="w-4 h-4 mr-2"/>New Expense Request</button>
      </div>

      <div className={darkClass("flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm mb-6", "dark:bg-gray-800")}>
        <div className="relative flex-grow max-w-xs"><Search className={darkClass("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", "text-gray-400 dark:text-gray-500")}/><input type="text" placeholder="Search item or requester..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={darkClass("pl-10 pr-4 py-2 w-full rounded-md bg-gray-50 border-gray-300", "dark:bg-gray-700 dark:border-gray-600")} /></div>
        <div className="flex items-center space-x-2"><span className="text-sm font-medium">Status:</span><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={darkClass("select select-bordered select-sm", "dark:bg-gray-700 dark:border-gray-600")}><option>All</option>{EXPENSE_STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}</select></div>
      </div>

      <div className={darkClass("bg-white rounded-md shadow overflow-hidden", "dark:bg-gray-800")}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className={darkClass("bg-gray-50 text-gray-500 uppercase", "dark:bg-gray-700 dark:text-gray-400")}><tr><th className="py-3 px-4 text-left">Item</th><th className="py-3 px-4 text-left">Requested by</th><th className="py-3 px-4 text-left">Date</th><th className="py-3 px-4 text-left">Amount</th><th className="py-3 px-4 text-left">Status</th>{canApprove && <th className="py-3 px-4 text-center">Action</th>}</tr></thead>
            <tbody className="divide-y dark:divide-gray-700">
            {filteredExpenses.map(expense => (
              <tr key={expense.id}>
                <td className="py-3 px-4"><p className="font-semibold">{expense.itemName}</p><p className="text-xs text-gray-500">{expense.purchasedFrom}</p></td>
                <td className="py-3 px-4">{expense.requestedBy}</td>
                <td className="py-3 px-4">{moment(expense.purchaseDate).format("D MMM YYYY")}</td>
                <td className="py-3 px-4 font-semibold">${expense.price.toFixed(2)}</td>
                <td className="py-3 px-4"><StatusBadge status={expense.status} /></td>
                {canApprove && (
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {expense.status === 'Pending' && (
                        <>
                          <button onClick={() => openConfirmationModal(expense, 'Approved')} className="btn btn-xs btn-outline btn-success" title="Approve"><Check size={14}/></button>
                          <button onClick={() => openConfirmationModal(expense, 'Rejected')} className="btn btn-xs btn-outline btn-error" title="Reject"><X size={14}/></button>
                        </>
                      )}
                      <button onClick={() => handleOpenEditModal(expense)} className="btn btn-xs btn-ghost" title="Edit/Manage"><Edit2 size={14}/></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}