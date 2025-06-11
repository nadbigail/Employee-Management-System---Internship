import React, {useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {openModal} from '../../common/modalSlice';
import {MODAL_BODY_TYPES} from '../../../utils/globalConstantUtil';
import {
  Plus,
  ChevronDown,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Coffee,
  Sun,
  User,
  List,
  Calendar
} from 'lucide-react';

const darkClass = (lightClass, darkVariant) => `${lightClass} ${darkVariant}`;

const employees = [
  {id: 1, name: 'Nadine Abigail', isYou: true},
  {id: 2, name: 'John Doe', isYou: false},
  {id: 3, name: 'Sara Nadya', isYou: false},
];

const initialAttendanceData = {
  1: {
    '2025-06-01': 'Absent', '2025-06-02': 'Absent', '2025-06-03': 'Absent',
    '2025-06-04': 'Absent', '2025-06-05': 'Absent', '2025-06-06': 'Absent',
    '2025-06-08': 'Holiday', '2025-06-09': 'Present', '2025-06-10': 'Present',
    '2025-06-11': 'Late', '2025-06-12': 'Present', '2025-06-13': 'Present',
    '2025-06-15': 'Day Off', '2025-06-16': 'Present', '2025-06-17': 'Present',
    '2025-06-18': 'Half Day', '2025-06-19': 'Present', '2025-06-20': 'On Leave',
    '2025-06-21': 'On Leave', '2025-06-22': 'On Leave',
  },
  2: {'2025-06-01': 'Present', '2025-06-02': 'Present'},
  3: {'2025-06-01': 'Late', '2025-06-02': 'Present'},
};

const attendanceTypes = [
  {name: 'Holiday', icon: <Star size={14} className="text-yellow-500"/>},
  {name: 'Day Off', icon: <ArrowRight size={14} className="text-gray-500"/>},
  {name: 'Present', icon: <CheckCircle2 size={14} className="text-green-500"/>},
  {name: 'Half Day', icon: <AlertTriangle size={14} className="text-orange-500"/>},
  {name: 'Late', icon: <Clock size={14} className="text-red-500"/>},
  {name: 'Absent', icon: <XCircle size={14} className="text-red-700"/>},
  {name: 'On Leave', icon: <Coffee size={14} className="text-purple-500"/>},
];

export default function AttendanceDashboard() {
  const {role} = useSelector(state => state.user)
  const dispatch = useDispatch();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);
  const [viewMode, setViewMode] = useState('grid');

  const calendarInfo = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days = [];
    let presentCount = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedYear, selectedMonth, i);
      const dateString = date.toISOString().split('T')[0];
      const status = attendanceData[selectedEmployeeId]?.[dateString];
      if (status === 'Present' || status === 'Half Day') {
        presentCount++;
      }
      days.push({
        dayNum: i,
        dayName: date.toLocaleDateString('en-US', {weekday: 'short'}),
        status: status || null,
      });
    }
    return {days, presentCount, totalDays: daysInMonth};
  }, [selectedEmployeeId, selectedMonth, selectedYear, attendanceData]);

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  const openAddDataModal = () => {
    dispatch(openModal({
      title: 'Add Attendance',
      bodyType: MODAL_BODY_TYPES.ATTENDANCE_ADD_NEW,
      extraObject: {
        employees,
        attendanceTypes,
        setAttendanceData,
        selectedEmployeeId
      }
    }))
  };

  const StatusIcon = ({status}) => {
    if (!status) return <span className="text-gray-400">-</span>;
    const type = attendanceTypes.find(t => t.name === status);
    if (!type) return <span className="text-gray-400">-</span>;
    return type.icon;
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div
      className={darkClass("px-4 sm:px-8 py-6 bg-gray-100 min-h-screen", "dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans")}>
      <div
        className={darkClass("flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-6", "dark:bg-gray-800")}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Employee</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
              className={darkClass("border rounded-md px-3 py-1.5 text-sm", "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 dark:border-gray-600")}
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}{emp.isYou ? ' (You)' : ''}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className={darkClass("border rounded-md px-3 py-1.5 text-sm", "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 dark:border-gray-600")}
            >
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={darkClass("border rounded-md px-3 py-1.5 text-sm", "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 dark:border-gray-600")}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {role === 'admin' &&
            <button onClick={openAddDataModal}
                    className="flex items-center space-x-1.5 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm">
              <Plus className="w-4 h-4"/>
              <span>Add Data</span>
            </button>
          }
          <div className={darkClass("p-1 bg-gray-200 rounded-md flex items-center", "dark:bg-gray-700")}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? darkClass('bg-white shadow-sm', 'dark:bg-gray-800') : ''}`}
            >
              <Calendar size={18}/>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? darkClass('bg-white shadow-sm', 'dark:bg-gray-800') : ''}`}
            >
              <List size={18}/>
            </button>
          </div>
        </div>
      </div>

      <div className={darkClass("bg-white rounded-lg shadow-sm p-4", "dark:bg-gray-800")}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 pb-4 border-b dark:border-gray-700">
          <span className="font-semibold text-sm">Notes:</span>
          {attendanceTypes.map(type => (
            <div key={type.name} className="flex items-center gap-1.5 text-sm">
              {type.icon}
              <span>{type.name}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block">
            <div className="grid items-center text-sm"
                 style={{gridTemplateColumns: `180px repeat(${calendarInfo.totalDays}, minmax(40px, 1fr)) 80px`}}>
              <div className="font-semibold px-2 py-2 sticky left-0 z-10 bg-white dark:bg-gray-800">Employee</div>
              {calendarInfo.days.map(day => (
                <div key={day.dayNum} className="text-center font-medium">
                  <div>{day.dayNum}</div>
                  <div className="text-xs text-gray-500">{day.dayName}</div>
                </div>
              ))}
              <div className="font-semibold px-2 py-2 text-right sticky right-0 z-10 bg-white dark:bg-gray-800">Total
              </div>

              <div className={darkClass("col-span-full h-px bg-gray-200 my-1", "dark:bg-gray-700")}></div>

              <div className="px-2 py-3 flex items-center gap-3 sticky left-0 z-10 bg-white dark:bg-gray-800">
                <div
                  className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center font-bold text-sm">
                  {selectedEmployee?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium">{selectedEmployee?.name}</div>
                  {selectedEmployee?.isYou &&
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">You</span>}
                </div>
              </div>

              {calendarInfo.days.map(day => (
                <div key={day.dayNum} className="text-center py-3 flex justify-center items-center">
                  <StatusIcon status={day.status}/>
                </div>
              ))}

              <div className="px-2 py-3 text-right font-semibold sticky right-0 z-10 bg-white dark:bg-gray-800">
                {calendarInfo.presentCount}/{calendarInfo.totalDays}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}