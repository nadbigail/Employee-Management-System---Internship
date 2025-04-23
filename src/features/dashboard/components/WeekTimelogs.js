import { useState } from "react";

const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeekTimelogs = ({ weekTimeLogs }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = fullDays[selectedDayIndex];
  const log = weekTimeLogs.find((entry) => entry.day === selectedDay);

  const [h, m] = log?.duration?.split(/[hm ]/).filter(Boolean).map(Number) || [0, 0];
  const totalMinutes = h * 60 + m;
  const percent = Math.min((totalMinutes / 480) * 100, 100); // 8 hours = 480 minutes

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Week Timelogs</h2>

      {/* Day selectors */}
      <div className="flex justify-start space-x-2 mb-4">
        {daysOfWeek.map((shortDay, idx) => (
          <button
            key={shortDay}
            onClick={() => setSelectedDayIndex(idx)}
            className={`w-9 h-9 rounded-full text-sm font-medium border ${
              idx === selectedDayIndex
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {shortDay}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
        <div
          className="bg-gray-900 h-4 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      {/* Duration & Break Info */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>Duration: {log?.duration || '0m'}</span>
        <span>Break: {log?.break || '0m'}</span> {/* Ensure you have a break property in your logs if you want to display it */}
      </div>
    </div>
  );
};

export default WeekTimelogs;