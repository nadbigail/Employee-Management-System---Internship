import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/globalConstantUtil';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Star,
  Coffee,
  ArrowRight,
  MapPin
} from 'lucide-react';
import moment from 'moment';

const darkClass = (lightClass, darkVariant) => `${lightClass} ${darkVariant}`;

const employees = [
  { id: 1, name: 'Nadine Abigail', isYou: true },
  { id: 2, name: 'John Doe', isYou: false },
  { id: 3, name: 'Sara Nadya', isYou: false },
  { id: 4, name: 'Eunike Alfrita Maharani', isYou: false },
];

const initialAttendanceLogs = [
  { id: 1, employeeId: 1, name: 'Nadine Abigail', date: '2025-06-09', clockIn: '09:15', clockOut: '17:30', location: 'Jakarta Office', status: 'Present' },
  { id: 2, employeeId: 1, name: 'Nadine Abigail', date: '2025-06-10', clockIn: '08:45', clockOut: '17:15', location: 'Jakarta Office', status: 'Present' },
  { id: 3, employeeId: 1, name: 'Nadine Abigail', date: '2025-06-11', clockIn: '09:30', clockOut: '13:00', location: 'Jakarta Office', status: 'Half Day' },
  { id: 4, employeeId: 2, name: 'John Doe', date: '2025-06-09', clockIn: '10:15', clockOut: '17:45', location: 'Remote - Home', status: 'Late' },
  { id: 5, employeeId: 2, name: 'John Doe', date: '2025-06-10', clockIn: null, clockOut: null, location: null, status: 'Absent' },
];

const attendanceTypes = [
  { name: 'Present', icon: <CheckCircle2 size={14} className="text-green-500" /> },
  { name: 'Late', icon: <Clock size={14} className="text-red-500" /> },
  { name: 'Half Day', icon: <AlertTriangle size={14} className="text-orange-500" /> },
  { name: 'Absent', icon: <XCircle size={14} className="text-red-700" /> },
  { name: 'On Leave', icon: <Coffee size={14} className="text-purple-500" /> },
  { name: 'Holiday', icon: <Star size={14} className="text-yellow-500" /> },
  { name: 'Day Off', icon: <ArrowRight size={14} className="text-gray-500" /> },
];

const StatusBadge = ({ status }) => {
  const statusClasses = { Present: "text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400", Late: "text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-400", 'Half Day': "text-orange-600 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-400", Absent: "text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-400", 'On Leave': "text-purple-600 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-400" };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || ''}`}>{status}</span>;
};

const calculateWorkHours = (clockIn, clockOut) => {
  if (!clockIn || !clockOut) return '0h';
  const start = moment(clockIn, 'HH:mm'); const end = moment(clockOut, 'HH:mm');
  if (!start.isValid() || !end.isValid() || end.isBefore(start)) return '0h';
  const duration = moment.duration(end.diff(start)); const hours = Math.floor(duration.asHours()); const minutes = duration.minutes();
  return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
};

const AttendanceCard = ({ log, openEditModal, role }) => (
  <div className={darkClass("bg-white rounded-lg shadow-md p-4 mb-4", "dark:bg-gray-800")}>
    <div className="flex justify-between items-start mb-2">
      <div>
        <p className="text-sm font-semibold">{moment(log.date).format("dddd, D MMM YYYY")}</p>
        <p className="text-xs text-gray-500">{log.name}</p>
      </div>
      <StatusBadge status={log.status} />
    </div>
    <div className="border-t dark:border-gray-700 my-2"></div>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="text-center">
        <p className="text-xs text-gray-500">Clock In</p>
        <p className="font-semibold text-green-600 dark:text-green-400">{log.clockIn || '--:--'}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500">Clock Out</p>
        <p className="font-semibold text-red-600 dark:text-red-400">{log.clockOut || '--:--'}</p>
      </div>
      <div className="col-span-2 text-center">
        <p className="text-xs text-gray-500">Work Hours</p>
        <p className="font-semibold">{calculateWorkHours(log.clockIn, log.clockOut)}</p>
      </div>
      <div className="col-span-2 flex items-center justify-center gap-1 text-gray-500">
        <MapPin size={14} />
        <span>{log.location || 'N/A'}</span>
      </div>
    </div>
    {role === 'admin' && (
      <div className="border-t dark:border-gray-700 mt-2 pt-2 flex justify-end">
        <button onClick={() => openEditModal(log)} className="btn btn-xs btn-ghost"><Edit2 size={14}/></button>
      </div>
    )}
  </div>
);

const DetailedListView = ({ logs, employeeName, month, year, openEditModal, role }) => (
  <div className={darkClass("bg-white rounded-lg shadow-sm p-4", "dark:bg-gray-800")}>
    <h2 className="text-lg font-semibold mb-4">Detail Log Presensi - {employeeName} - {moment().month(month).year(year).format("MMMM YYYY")}</h2>
    <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className={darkClass("text-gray-500", "dark:text-gray-400")}><tr className="border-b dark:border-gray-700"><th className="py-3 px-2 text-left font-semibold">TANGGAL</th><th className="py-3 px-2 text-left font-semibold">HARI</th><th className="py-3 px-2 text-left font-semibold">CLOCK IN</th><th className="py-3 px-2 text-left font-semibold">CLOCK OUT</th><th className="py-3 px-2 text-left font-semibold">LOKASI</th><th className="py-3 px-2 text-left font-semibold">JAM KERJA</th><th className="py-3 px-2 text-left font-semibold">STATUS</th>{role === 'admin' && <th className="py-3 px-2 text-left font-semibold">ACTION</th>}</tr></thead><tbody className="divide-y dark:divide-gray-700">{logs.map(log => (<tr key={log.id}><td className="py-3 px-2"><div className="font-medium">{moment(log.date).format("D MMM")}</div><div className="text-xs text-gray-500">{log.date}</div></td><td className="py-3 px-2">{moment(log.date).format("dddd")}</td><td className={`py-3 px-2 font-medium ${log.clockIn ? 'text-green-600 dark:text-green-400' : ''}`}>{log.clockIn || '-'}</td><td className={`py-3 px-2 font-medium ${log.clockOut ? 'text-red-600 dark:text-red-400' : ''}`}>{log.clockOut || '-'}</td><td className="py-3 px-2">{log.location ? <span className="flex items-center gap-1"><MapPin size={14}/>{log.location}</span> : '-'}</td><td className="py-3 px-2">{calculateWorkHours(log.clockIn, log.clockOut)}</td><td className="py-3 px-2"><StatusBadge status={log.status} /></td>{role === 'admin' && <td className="py-3 px-2"><button onClick={() => openEditModal(log)} className="p-1 text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button></td>}</tr>))}{logs.length === 0 && (<tr><td colSpan={role === 'admin' ? 8 : 7} className="text-center py-8 text-gray-500">No attendance data for this period.</td></tr>)}</tbody></table></div>
  </div>
);

const WeeklyGridView = ({ week, attendanceData, openEditModal }) => {
  const StatusIcon = ({ status }) => {
    if (!status) return <span className="text-gray-400">-</span>;
    const type = attendanceTypes.find(t => t.name === status);
    if (!type) return <span className="text-gray-400">-</span>;
    return React.cloneElement(type.icon, { size: 16 });
  };
  const getLogForDate = (employeeId, date) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    return attendanceData.find(l => l.employeeId === employeeId && l.date === dateString);
  };
  return (
    <div className={darkClass("bg-white rounded-lg shadow-sm p-4", "dark:bg-gray-800")}><div className="overflow-x-auto"><div className="min-w-full inline-block"><div className="grid items-center text-sm" style={{ gridTemplateColumns: `200px repeat(7, 1fr)` }}><div className="font-semibold px-2 py-2 sticky left-0 z-10 bg-white dark:bg-gray-800">Employee</div>{week.map(day => (<div key={day.date.toISOString()} className="text-center font-medium"><p>{day.dayNum}</p><p className="text-xs text-gray-500">{day.dayName}</p></div>))}<div className={darkClass("col-span-8 h-px bg-gray-200 my-1", "dark:bg-gray-700")}></div>{employees.map(employee => (<React.Fragment key={employee.id}><div className="px-2 py-3 flex items-center gap-3 sticky left-0 z-10 bg-white dark:bg-gray-800"><div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center font-bold text-sm">{employee.name.split(' ').map(n=>n[0]).join('')}</div><div><div className="font-medium">{employee.name}</div>{employee.isYou && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">You</span>}</div></div>{week.map(day => { const log = getLogForDate(employee.id, day.date); return (<div key={day.date.toISOString()} onClick={() => log && openEditModal(log)} className={`text-center py-3 flex justify-center items-center ${log ? 'cursor-pointer' : ''}`}><StatusIcon status={log?.status} /></div>);})}</React.Fragment>))}</div></div></div></div>
  );
};


export default function AttendanceDashboard() {
  const { role, name: loggedInUserName } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [attendanceData, setAttendanceData] = useState(() => { try { const savedLogs = localStorage.getItem('attendanceLogs'); return savedLogs ? JSON.parse(savedLogs) : initialAttendanceLogs; } catch (error) { return initialAttendanceLogs; } });
  const loggedInEmployee = employees.find(e => e.name === loggedInUserName);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState({ employeeId: role === 'admin' ? 'all' : loggedInEmployee?.id });

  useEffect(() => { localStorage.setItem('attendanceLogs', JSON.stringify(attendanceData)); }, [attendanceData]);

  const handleOpenAddModal = () => { dispatch(openModal({ title: 'Add Attendance Log', bodyType: MODAL_BODY_TYPES.ATTENDANCE_ADD_NEW, extraObject: { employees, setAttendanceData, role, name: loggedInUserName } })); };
  const handleOpenEditModal = (log) => { dispatch(openModal({ title: 'Edit Attendance Log', bodyType: MODAL_BODY_TYPES.ATTENDANCE_ADD_NEW, extraObject: { employees, setAttendanceData, editingLog: log, role, name: loggedInUserName } })); };

  const weeklyCalendar = useMemo(() => Array.from({ length: 7 }, (_, i) => { const day = moment(currentDate).startOf('week').add(i, 'days'); return { date: day.toDate(), dayNum: day.format('D'), dayName: day.format('ddd') }; }), [currentDate]);

  const filteredLogs = useMemo(() => {
    let data = [...attendanceData];
    if (filters.employeeId !== 'all') {
      data = data.filter(log => log.employeeId === Number(filters.employeeId));
    }
    return data.filter(log => moment(log.date).isSame(moment(currentDate), 'month')).sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [attendanceData, filters.employeeId, currentDate]);

  const showGridView = role === 'admin' && filters.employeeId === 'all';
  const months = moment.months();
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className={darkClass("px-4 sm:px-8 py-6 bg-gray-100 min-h-screen", "dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans")}>
      <div className={darkClass("flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-6", "dark:bg-gray-800")}>
        <div className="flex flex-wrap items-center gap-4">
          {role === 'admin' && (
            <select name="employeeId" value={filters.employeeId} onChange={(e) => setFilters(p => ({...p, employeeId: e.target.value}))} className={darkClass("select select-bordered select-sm", "dark:bg-gray-700 dark:border-gray-600")}>
              <option value="all">All Employees</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
          )}
          <div className="flex items-center space-x-2">
            <select value={moment(currentDate).month()} onChange={e => setCurrentDate(moment(currentDate).month(parseInt(e.target.value)).toDate())} className={darkClass("select select-bordered select-sm", "dark:bg-gray-700 dark:border-gray-600")}>
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={moment(currentDate).year()} onChange={e => setCurrentDate(moment(currentDate).year(parseInt(e.target.value)).toDate())} className={darkClass("select select-bordered select-sm", "dark:bg-gray-700 dark:border-gray-600")}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleOpenAddModal} className="btn btn-sm btn-primary"><Plus size={16} className="mr-1"/>Add Data</button>
        </div>
      </div>

      {/* Tampilan List Detail untuk Mobile & Admin Terfilter */}
      <div className="md:hidden">
        {filteredLogs.map(log => (
          <AttendanceCard key={log.id} log={log} openEditModal={handleOpenEditModal} role={role} />
        ))}
      </div>

      {/* Tampilan Grid (Admin Default) & List (Desktop Karyawan) */}
      <div className="hidden md:block">
        {showGridView ? (
          <div>
            <div className="flex justify-center items-center gap-4 mb-4">
              <button className="btn btn-sm btn-ghost" onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'week').toDate())}><ChevronLeft /> Prev Week</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setCurrentDate(new Date())}>This Week</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setCurrentDate(moment(currentDate).add(1, 'week').toDate())}>Next Week <ChevronRight /></button>
            </div>
            <WeeklyGridView week={weeklyCalendar} attendanceData={attendanceData} openEditModal={handleOpenEditModal} />
          </div>
        ) : (
          <DetailedListView logs={filteredLogs} employeeName={employees.find(e => e.id === Number(filters.employeeId))?.name} month={moment(currentDate).month()} year={moment(currentDate).year()} openEditModal={handleOpenEditModal} role={role} />
        )}
      </div>
    </div>
  );
}
