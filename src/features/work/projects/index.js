import { ChevronLeft, ChevronRight, Download, Edit2, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const initialProjectsData = [
  {
    id: '1',
    code: 'PRJ001',
    name: 'Website Redesign',
    members: 'Sara, Eunike',
    startDate: '2025-01-10',
    deadline: '2025-03-15',
    client: 'Acme Corp',
    status: 'Ongoing',
  },
  {
    id: '2',
    code: 'PRJ002',
    name: 'Mobile App Dev',
    members: 'Jane, John',
    startDate: '2025-02-01',
    deadline: '2025-06-01',
    client: 'Beta Ltd',
    status: 'Completed',
  },
  {
    id: '3',
    code: 'PRJ003',
    name: 'Marketing Campaign',
    members: 'Nadine, Naomi',
    startDate: '2025-03-20',
    deadline: '2025-05-30',
    client: 'Gamma Inc',
    status: 'Ongoing',
  },
  {
    id: '4',
    code: 'PRJ004',
    name: 'E-Commerce Setup',
    members: 'Sasha, Nabila',
    startDate: '2025-04-10',
    deadline: '2025-07-20',
    client: 'Delta Co',
    status: 'Pending',
  },
  {
    id: '5',
    code: 'PRJ005',
    name: 'Data Analysis Tool',
    members: 'Isaac, Jane',
    startDate: '2025-05-01',
    deadline: '2025-08-15',
    client: 'Omega LLC',
    status: 'Completed',
  },
];

const PROJECT_STATUSES = ['Pending', 'Ongoing', 'Completed', 'On Hold', 'Cancelled'];
// Clients can be dynamic based on data or a predefined list
// For this example, we'll derive them dynamically and also have a base list
const INITIAL_CLIENTS = ['Acme Corp', 'Beta Ltd', 'Gamma Inc', 'Delta Co', 'Omega LLC', 'New Client Inc'];


const ProjectsPage = () => {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projectsData');
    return savedProjects ? JSON.parse(savedProjects) : initialProjectsData.map(project => ({...project, id: project.id || crypto.randomUUID()}));
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    members: '',
    startDate: '',
    deadline: '',
    client: INITIAL_CLIENTS[0] || '',
    status: PROJECT_STATUSES[0],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    localStorage.setItem('projectsData', JSON.stringify(projects));
  }, [projects]);

  const availableClients = useMemo(() => {
    const clientsFromData = projects.map(p => p.client);
    return [...new Set([...INITIAL_CLIENTS, ...clientsFromData])].sort();
  }, [projects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetFormData = () => {
    setFormData({
      code: '', name: '', members: '', startDate: '', deadline: '',
      client: availableClients[0] || '', status: PROJECT_STATUSES[0],
    });
  };

  const openModalForCreate = () => {
    setEditingProject(null);
    resetFormData();
    const nextProjectNumber = projects.length + 1;
    setFormData(prev => ({...prev, code: `PRJ${String(nextProjectNumber).padStart(3, '0')}`}));
    setShowModal(true);
  };

  const openModalForEdit = (project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...formData } : p));
    } else {
      setProjects([{ ...formData, id: crypto.randomUUID() }, ...projects]);
    }
    setShowModal(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const searchMatch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.members.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = statusFilter === 'All' || project.status === statusFilter;
      const clientMatch = clientFilter === 'All' || project.client === clientFilter;
      return searchMatch && statusMatch && clientMatch;
    });
  }, [projects, searchQuery, statusFilter, clientFilter]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleExport = () => {
    console.log("Exporting projects:", filteredProjects);
    alert("Check console for exported data (implement actual export logic).");
  };

  const tableHeaders = ['Code', 'Project Name', 'Members', 'Start Date', 'Deadline', 'Client', 'Status', 'Action'];

  return (
    <div className="px-4 sm:px-8 py-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="relative">
            <label htmlFor="searchProject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Projects</label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-0.5 w-5 h-5 text-gray-400 dark:text-gray-500 mt-2" />
            <input
              type="text"
              id="searchProject"
              placeholder="Search by name, code, client, members..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div>
            <label htmlFor="projectStatusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              id="projectStatusFilter"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Statuses</option>
              {PROJECT_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="clientFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
            <select
              id="clientFilter"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={clientFilter}
              onChange={(e) => { setClientFilter(e.target.value); setCurrentPage(1);}}
            >
              <option value="All">All Clients</option>
              {availableClients.map(client => <option key={client} value={client}>{client}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <div className="flex flex-col sm:flex-row justify-start items-center mb-3 space-y-2 sm:space-y-0 sm:space-x-3">
          <button onClick={openModalForCreate} className="flex items-center space-x-1 bg-blue-800 dark:bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors shadow-sm">
            <Plus className="mr-2" /> Add Project
          </button>
          <button onClick={handleExport} className="flex items-center space-x-1 bg-green-800 dark:bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 dark:hover:bg-green-700 transition-colors shadow-sm">
            <Download className="mr-2" /> Export
          </button>
        </div>

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
            {paginatedProjects.length > 0 ? paginatedProjects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{project.code}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 min-w-[200px]">{project.name}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 min-w-[150px]">{project.members}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{project.startDate}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{project.deadline}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">{project.client}</td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                       project.status === 'Completed' ? 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100' :
                         project.status === 'Ongoing' ? 'bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100' :
                           project.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100' :
                             project.status === 'On Hold' ? 'bg-orange-100 dark:bg-orange-700 text-orange-800 dark:text-orange-100' :
                               'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100' // Cancelled or other
                     }`}>
                        {project.status}
                      </span>
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => openModalForEdit(project)} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 p-1" title="Edit Project"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1" title="Delete Project"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No projects found.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {filteredProjects.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm">
            <div className="mb-2 sm:mb-0 text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} entries
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded text-gray-600 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft size={16} className="mr-1"/> Previous
              </button>
              <span className="px-2 text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border rounded text-gray-600 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next <ChevronRight size={16} className="ml-1"/>
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label htmlFor="projectCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                  <input type="text" name="code" id="projectCode" value={formData.code} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" />
                </div>
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                  <input type="text" name="name" id="projectName" value={formData.name} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" />
                </div>
                <div>
                  <label htmlFor="projectMembers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Members (comma-separated)</label>
                  <input type="text" name="members" id="projectMembers" value={formData.members} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" />
                </div>
                <div>
                  <label htmlFor="projectClient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
                  <select
                    name="client"
                    id="projectClient"
                    value={formData.client}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="" disabled>Select a client</option>
                    {availableClients.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select name="status" id="projectStatus" value={formData.status} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100">
                    {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="projectStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input type="date" name="startDate" id="projectStartDate" value={formData.startDate} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" />
                </div>
                <div>
                  <label htmlFor="projectDeadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                  <input type="date" name="deadline" id="projectDeadline" value={formData.deadline} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100" />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white">
                  {editingProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
