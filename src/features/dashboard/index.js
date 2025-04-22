
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';


const statsData = [
  {
    title: "Task",
    pending: 0,
    overdue: 0,
    icon: (
      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    )
  },
  {
    title: "Projects",
    pending: 0,
    overdue: 0,
    icon: (
      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    )
  }
];

function Dashboard(){

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
        // Dashboard range changed, write code to refresh your values
        const periodMessage = `Period updated to ${new Date(newRange.startDate).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })} to ${new Date(newRange.endDate).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })}`;
        dispatch(showNotification({ message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status: 1 }));
    }

    return(
        <>
      
        <div className="bg-gray-100 px-6 py-3 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-700 text-[20px]">Welcome, Jane Doe</div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-sm text-gray-500">
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
  
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  
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
    isClockedIn ? 'bg-red-600' : 'bg-gray-800'
  } text-white text-[16px] px-4 py-2 rounded-lg flex items-center gap-1`}
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
  {isClockedIn ? 'Clock Out' : 'Clock In'}
</button>

          </div>
        </div>

                
                {/** ---------------------- Different stats content 1 ------------------------- */}
        <div className="grid lg:grid-cols-2 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
  {statsData.map((d, k) => (
    <div key={k} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        <div className="font-semibold text-gray-700 text-xl">{d.title}</div>
        <div className="flex gap-6 mt-3">
          <div className="text-blue-500 font-bold text-3xl">
            0 <span className="text-black font-medium text-lg">Pending</span>
          </div>
          <div className="text-red-500 font-bold text-3xl">
            0 <span className="text-black font-medium text-lg">Overdue</span>
          </div>
        </div>
      </div>
      <div>{d.icon}</div>
    </div>
  ))}
</div>



{/** ---------------------- Week Timelogs Section ------------------------- */}
<div className="grid lg:grid-cols-1 mt-6 md:grid-cols-2 grid-cols-1 gap-6">
  <div className="bg-white rounded-xl shadow p-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">Week Timelogs</h2>

    <div className="flex items-center gap-3 mb-4">
      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
        <div
          key={index}
          className="w-10 h-10 flex items-center justify-center rounded-full border text-sm font-semibold text-gray-600"
        >
          {day}
        </div>
      ))}
    </div>

    <div className="bg-gray-300 h-5 rounded mb-2"></div>

    <div className="flex justify-between text-sm text-gray-500 mt-1">
      <span>Duration : 0m</span>
      <span>Break : 0m</span>
    </div>
  </div>
</div>



        {/** ---------------------- Birthdays and My Task ------------------------- */}
<div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">

{/* Birthdays */}
<div className="bg-white rounded-xl shadow p-4">
  <div className="border-b pb-2 mb-4">
    <h2 className="text-lg font-semibold text-gray-700">Birthdays</h2>
  </div>
  <div className="flex flex-col items-center justify-center text-gray-400 py-8">
    <i className="fa-solid fa-cake-candles text-3xl mb-2"></i>
    <span className="text-sm italic">– No record found. –</span>
  </div>
</div>

{/* My Task */}
<div className="bg-white rounded-xl shadow p-4">
  <div className="border-b pb-2 mb-4">
    <h2 className="text-lg font-semibold text-gray-700">My Task</h2>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-gray-500">
      <thead className="text-left text-gray-500 border-b">
        <tr>
          <th className="py-2 px-2">#</th>
          <th className="py-2 px-2">Task</th>
          <th className="py-2 px-2">Status</th>
          <th className="py-2 px-2">Due Date</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td colSpan="4" className="py-6 text-gray-400">
            <div className="flex justify-center mb-2 text-2xl">
              <i className="fa-solid fa-list-check"></i>
            </div>
            <span className="italic text-sm">– No record found. –</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

</div>

        {/** ---------------------- Employee Appreciations and Tickets  ------------------------- */}
<div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">

{/* Employee Appreciations */}
<div className="bg-white rounded-xl shadow p-4">
  <div className="border-b pb-2 mb-4">
    <h2 className="text-lg font-semibold text-gray-700">Employee Appreciations</h2>
  </div>
  <div className="flex flex-col items-center justify-center text-gray-400 py-8">
    <i className="fa-solid fa-cake-candles text-3xl mb-2"></i>
    <span className="text-sm italic">– No record found. –</span>
  </div>
</div>

{/* Tickets */}
<div className="bg-white rounded-xl shadow p-4">
  <div className="border-b pb-2 mb-4">
    <h2 className="text-lg font-semibold text-gray-700">Tickets</h2>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-gray-500">
      <thead className="text-left text-gray-500 border-b">
        <tr>
          <th className="py-2 px-2">#</th>
          <th className="py-2 px-2">Task</th>
          <th className="py-2 px-2">Status</th>
          <th className="py-2 px-2">Due Date</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td colSpan="4" className="py-6 text-gray-400">
            <div className="flex justify-center mb-2 text-2xl">
              <i className="fa-solid fa-list-check"></i>
            </div>
            <span className="italic text-sm">– No record found. –</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

</div>

{/** ---------------------- On Leave, WFH, and Calendar ------------------------- */}
<div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
  {/* Left column: On Leave + On WFH */}
  <div className="flex flex-col gap-6 h-[480px]">
    {/* On Leave Today */}
    <div className="bg-white rounded-xl shadow p-4 border-2 flex-1">
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-700">On Leave Today</h2>
      </div>
      <div className="flex flex-col items-center justify-center text-gray-400 py-8 h-full">
        <i className="fa-solid fa-plane-departure text-3xl mb-2"></i>
        <span className="text-sm italic">– No record found. –</span>
      </div>
    </div>

    {/* On Work From Home Today */}
    <div className="bg-white rounded-xl shadow p-4 flex-1">
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-700">On Work From Home Today</h2>
      </div>
      <div className="flex flex-col items-center justify-center text-gray-400 py-8 h-full">
        <i className="fa-solid fa-house-laptop text-3xl mb-2"></i>
        <span className="text-sm italic">– No record found. –</span>
      </div>
    </div>
  </div>

  {/* My Calendar */}
<div className="bg-white rounded-xl shadow p-4">
  <div className="border-b pb-2 mb-4">
    <h2 className="text-lg font-semibold text-gray-700">My Calendar</h2>
  </div>
  <div className="text-sm text-gray-700">
    <div className="flex justify-between items-center mb-4">
      <div className="space-x-2">
        <span className="text-gray-500 cursor-pointer">month</span>
        <span className="text-gray-400 cursor-pointer">week</span>
        <span className="text-gray-400 cursor-pointer">day</span>
        <span className="text-gray-400 cursor-pointer">list</span>
      </div>
      <div className="font-semibold">September 2022</div>
      <div className="space-x-2">
        <button className="text-gray-400">&lt;</button>
        <button className="text-gray-400">&gt;</button>
      </div>
    </div>

    <table className="w-full table-fixed text-center text-sm text-gray-800 border-collapse">
      <thead>
        <tr className="text-gray-500">
          <th className="py-2 w-[14.28%]">SUN</th>
          <th className="py-2 w-[14.28%]">MON</th>
          <th className="py-2 w-[14.28%]">TUE</th>
          <th className="py-2 w-[14.28%]">WED</th>
          <th className="py-2 w-[14.28%]">THU</th>
          <th className="py-2 w-[14.28%]">FRI</th>
          <th className="py-2 w-[14.28%]">SAT</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["", "", "", "", 1, 2, 3],
          [4, 5, 6, 7, 8, 9, 10],
          [11, 12, 13, 14, 15, 16, 17],
          [18, 19, 20, 21, 22, 23, 24],
          [25, 26, 27, 28, 29, 30, ""],
        ].map((week, i) => (
          <tr key={i}>
            {week.map((day, j) => (
              <td
                key={j}
                className="h-16 align-top relative group border-t"
              >
                {day && (
                  <>
                    <div className="text-sm">{day}</div>
                    {/* Red dot on certain days */}
                    {(day === 7 || day === 9 || day === 15 || day === 27) && (
                      <span className="block w-2 h-2 bg-red-500 rounded-full mx-auto mt-1"></span>
                    )}
                    {/* Tooltip on 27 */}
                    {day === 27 && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-8 bg-yellow-300 text-black text-xs px-2 py-1 rounded shadow hidden group-hover:block z-10">
                        Monthly Meeting
                      </div>
                    )}
                  </>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
</div>



        {/** ---------------------- Notice  ------------------------- */}
        
           {/* Notice */}
<div className="bg-white rounded-xl shadow p-4 mt-6">
  <div className="border-b pb-2 mb-4">
    <h2 className="text-lg font-semibold text-gray-700">Notice</h2>
  </div>
  <div className="flex items-center justify-center text-gray-400 py-10">
    <span className="text-sm italic">– No record found. –</span>
  </div>
</div>

        </>
    )
}

export default Dashboard