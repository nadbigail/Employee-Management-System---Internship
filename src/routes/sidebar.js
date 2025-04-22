/** Icons are imported separatly to reduce build time */
import { FaBriefcase, FaBusinessTime, FaCalendarDays, FaChalkboardUser, FaCheckToSlot, FaDoorOpen, FaFolderOpen, FaHouse, FaMedal, FaMessage, FaMoneyBill1Wave, FaPlaneDeparture, FaRegAddressCard, FaScrewdriverWrench, FaSliders, FaTicket, FaUsersLine } from "react-icons/fa6"

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
    path: '', // no direct path karena ada submenu
    icon: <FaBriefcase className={`${iconClasses} inline`} />,
    name: 'Work',
    submenu: [
      {
        path: '/app/work-projects',
        icon: <FaScrewdriverWrench className={submenuIconClasses} />,
        name: 'Projects',
      },
      {
        path: '/app/work-tasks',
        icon: <FaFolderOpen className={submenuIconClasses} />,
        name: 'Tasks',
      },
      {
        path: '/app/work-timesheet',
        icon: <FaBusinessTime className={submenuIconClasses} />,
        name: 'Timesheet',
      },
    ]
},  
{
    path: '/app/finance',
    icon: <FaMoneyBill1Wave className={iconClasses}/>,
    name: 'Finance',
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


