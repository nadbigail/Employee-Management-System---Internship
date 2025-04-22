import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Plus, Upload, Download } from 'lucide-react';

export default function FinanceDashboard() {
  // State for the expense items
  const [expenses, setExpenses] = useState([]);
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  // State for filters
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [status, setStatus] = useState('All');
  const [duration, setDuration] = useState('Start Date To End Date');
  
  // References for dropdown elements
  const statusDropdownRef = useRef(null);
  const durationDropdownRef = useRef(null);

  // Status options
  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];
  
  // Duration options
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

  // Close dropdowns when clicking outside
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

  // Functions
  const addExpense = () => console.log('Add expense clicked');
  const handleImport = () => console.log('Import clicked');
  const handleExport = () => console.log('Export clicked');
  const handleNext = () => setCurrentPage(prev => prev + 1);
  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-gray-100 p-4">
      {/* Filters row with dividers */}
      <div className="flex items-center bg-white rounded-lg shadow-sm mb-4 relative">
        {/* Duration filter */}
        <div className="flex items-center px-4 py-2 relative" ref={durationDropdownRef}>
          <span className="text-sm font-medium mr-2">Duration</span>
          <div 
            className="bg-gray-200 rounded-full px-3 py-1 text-sm cursor-pointer"
            onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
          >
            <span className="text-gray-600">{duration}</span>
          </div>
          
          {/* Duration dropdown */}
          {durationDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10">
              {durationOptions.map((option, index) => (
                <div 
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    option === 'Last 90 Days' ? 'bg-gray-600 text-white' : ''
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
        
        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>
        
        {/* Status filter */}
        <div className="flex items-center px-4 py-2 relative" ref={statusDropdownRef}>
          <span className="text-sm font-medium mr-2">Status</span>
          <div 
            className="flex items-center bg-gray-200 rounded-full px-3 py-1 cursor-pointer"
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
          >
            <span className="text-sm text-gray-600">{status}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          {/* Status dropdown */}
          {statusDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
              {statusOptions.map((option, index) => (
                <div 
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    option === 'All' ? 'bg-red-500 text-white' : ''
                  }`}
                  onClick={() => {
                    setStatus(option);
                    setStatusDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>
        
        {/* Search field */}
        <div className="relative flex-grow px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Start typing to search"
              className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-200 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-8 w-px bg-gray-300"></div>
        
        {/* Filters button */}
        <div className="px-4 py-2">
          <button className="flex items-center space-x-2 rounded-lg px-3 py-1 text-sm hover:bg-gray-100">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={addExpense}
          className="flex items-center space-x-1 bg-blue-700 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
        
        <button 
          onClick={handleImport}
          className="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900"
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>
        
        <button 
          onClick={handleExport}
          className="flex items-center space-x-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="py-3 px-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Employees</th>
                <th className="py-3 px-4">Purchased From</th>
                <th className="py-3 px-4">Purchase Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">No data available in table</td>
                </tr>
              ) : (
                expenses.map((expense, index) => (
                  <tr key={index}>
                    {/* Table row content would go here */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 text-sm border-t">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <div className="relative inline-block">
              <select
                className="appearance-none border rounded px-8 py-1 bg-white"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <span>entries</span>
          </div>

          <div className="flex items-center">
            <span>Showing 10 to 10 entries</span>
            <button 
              onClick={handlePrevious}
              className="ml-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              onClick={handleNext}
              className="ml-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}