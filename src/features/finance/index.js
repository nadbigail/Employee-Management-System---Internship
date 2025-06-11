import {ChevronDown, Download, Edit2, Filter, Plus, Search, Trash2, Upload, X} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";

const initialExpenses = [
  {
    id: crypto.randomUUID(),
    itemName: 'Macbook Pro',
    price: 1200.00,
    employees: ['Alice Wonderland', 'Bob The Builder'],
    purchasedFrom: 'Tech Store Inc.',
    purchaseDate: '2024-05-15',
    status: 'Approved',
  },
  {
    id: crypto.randomUUID(),
    itemName: 'Office Chairs (x5)',
    price: 750.50,
    employees: ['Charlie Brown'],
    purchasedFrom: 'Furniture Co.',
    purchaseDate: '2024-05-20',
    status: 'Pending',
  },
  {
    id: crypto.randomUUID(),
    itemName: 'Software Subscription',
    price: 99.99,
    employees: ['Diana Prince'],
    purchasedFrom: 'SaaS Provider',
    purchaseDate: '2024-06-01',
    status: 'Approved',
  },
];


export default function App() {
  const {role} = useSelector(state => state.user);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [duration, setDuration] = useState('Start Date To End Date');

  const statusDropdownRef = useRef(null);
  const durationDropdownRef = useRef(null);

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newEmployees, setNewEmployees] = useState('');
  const [newPurchasedFrom, setNewPurchasedFrom] = useState('');
  const [newPurchaseDate, setNewPurchaseDate] = useState('');
  const [newStatus, setNewStatus] = useState('Pending');
  const [editingExpense, setEditingExpense] = useState(null);


  const filterStatusOptions = ['All', 'Pending', 'Approved', 'Rejected'];
  const modalStatusOptions = ['Pending', 'Approved', 'Rejected'];


  const durationOptions = [
    'Today',
    'Last 30 Days',
    'This Month',
    'Last Month',
    'Last 90 Days',
    'Last 6 Months',
    'Last 1 Year',
    'Custom Range'
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) {
        setDurationDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSaveExpense = (e) => {
    e.preventDefault();

    if (!newItemName || !newPrice || !newPurchaseDate || !newStatus) {

      alert("Please fill in Item Name, Price, Purchase Date, and Status.");
      return;
    }

    const expenseData = {
      itemName: newItemName,
      price: parseFloat(newPrice),
      employees: newEmployees.split(',').map(emp => emp.trim()).filter(emp => emp),
      purchasedFrom: newPurchasedFrom,
      purchaseDate: newPurchaseDate,
      status: newStatus,
    };

    if (editingExpense) {

      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? {...exp, ...expenseData} : exp));
    } else {

      setExpenses(prevExpenses => [{id: crypto.randomUUID(), ...expenseData}, ...prevExpenses]);
    }

    setNewItemName('');
    setNewPrice('');
    setNewEmployees('');
    setNewPurchasedFrom('');
    setNewPurchaseDate('');
    setNewStatus('Pending');
    setEditingExpense(null);
    setShowAddExpenseModal(false);
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setNewItemName('');
    setNewPrice('');
    setNewEmployees('');
    setNewPurchasedFrom('');
    setNewPurchaseDate('');
    setNewStatus('Pending');
    setShowAddExpenseModal(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setNewItemName(expense.itemName);
    setNewPrice(expense.price.toString());
    setNewEmployees(expense.employees.join(', '));
    setNewPurchasedFrom(expense.purchasedFrom);
    setNewPurchaseDate(expense.purchaseDate);
    setNewStatus(expense.status);
    setShowAddExpenseModal(true);
  };

  const handleDeleteExpense = (expenseId) => {

    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
    }
  };


  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;


  const filteredExpenses = expenses.filter(expense =>
    statusFilter === 'All' || expense.status === statusFilter
  );

  const currentEntries = filteredExpenses.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalEntries = filteredExpenses.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const startEntry = totalEntries > 0 ? indexOfFirstEntry + 1 : 0;
  const endEntry = Math.min(indexOfLastEntry, totalEntries);


  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 min-h-screen text-gray-900 dark:text-gray-200 font-sans">
      {/* Filters row with dividers */}
      <div
        className="flex flex-wrap items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 relative p-2 sm:p-0">
        {/* Duration filter */}
        <div className="flex items-center px-2 sm:px-4 py-2 relative" ref={durationDropdownRef}>
          <span className="text-sm font-medium mr-2 dark:text-gray-300">Duration</span>
          <div
            className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm cursor-pointer flex items-center"
            onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
          >
            <span className="text-gray-600 dark:text-gray-300">{duration}</span>
            <ChevronDown className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-400"/>
          </div>

          {durationDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-700 rounded-md shadow-lg z-20 border dark:border-gray-600">
              {durationOptions.map((option, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${
                    duration === option ? 'bg-blue-500 text-white dark:bg-blue-600' : ''
                  }`}
                  onClick={() => {
                    setDuration(option);
                    setDurationDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

        {/* Status filter */}
        <div className="flex items-center px-2 sm:px-4 py-2 relative" ref={statusDropdownRef}>
          <span className="text-sm font-medium mr-2 dark:text-gray-300">Status</span>
          <div
            className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 cursor-pointer"
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
          >
            <span className="text-sm text-gray-600 dark:text-gray-300">{statusFilter}</span>
            <ChevronDown className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-400"/>
          </div>

          {statusDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-20 border dark:border-gray-600">
              {filterStatusOptions.map((option, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 ${
                    statusFilter === option ? 'bg-blue-500 text-white dark:bg-blue-600' : ''
                  }`}
                  onClick={() => {
                    setStatusFilter(option);
                    setStatusDropdownOpen(false);
                    setCurrentPage(1);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

        {/* Search field */}
        <div className="relative flex-grow px-2 sm:px-4 py-2 w-full sm:w-auto">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"/>
            <input
              type="text"
              placeholder="Start typing to search"
              className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 border-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:ring-0 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"

            />
          </div>
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

        {/* Filters button */}
        <div className="px-2 sm:px-4 py-2">
          <button
            className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4"/>
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {role === 'admin' &&
          <button
            onClick={openAddModal}
            className="flex items-center space-x-1 bg-blue-800 dark:bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4"/>
            <span>Add Expense</span>
          </button>
        }
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <th className="py-3 px-4">
                <input type="checkbox"
                       className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-offset-gray-800"/>
              </th>
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Employees</th>
              <th className="py-3 px-4">Purchased From</th>
              <th className="py-3 px-4">Purchase Date</th>
              <th className="py-3 px-4">Status</th>
              {role === 'admin' &&
                <th className="py-3 px-4">Action</th>
              }
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentEntries.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No data available in table.
                  {expenses.length > 0 && statusFilter !== 'All' && " (Try changing status filter)"}
                </td>
              </tr>
            ) : (
              currentEntries.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-3 px-4">
                    <input type="checkbox"
                           className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-offset-gray-800"/>
                  </td>
                  <td
                    className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{expense.itemName}</td>
                  <td
                    className="py-3 px-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${expense.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate"
                      title={expense.employees.join(', ')}>
                    {expense.employees.length > 0 ? expense.employees.join(', ') : '-'}
                  </td>
                  <td
                    className="py-3 px-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{expense.purchasedFrom}</td>
                  <td
                    className="py-3 px-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{expense.purchaseDate}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        expense.status === 'Approved' ? 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100' :
                          expense.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100' :
                            'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100'
                      }`}>
                        {expense.status}
                      </span>
                  </td>
                  {role === 'admin' &&
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEditModal(expense)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                title="Edit Expense">
                          <Edit2 size={18}/>
                        </button>
                        <button onClick={() => handleDeleteExpense(expense.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                title="Delete Expense">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  }
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between p-4 text-sm border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0 text-gray-600 dark:text-gray-400">
            <span>Show</span>
            <div className="relative inline-block">
              <select
                className="appearance-none border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 pr-8 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <ChevronDown className="w-4 h-4"/>
              </div>
            </div>
            <span>entries</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-gray-600 dark:text-gray-400">
              Showing {startEntry} to {endEntry} of {totalEntries} entries
            </span>
            <button
              onClick={handlePrevious}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200"
              disabled={currentPage === totalPages || totalEntries === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <button
                onClick={() => {
                  setShowAddExpenseModal(false);
                  setEditingExpense(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleSaveExpense}>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"> {/* Added scroll for smaller screens */}
                <div>
                  <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item
                    Name</label>
                  <input
                    type="text"
                    id="itemName"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="e.g. Office Laptop"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price
                    ($)</label>
                  <input
                    type="number"
                    id="price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="e.g. 1200.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="employees"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employees
                    (comma-separated)</label>
                  <input
                    type="text"
                    id="employees"
                    value={newEmployees}
                    onChange={(e) => setNewEmployees(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="e.g. John Doe, Jane Smith"
                  />
                </div>
                <div>
                  <label htmlFor="purchasedFrom"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchased
                    From</label>
                  <input
                    type="text"
                    id="purchasedFrom"
                    value={newPurchasedFrom}
                    onChange={(e) => setNewPurchasedFrom(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="e.g. Online Store"
                  />
                </div>
                <div>
                  <label htmlFor="purchaseDate"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase
                    Date</label>
                  <input
                    type="date"
                    id="purchaseDate"
                    value={newPurchaseDate}
                    onChange={(e) => setNewPurchaseDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    required
                  />
                </div>
                {/* Status selection in modal */}
                <div>
                  <label htmlFor="status"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    required
                  >
                    {/* <option value="" disabled>Select a status</option> */}
                    {modalStatusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddExpenseModal(false);
                    setEditingExpense(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                >
                  {editingExpense ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}