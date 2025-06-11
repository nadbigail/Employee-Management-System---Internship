import React, {useState, useMemo, useEffect} from 'react';
import {FiSearch, FiEdit2, FiTrash2, FiPlus, FiDownload, FiChevronLeft, FiChevronRight, FiX} from 'react-icons/fi';
import {useSelector} from "react-redux";

const initialTasksData = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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

const TASK_STATUSES = ['Not Started', 'Pending', 'Ongoing', 'Completed', 'Cancelled'];
const ASSIGNEES = ['Eunike', 'Sara', 'Nadine', 'Jane', 'John', 'Alex', 'Maria'];


const TasksPage = () => {
  const {role} = useSelector(state => state.user);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasksData');
    return savedTasks ? JSON.parse(savedTasks) : initialTasksData.map(task => ({
      ...task,
      id: task.id || crypto.randomUUID()
    }));
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    task: '',
    completedOn: '',
    startDate: '',
    dueDate: '',
    estimatedTime: '',
    hoursLogged: '',
    assignedTo: ASSIGNEES[0] || '',
    status: TASK_STATUSES[0],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    localStorage.setItem('tasksData', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const resetFormData = () => {
    setFormData({
      code: '', task: '', completedOn: '', startDate: '', dueDate: '',
      estimatedTime: '', hoursLogged: '', assignedTo: ASSIGNEES[0] || '', status: TASK_STATUSES[0],
    });
  };

  const openModalForCreate = () => {
    setEditingTask(null);
    resetFormData();
    const nextTaskNumber = tasks.length + 1;
    setFormData(prev => ({...prev, code: `TSK${String(nextTaskNumber).padStart(3, '0')}`}));
    setShowModal(true);
  };

  const openModalForEdit = (task) => {
    setEditingTask(task);
    setFormData({...task});
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? {...t, ...formData} : t));
    } else {
      setTasks([{...formData, id: crypto.randomUUID()}, ...tasks]);
    }
    setShowModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const searchMatch = task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = statusFilter === 'All' || task.status === statusFilter;
      const assigneeMatch = assigneeFilter === 'All' || task.assignedTo === assigneeFilter;
      return searchMatch && statusMatch && assigneeMatch;
    });
  }, [tasks, searchQuery, statusFilter, assigneeFilter]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTasks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const handleExport = () => {
    console.log("Exporting tasks:", filteredTasks);
    alert("Check console for exported data (implement actual export logic).");
  };

  const tableHeaders = ['Code', 'Task', 'Completed On', 'Start Date', 'Due Date', 'Estimated Time', 'Hours Logged', 'Assigned To', 'Status', 'Action'];

  return (
    <div className="px-4 sm:px-8 py-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="relative">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search
              Tasks</label>
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-0.5 w-5 h-5 text-gray-400 dark:text-gray-500 mt-2"/>
            <input
              type="text"
              id="search"
              placeholder="Search by task, code, assignee..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <label htmlFor="statusFilter"
                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              id="statusFilter"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              {TASK_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="assigneeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned
              To</label>
            <select
              id="assigneeFilter"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={assigneeFilter}
              onChange={(e) => {
                setAssigneeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Assignees</option>
              {[...new Set(tasks.map(task => task.assignedTo).concat(ASSIGNEES))].sort().map(assignee => <option
                key={assignee} value={assignee}>{assignee}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        {role === 'admin' &&
          <div
            className="flex flex-col sm:flex-row justify-start items-center mb-3 space-y-2 sm:space-y-0 sm:space-x-3">
            <button onClick={openModalForCreate}
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
              <FiPlus className="mr-2"/> Add Task
            </button>
          </div>
        }

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300">
            <tr>
              {tableHeaders.map(header => (
                <th key={header} className="px-4 py-3 border-b dark:border-gray-600 whitespace-nowrap">{header}</th>
              ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedTasks.length > 0 ? paginatedTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{task.code}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 min-w-[150px]">{task.task}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{task.completedOn || '-'}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{task.startDate}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{task.dueDate}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{task.estimatedTime}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{task.hoursLogged}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{task.assignedTo}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                       task.status === 'Completed' ? 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100' :
                         task.status === 'Ongoing' ? 'bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100' :
                           task.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100' :
                             task.status === 'Not Started' ? 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100' :
                               'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100' // Cancelled or other
                     }`}>
                        {task.status}
                      </span>
                </td>
                {role === 'admin' &&
                  <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openModalForEdit(task)}
                              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 p-1"
                              title="Edit Task"><FiEdit2 size={16}/></button>
                      <button onClick={() => handleDeleteTask(task.id)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                              title="Delete Task">
                        <FiTrash2 size={16}/></button>
                    </div>
                  </td>
                }
              </tr>
            )) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No tasks found.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {filteredTasks.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
            <div className="mb-2 sm:mb-0 text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of {filteredTasks.length} entries
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded text-gray-600 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <FiChevronLeft size={16} className="mr-1"/> Previous
              </button>
              <span className="px-2 text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border rounded text-gray-600 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next <FiChevronRight size={16} className="ml-1"/>
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <FiX size={24}/>
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label htmlFor="code"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                  <input type="text" name="code" id="code" value={formData.code} onChange={handleInputChange} required
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"/>
                </div>
                <div>
                  <label htmlFor="task" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task
                    Description</label>
                  <input type="text" name="task" id="task" value={formData.task} onChange={handleInputChange} required
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"/>
                </div>
                <div>
                  <label htmlFor="assignedTo"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
                  <select name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleInputChange}
                          required
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100">
                    {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="status"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select name="status" id="status" value={formData.status} onChange={handleInputChange} required
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100">
                    {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="startDate"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input type="date" name="startDate" id="startDate" value={formData.startDate}
                         onChange={handleInputChange} required
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"/>
                </div>
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due
                    Date</label>
                  <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleInputChange}
                         required
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"/>
                </div>
                <div>
                  <label htmlFor="estimatedTime"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Time
                    (e.g., 8h)</label>
                  <input type="text" name="estimatedTime" id="estimatedTime" value={formData.estimatedTime}
                         onChange={handleInputChange}
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"/>
                </div>
                <div>
                  <label htmlFor="hoursLogged"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hours Logged (e.g.,
                    7.5h)</label>
                  <input type="text" name="hoursLogged" id="hoursLogged" value={formData.hoursLogged}
                         onChange={handleInputChange}
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"/>
                </div>
                <div>
                  <label htmlFor="completedOn"
                         className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completed
                    On</label>
                  <input type="date" name="completedOn" id="completedOn" value={formData.completedOn}
                         onChange={handleInputChange}
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"/>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white">
                  {editingTask ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
