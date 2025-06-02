import { useState } from "react";

const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeekTimelogs = ({ weekTimeLogs }) => {
  // Default ke Senin jika tidak ada log, atau hari pertama yang ada log
  const initialDayIndex = () => {
    if (weekTimeLogs && weekTimeLogs.length > 0) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayIndex = fullDays.indexOf(today);
      if (todayIndex !== -1 && weekTimeLogs.some(log => log.day === fullDays[todayIndex])) {
        return todayIndex;
      }
      // Jika hari ini tidak ada log, coba cari log pertama yang ada
      for (let i = 0; i < fullDays.length; i++) {
        if (weekTimeLogs.some(log => log.day === fullDays[i])) {
          return i;
        }
      }
    }
    return 0; // Default ke Senin jika tidak ada log sama sekali
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState(initialDayIndex());

  const selectedDay = fullDays[selectedDayIndex];
  // Cari log untuk hari yang dipilih
  const log = weekTimeLogs && weekTimeLogs.find((entry) => entry.day === selectedDay);

  // Kalkulasi persentase durasi
  let percent = 0;
  if (log?.duration) {
    const parts = log.duration.match(/(\d+)h|(\d+)m/g) || [];
    let totalMinutes = 0;
    parts.forEach(part => {
      if (part.includes('h')) {
        totalMinutes += parseInt(part.replace('h', '')) * 60;
      } else if (part.includes('m')) {
        totalMinutes += parseInt(part.replace('m', ''));
      }
    });
    percent = Math.min((totalMinutes / 480) * 100, 100); // 8 jam = 480 menit
  }


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Week Timelogs
      </h2>

      {/* Day selectors */}
      <div className="flex justify-start space-x-2 mb-4">
        {daysOfWeek.map((shortDay, idx) => (
          <button
            key={shortDay}
            onClick={() => setSelectedDayIndex(idx)}
            className={`w-9 h-9 rounded-full text-sm font-medium border transition-colors duration-150
              ${
              idx === selectedDayIndex
                ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 border-gray-800 dark:border-gray-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
            }`}
          >
            {shortDay}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
        <div
          className="bg-gray-800 dark:bg-gray-300 h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      {/* Duration & Break Info */}
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Duration: {log?.duration || '0m'}</span>
        <span>Break: {log?.break || '0m'}</span>
      </div>
    </div>
  );
};

export default WeekTimelogs;