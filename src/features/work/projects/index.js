import React from 'react';
import { FiSearch, FiSettings } from 'react-icons/fi';

const ProjectsPage = () => {
  return (
    <div className="px-8 py-6 bg-gray-100 min-h-screen">

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded shadow mb-6">

        {/* Duration Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Duration</span>
          <input type="date" className="border rounded px-2 py-1 text-sm" />
          <span className="text-sm text-gray-600">to</span>
          <input type="date" className="border rounded px-2 py-1 text-sm" />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Status</span>
          <select className="border rounded px-3 py-1 text-sm text-gray-700">
            <option>All</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Progress Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Progress</span>
          <select className="border rounded px-3 py-1 text-sm text-gray-700">
            <option>0% - 20%</option>
            <option>21% - 50%</option>
            <option>51% - 80%</option>
            <option>81% - 100%</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Start typing to search"
            className="border pl-8 pr-3 py-1 rounded text-sm text-gray-700 w-56"
          />
          <FiSearch className="absolute left-2 top-2 text-gray-400 text-sm" />
        </div>

        {/* Filters Button */}
        <button className="ml-auto border px-3 py-1 text-sm rounded text-gray-600 hover:bg-gray-100 flex items-center">
          <FiSettings className="mr-2" />
          Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <button className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Export</button>
        </div>

        <table className="min-w-full text-sm table-auto border-collapse">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              {['Code', 'Project Name', 'Members', 'Start Date', 'Deadline', 'Client', 'Status', 'Action'].map(header => (
                <th key={header} className="px-4 py-2 border-b">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-400">
                No data available in table
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 text-sm">
          <div>Showing 0 to 0 entries of 0 entries</div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">Previous</button>
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
