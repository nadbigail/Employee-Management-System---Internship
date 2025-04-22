// components/WeekTimelogs.jsx
import { useEffect, useState } from 'react';

const dayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getDayIndex(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export default function WeekTimelogs() {
  const [clockInTime, setClockInTime] = useState(null);
  const [timelogs, setTimelogs] = useState(Array(7).fill({ duration: 0, break: 0 }));

  useEffect(() => {
    const saved = localStorage.getItem('timelogs-week');
    if (saved) {
      setTimelogs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timelogs-week', JSON.stringify(timelogs));
  }, [timelogs]);

  const handleClockIn = () => {
    setClockInTime(new Date());
  };

  const handleClockOut = () => {
    if (!clockInTime) return;

    const clockOut = new Date();
    const diffMinutes = Math.round((clockOut - clockInTime) / 60000);
    const breakMinutes = 30;
    const workMinutes = Math.max(0, diffMinutes - breakMinutes);

    const index = getDayIndex(getTodayKey());
    const updated = [...timelogs];
    updated[index] = {
      duration: (updated[index]?.duration || 0) + workMinutes,
      break: (updated[index]?.break || 0) + breakMinutes,
    };

    setTimelogs(updated);
    setClockInTime(null);
  };

  const totalDuration = timelogs.reduce((acc, day) => acc + (day.duration || 0), 0);
  const totalBreak = timelogs.reduce((acc, day) => acc + (day.break || 0), 0);

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Week Timelogs</h2>

      <div className="flex gap-4 mb-4">
        {dayLabels.map((label, i) => (
          <div key={i} className="w-10 h-10 flex items-center justify-center border rounded-full text-sm text-gray-700">
            {label}
          </div>
        ))}
      </div>

      <div className="h-4 bg-gray-300 rounded mb-2">
        <div
          className="h-4 bg-blue-600 rounded"
          style={{ width: `${(totalDuration / (7 * 480)) * 100}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-6">
        <span>Duration : {totalDuration}m</span>
        <span>Break : {totalBreak}m</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleClockIn}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
          disabled={!!clockInTime}
        >
          Clock In
        </button>
        <button
          onClick={handleClockOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
          disabled={!clockInTime}
        >
          Clock Out
        </button>
      </div>
    </div>
  );
}
