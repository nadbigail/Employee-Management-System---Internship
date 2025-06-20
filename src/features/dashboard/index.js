import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { showNotification } from '../common/headerSlice';
import Calendar from "./components/Calendar";
import WeekTimeLogs from './components/WeekTimelogs';

const statsData = [
  {
    title: "Task",
    pending: 4,
    overdue: 1,
    icon: (
      <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"
           viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16"/>
      </svg>
    )
  },
  {
    title: "Projects",
    pending: 3,
    overdue: 0,
    icon: (
      <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"
           viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18"/>
      </svg>
    )
  }
];

function Dashboard() {
  const name = localStorage.getItem('name');
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [durationWorked, setDurationWorked] = useState(null);
  const [weekTimeLogs, setWeekTimeLogs] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateDashboardPeriod = (newRange) => {
    dispatch(showNotification({message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status: 1}));
  }

  return (
    <div className="text-gray-800 dark:text-gray-100">

      {/* Top Bar */}
      <div className="bg-gray-100 dark:bg-slate-800 px-6 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-gray-700 dark:text-gray-200 text-[20px]">Welcome, {name}</div>

        <div className="flex items-center gap-4 mt-3 sm:mt-0">
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {currentTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currentTime.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
          <button
            onClick={() => {
              if (!isClockedIn) {
                setClockInTime(new Date());
                setIsClockedIn(true);
                setDurationWorked(null);
              } else {
                const now = new Date();
                const diffMs = now - clockInTime;
                const totalMinutes = Math.floor(diffMs / 60000);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                const durationStr = `${hours}h ${minutes}m`;
                setDurationWorked(durationStr);
                setIsClockedIn(false);

                const day = now.toLocaleDateString('en-US', {weekday: 'long'});

                setWeekTimeLogs(prevLogs => [
                  ...prevLogs,
                  {
                    day,
                    date: now.toLocaleDateString(),
                    duration: durationStr,
                  },
                ]);
              }
            }}
            className={`${
              isClockedIn
                ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
                : 'bg-gray-800 hover:bg-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600'
            } text-white text-[16px] px-4 py-2 rounded-lg flex items-center gap-1 transition-colors duration-150`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>
        </div>
      </div>

      {/* Main content padding */}
      <div className="p-6">
        {/** ---------------------- Different stats content 1 ------------------------- */}
        <div className="grid lg:grid-cols-2 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
          {statsData.map((d, k) => (
            <div key={k} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-700 dark:text-gray-200 text-xl">{d.title}</div>
                <div className="flex gap-6 mt-3">
                  <div className="text-blue-500 dark:text-blue-400 font-bold text-3xl">
                    {d.pending} <span className="text-black dark:text-gray-300 font-medium text-lg">Pending</span>
                  </div>
                  <div className="text-red-500 dark:text-red-400 font-bold text-3xl">
                    {d.overdue} <span className="text-black dark:text-gray-300 font-medium text-lg">Overdue</span>
                  </div>
                </div>
              </div>
              <div>{d.icon}</div>
            </div>
          ))}
        </div>

        {/** ---------------------- Week Timelogs Section ------------------------- */}
        <div className="grid lg:grid-cols-1 mt-6 md:grid-cols-2 grid-cols-1 gap-6">
          <WeekTimeLogs weekTimeLogs={weekTimeLogs}/> {/* Pastikan komponen ini support dark mode */}
        </div>

        {/** ---------------------- Birthdays and My Task ------------------------- */}
        <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
          {/* Birthdays */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="border-b dark:border-gray-700 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Birthdays</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <tr>
                  <th scope="col" className="py-3 px-4">#</th>
                  <th scope="col" className="py-3 px-4">Name</th>
                  <th scope="col" className="py-3 px-4">Date</th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4">Nadine Abigail</td>
                  <td className="py-3 px-4">May 3rd</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4">Eunike Alfrita Maharani</td>
                  <td className="py-3 px-4">May 14th</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">Sara Nadya Maharani</td>
                  <td className="py-3 px-4">May 25th</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* My Task */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="border-b dark:border-gray-700 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">My Task</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <tr>
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Task</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Due Date</th>
                </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="py-2 px-2">1</td>
                  <td className="py-2 px-2">Submit weekly report</td>
                  <td className="py-2 px-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Pending</span>
                  </td>
                  <td className="py-2 px-2">May 14th, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">2</td>
                  <td className="py-2 px-2">Client presentation prep</td>
                  <td className="py-2 px-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Pending</span>
                  </td>
                  <td className="py-2 px-2">May 15th, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">3</td>
                  <td className="py-2 px-2">Team meeting notes</td>
                  <td className="py-2 px-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Pending</span>
                  </td>
                  <td className="py-2 px-2">May 16th, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">4</td>
                  <td className="py-2 px-2">Code review for Project X</td>
                  <td className="py-2 px-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Pending</span>
                  </td>
                  <td className="py-2 px-2">May 17th, 2025</td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-900/30"> {/* Adjusted dark bg for overdue row */}
                  <td className="py-2 px-2">5</td>
                  <td className="py-2 px-2">Update client feedback</td>
                  <td className="py-2 px-2">
                    <span className="text-red-600 dark:text-red-400 font-semibold">Overdue</span>
                  </td>
                  <td className="py-2 px-2">May 10th, 2025</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/** ---------------------- Employee Appreciations and Tickets  ------------------------- */}
        <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
          {/* Employee Appreciations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="border-b dark:border-gray-700 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Employee Appreciations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                <tr>
                  <th scope="col" className="py-3 px-4">#</th>
                  <th scope="col" className="py-3 px-4">Name</th>
                  <th scope="col" className="py-3 px-4">Department</th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4">Kevin Hartanto</td>
                  <td className="py-3 px-4">Finance</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4">Felicia Anggraini</td>
                  <td className="py-3 px-4">HR</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">Rafi Dirgantara</td>
                  <td className="py-3 px-4">Operations</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tickets */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="border-b dark:border-gray-700 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Projects</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-600 dark:text-gray-300">
                <thead
                  className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700 text-xs uppercase">
                <tr>
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Projects</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Due Date</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td className="py-2 px-2">1</td>
                  <td className="py-2 px-2">Update employee handbook</td>
                  <td className="py-2 px-2 text-yellow-600 dark:text-yellow-400 font-medium">Pending</td>
                  <td className="py-2 px-2">May 15th, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">2</td>
                  <td className="py-2 px-2">Prepare Q2 payroll summary</td>
                  <td className="py-2 px-2 text-yellow-600 dark:text-yellow-400 font-medium">Pending</td>
                  <td className="py-2 px-2">May 20th, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">3</td>
                  <td className="py-2 px-2">Conduct team building survey</td>
                  <td className="py-2 px-2 text-yellow-600 dark:text-yellow-400 font-medium">Pending</td>
                  <td className="py-2 px-2">May 16th, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 px-2">4</td>
                  <td className="py-2 px-2">Submit audit documents</td>
                  <td className="py-2 px-2 text-yellow-600 dark:text-yellow-400 font-medium">Pending</td>
                  <td className="py-2 px-2">May 18th, 2025</td>
                </tr>
                <tr className="bg-red-50 dark:bg-red-900/30">
                  <td className="py-2 px-2">5</td>
                  <td className="py-2 px-2">Fix system access issue</td>
                  <td className="py-2 px-2 text-red-600 dark:text-red-400 font-semibold">Overdue</td>
                  <td className="py-2 px-2">May 10th, 2025</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/** ---------------------- On Leave, WFH, and Calendar ------------------------- */}
        <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
          {/* Left column: On Leave + On WFH */}
          <div className="flex flex-col gap-6 h-[585px]">
            {/* On Leave Today */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border-2 dark:border-gray-700 flex-1">
              <div className="border-b dark:border-gray-700 pb-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">On Leave Today</h2>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-circle text-red-400 dark:text-red-500 text-xs"></i>
                  <span className="font-medium">Christopher Angkasa</span> – Personal Leave
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-circle text-red-400 dark:text-red-500 text-xs"></i>
                  <span className="font-medium">Raisa Luthfi</span> – Sick Leave
                </li>
              </ul>
            </div>

            {/* On Work From Home Today */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex-1">
              <div className="border-b dark:border-gray-700 pb-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">On Work From Home Today</h2>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-circle text-green-400 dark:text-green-500 text-xs"></i>
                  <span className="font-medium">Michael Santoso</span> – Remote project work
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-circle text-green-400 dark:text-green-500 text-xs"></i>
                  <span className="font-medium">Ayu Kartika</span> – WFH (childcare)
                </li>
              </ul>
            </div>
          </div>

          {/* My Calendar */}
          <div
            className="h-[585px] overflow-hidden rounded-xl shadow-xl">
            <Calendar/>
          </div>
        </div>

        {/** ---------------------- Notice ------------------------- */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mt-6">
          <div className="border-b dark:border-gray-700 pb-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Events</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <tr>
                <th className="py-2 px-2 text-left">#</th>
                <th className="py-2 px-2 text-left">Title</th>
                <th className="py-2 px-2 text-left">Date</th>
                <th className="py-2 px-2 text-left">Status</th>
              </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
              <tr className="text-left">
                <td className="py-3 px-2">1</td>
                <td className="py-3 px-2">Team Meeting Scheduled</td>
                <td className="py-3 px-2">May 13, 2025</td>
                <td className="py-3 px-2 text-green-500 dark:text-green-400">Active</td>
              </tr>
              <tr className="text-left">
                <td className="py-3 px-2">2</td>
                <td className="py-3 px-2">Company Event: Year End Party</td>
                <td className="py-3 px-2">May 18, 2025</td>
                <td className="py-3 px-2 text-blue-500 dark:text-blue-400">Upcoming</td>
              </tr>
              <tr className="text-left">
                <td className="py-3 px-2">3</td>
                <td className="py-3 px-2">Office Renovation Updates</td>
                <td className="py-3 px-2">May 20, 2025</td>
                <td className="py-3 px-2 text-yellow-500 dark:text-yellow-400">Pending</td>
              </tr>
              <tr className="text-left">
                <td className="py-3 px-2">4</td>
                <td className="py-3 px-2">Holiday Notice</td>
                <td className="py-3 px-2">May 22, 2025</td>
                <td className="py-3 px-2 text-gray-500 dark:text-gray-400">Archived</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;