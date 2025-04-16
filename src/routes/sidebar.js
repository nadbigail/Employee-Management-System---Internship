/** Icons are imported separatly to reduce build time */
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon'
import BoltIcon from '@heroicons/react/24/outline/BoltIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import CodeBracketSquareIcon from '@heroicons/react/24/outline/CodeBracketSquareIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'
import DocumentIcon from '@heroicons/react/24/outline/DocumentIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import KeyIcon from '@heroicons/react/24/outline/KeyIcon'
import { FaBriefcase, FaBusinessTime, FaCalendarDays, FaChalkboardUser, FaCheckToSlot, FaDoorOpen, FaFolderOpen, FaHouse, FaMedal, FaMessage, FaMoneyBill1Wave, FaPlaneDeparture, FaRegAddressCard, FaScrewdriverWrench, FaSliders, FaTicket, FaUsersLine } from "react-icons/fa6";
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [

  {
    path: '/app/dashboard',
    icon: <FaHouse className={iconClasses}/>, 
    name: 'Dashboard',
  },
  {
    path: '/app/leads', // url
    icon: <FaUsersLine className={iconClasses}/>, // icon component
    name: 'Leads', // name that appear in Sidebar
  },
  {
    path: '', //no url needed as this has submenu
    icon: <FaRegAddressCard className={`${iconClasses} inline` }/>, // icon component
    name: 'HR', // name that appear in Sidebar
    submenu : [
      {
        path: '/app/hr-leaves', //url
        icon: <FaDoorOpen className={submenuIconClasses}/>, // icon component
        name: 'Leaves', // name that appear in Sidebar
      },
      {
        path: '/app/hr-attendance',
        icon: <FaCheckToSlot className={submenuIconClasses}/>,
        name: 'Attendance',
      },
      {
        path: '/app/hr-holiday', // url
        icon: <FaPlaneDeparture className={submenuIconClasses}/>, // icon component
        name: 'Holiday', // name that appear in Sidebar
      },
      {
        path: '/app/hr-appreciation', // url
        icon: <FaMedal className={submenuIconClasses}/>, // icon component
        name: 'Appreciation', // name that appear in Sidebar
      },
    ]
  },
  {
    path: '', //no url needed as this has submenu
    icon: <FaBriefcase className={`${iconClasses} inline` }/>, // icon component
    name: 'Work', // name that appear in Sidebar
    submenu : [
      {
        path: '/app/work-projects', //url
        icon: <FaScrewdriverWrench className={submenuIconClasses}/>, // icon component
        name: 'Projects', // name that appear in Sidebar
      },
      {
        path: '/app/work-tasks',
        icon: <FaFolderOpen className={submenuIconClasses}/>,
        name: 'Tasks',
      },
      {
        path: '/app/work-timesheet', // url
        icon: <FaBusinessTime className={submenuIconClasses}/>, // icon component
        name: 'Timesheet', // name that appear in Sidebar
      },
    ]
  },
  {
    path: '/app/finance', // url
    icon: <FaMoneyBill1Wave className={iconClasses}/>, // icon component
    name: 'Finance', // name that appear in Sidebar
  },
  {
    path: '/app/tickets', // url
    icon: <FaTicket className={iconClasses}/>, // icon component
    name: 'Tickets', // name that appear in Sidebar
  },
  {
    path: '/app/events', // url
    icon: <FaCalendarDays className={iconClasses}/>, // icon component
    name: 'Events', // name that appear in Sidebar
  },
  {
    path: '/app/messages', // url
    icon: <FaMessage className={iconClasses}/>, // icon component
    name: 'Messages', // name that appear in Sidebar
  },
  {
    path: '/app/noticeboard', // url
    icon: <FaChalkboardUser className={iconClasses}/>, // icon component
    name: 'Notice Board', // name that appear in Sidebar
  },
  {
    path: '/app/settings', // url
    icon: <FaSliders className={iconClasses}/>, // icon component
    name: 'Settings', // name that appear in Sidebar
  },
]

export default routes


