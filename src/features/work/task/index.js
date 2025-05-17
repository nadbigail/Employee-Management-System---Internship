import React from 'react';
import { FiSearch, FiSettings } from 'react-icons/fi';

const tasksData = [
  {
    code: 'TSK001',
    task: 'Design Login Page',
    completedOn: '2025-04-01',
    startDate: '2025-03-20',
    dueDate: '2025-04-02',
    estimatedTime: '8h',
    hoursLogged: '7.5h',
    assignedTo: 'Eunike',
    status: 'Completed',
  },
  {
    code: 'TSK002',
    task: 'API Integration',
    completedOn: '',
    startDate: '2025-04-05',
    dueDate: '2025-04-10',
    estimatedTime: '10h',
    hoursLogged: '4h',
    assignedTo: 'Sara',
    status: 'Ongoing',
  },
  {
    code: 'TSK003',
    task: 'Testing & QA',
    completedOn: '',
    startDate: '2025-04-07',
    dueDate: '2025-04-12',
    estimatedTime: '6h',
    hoursLogged: '1h',
    assignedTo: 'Nadine',
    status: 'Pending',
  },
  {
    code: 'TSK004',
    task: 'Fix Navbar Bug',
    completedOn: '2025-04-04',
    startDate: '2025-04-03',
    dueDate: '2025-04-05',
    estimatedTime: '3h',
    hoursLogged: '2.5h',
    assignedTo: 'Jane',
    status: 'Completed',
  },
  {
    code: 'TSK005',
    task: 'Deploy to Production',
    completedOn: '',
    startDate: '2025-04-10',
    dueDate: '2025-04-11',
    estimatedTime: '2h',
    hoursLogged: '0h',
    assignedTo: 'John',
    status: 'Not Started',
  },
];

const TasksPage = () => {
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
            <option>Pending</option>
            <option>Not Started</option>
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
        <div className="flex justify-start items-center mb-3 space-x-3">
          {/* Add Task Button */}
          <button className="px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
            Add Task
          </button>

          {/* Export Button */}
          <button className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            Export
          </button>
        </div>

        <table className="min-w-full text-sm table-auto border-collapse">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              {[
                'Code',
                'Task',
                'Completed On',
                'Start Date',
                'Due Date',
                'Estimated Time',
                'Hours Logged',
                'Assigned To',
                'Status',
                'Action',
              ].map((header) => (
                <th key={header} className="px-4 py-2 border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasksData.map((task, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{task.code}</td>
                <td className="px-4 py-2 border-b">{task.task}</td>
                <td className="px-4 py-2 border-b">{task.completedOn || '-'}</td>
                <td className="px-4 py-2 border-b">{task.startDate}</td>
                <td className="px-4 py-2 border-b">{task.dueDate}</td>
                <td className="px-4 py-2 border-b">{task.estimatedTime}</td>
                <td className="px-4 py-2 border-b">{task.hoursLogged}</td>
                <td className="px-4 py-2 border-b">{task.assignedTo}</td>
                <td className="px-4 py-2 border-b">{task.status}</td>
                <td className="px-4 py-2 border-b text-blue-600 cursor-pointer hover:underline">View</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 text-sm">
          <div>Showing 1 to 5 of 5 entries</div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">Previous</button>
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
