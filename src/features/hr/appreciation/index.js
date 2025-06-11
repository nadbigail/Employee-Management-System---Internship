import React, { useState } from 'react';
import { ChevronDown, Award, Star, TrendingUp, Zap } from 'lucide-react';

const darkClass = (lightClass, darkVariant) => `${lightClass} ${darkVariant}`;

const diligentEmployeesData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'SJ',
    department: 'Engineering',
    score: 98.5,
    color: 'bg-green-500'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'MC',
    department: 'Product',
    score: 97.2,
    color: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Linda Garcia',
    avatar: 'LG',
    department: 'Marketing',
    score: 96.8,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    avatar: 'DR',
    department: 'Sales',
    score: 95.1,
    color: 'bg-indigo-500'
  },
  {
    id: 5,
    name: 'Emily White',
    avatar: 'EW',
    department: 'Human Resources',
    score: 94.5,
    color: 'bg-pink-500'
  },
];

const projectLeadersData = [
  {
    id: 1,
    name: 'Alex Martinez',
    avatar: 'AM',
    department: 'Engineering',
    projects: 12,
    color: 'bg-red-500'
  },
  {
    id: 2,
    name: 'Jessica Lee',
    avatar: 'JL',
    department: 'Engineering',
    projects: 10,
    color: 'bg-yellow-500'
  },
  {
    id: 3,
    name: 'Robert Brown',
    avatar: 'RB',
    department: 'Product',
    projects: 9,
    color: 'bg-teal-500'
  },
  {
    id: 4,
    name: 'Maria Hernandez',
    avatar: 'MH',
    department: 'Design',
    projects: 8,
    color: 'bg-orange-500'
  },
  {
    id: 5,
    name: 'Kevin Wilson',
    avatar: 'KW',
    department: 'Sales',
    projects: 7,
    color: 'bg-cyan-500'
  },
];


export default function AppreciationDashboard() {
  const [timeRange, setTimeRange] = useState('This Quarter');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Award className="w-5 h-5 text-yellow-500"/>;
      case 2:
        return <Award className="w-5 h-5 text-gray-400"/>;
      case 3:
        return <Award className="w-5 h-5 text-yellow-700"/>;
      default:
        return <span className="text-sm font-semibold">{rank}</span>;
    }
  };


  return (
    <div className={darkClass("px-4 sm:px-8 py-6 bg-gray-100 min-h-screen", "dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans")}>
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Appreciation Board</h1>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={darkClass("border rounded-md px-4 py-2 text-sm w-48 text-left flex items-center justify-between", "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700")}
          >
            <span>{timeRange}</span>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
          </button>
          {dropdownOpen && (
            <div className={darkClass("absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border", "dark:bg-gray-800 dark:border-gray-600")}>
              {['This Week', 'This Month', 'This Quarter', 'All Time'].map(option => (
                <div key={option} onClick={() => {
                  setTimeRange(option);
                  setDropdownOpen(false);
                }} className={darkClass("px-4 py-2 cursor-pointer text-sm hover:bg-gray-100", "dark:hover:bg-gray-700")}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={darkClass("bg-white rounded-md shadow-sm overflow-hidden", "dark:bg-gray-800")}>
          <div className={darkClass("p-4 border-b", "dark:border-gray-700")}>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500"/>
              Most Diligent Employees
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={darkClass("bg-gray-50", "dark:bg-gray-700")}>
              <tr className={darkClass("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", "dark:text-gray-300")}>
                <th className="p-3 text-center">Rank</th>
                <th className="p-3">Employee</th>
                <th className="p-3">Department</th>
                <th className="p-3 text-right">Attendance Score</th>
              </tr>
              </thead>
              <tbody className={darkClass("divide-y", "divide-gray-200 dark:divide-gray-700")}>
              {diligentEmployeesData.map((employee, index) => (
                <tr key={employee.id} className={darkClass("hover:bg-gray-50", "dark:hover:bg-gray-700/50")}>
                  <td className="p-3 w-16 text-center flex justify-center items-center h-full">
                    {getRankIcon(index + 1)}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${employee.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}>
                        {employee.avatar}
                      </div>
                      <span className={darkClass("font-medium text-gray-900", "dark:text-gray-100")}>{employee.name}</span>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap text-gray-600 dark:text-gray-300">{employee.department}</td>
                  <td className="p-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{employee.score}%</span>
                      <div className={darkClass("w-24 h-2 bg-gray-200 rounded-full overflow-hidden", "dark:bg-gray-600")}>
                        <div className="h-full bg-green-500" style={{width: `${employee.score}%`}}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={darkClass("bg-white rounded-md shadow-sm overflow-hidden", "dark:bg-gray-800")}>
          <div className={darkClass("p-4 border-b", "dark:border-gray-700")}>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500"/>
              Most Projects Completed
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={darkClass("bg-gray-50", "dark:bg-gray-700")}>
              <tr className={darkClass("text-left text-xs font-medium text-gray-500 uppercase tracking-wider", "dark:text-gray-300")}>
                <th className="p-3 text-center">Rank</th>
                <th className="p-3">Employee</th>
                <th className="p-3">Department</th>
                <th className="p-3 text-center">Projects Done</th>
              </tr>
              </thead>
              <tbody className={darkClass("divide-y", "divide-gray-200 dark:divide-gray-700")}>
              {projectLeadersData.map((employee, index) => (
                <tr key={employee.id} className={darkClass("hover:bg-gray-50", "dark:hover:bg-gray-700/50")}>
                  <td className="p-3 w-16 text-center flex justify-center items-center h-full">
                    {getRankIcon(index + 1)}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${employee.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}>
                        {employee.avatar}
                      </div>
                      <span className={darkClass("font-medium text-gray-900", "dark:text-gray-100")}>{employee.name}</span>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap text-gray-600 dark:text-gray-300">{employee.department}</td>
                  <td className="p-3 whitespace-nowrap text-center">
                    <span className={darkClass("px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full", "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100")}>
                      {employee.projects}
                    </span>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}