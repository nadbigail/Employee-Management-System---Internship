/** Icons are imported separatly to reduce build time */

import { LiaAddressCardSolid, LiaBriefcaseSolid, LiaBuromobelexperte, LiaBusinessTimeSolid, LiaCalendar, LiaCalendarCheck, LiaChalkboardSolid, LiaClipboardListSolid, LiaCommentsSolid, LiaDoorOpenSolid, LiaMedalSolid, LiaMoneyCheckAltSolid, LiaNewspaper, LiaPlaneDepartureSolid, LiaTicketAltSolid, LiaToolsSolid, LiaUserTieSolid } from "react-icons/lia";

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [

  {
    path: '/app/dashboard',
    icon:<LiaBuromobelexperte className={iconClasses} />,  
    name: 'Dashboard',
  },
  {
    path: '/app/leads', 
    icon: <LiaUserTieSolid className={iconClasses} />, 
    name: 'Leads', 
  },
  {
    path: '', //no url needed as this has submenu
    icon: <LiaAddressCardSolid className={`${iconClasses} inline` }/>, // icon component
    name: 'HR', // name that appear in Sidebar
    submenu : [
      {
        path: '/app/hr-leaves', //url
        icon: <LiaDoorOpenSolid className={submenuIconClasses}/>, // icon component
        name: 'Leaves', // name that appear in Sidebar
      },
      {
        path: '/app/hr-attendance',
        icon: <LiaCalendarCheck className={submenuIconClasses}/>,
        name: 'Attendance',
      },
      {
        path: '/app/hr-holiday', // url
        icon: <LiaPlaneDepartureSolid className={submenuIconClasses}/>, // icon component
        name: 'Holiday', // name that appear in Sidebar
      },
      {
        path: '/app/hr-appreciation', // url
        icon: <LiaMedalSolid className={submenuIconClasses}/>, // icon component
        name: 'Appreciation', // name that appear in Sidebar
      },
    ]
  },
  {
    path: '', // no direct path karena ada submenu
    icon: <LiaBriefcaseSolid className={`${iconClasses} inline`} />,
    name: 'Work',
    submenu: [
      {
        path: '/app/work-projects',
        icon: <LiaToolsSolid className={submenuIconClasses} />,
        name: 'Projects',
      },
      {
        path: '/app/work-tasks',
        icon: <LiaClipboardListSolid className={submenuIconClasses} />,
        name: 'Tasks',
      },
      {
        path: '/app/work-timesheet',
        icon: <LiaBusinessTimeSolid className={submenuIconClasses} />,
        name: 'Timesheet',
      },
    ]
},  
{
    path: '/app/finance',
    icon: <LiaMoneyCheckAltSolid className={iconClasses}/>,
    name: 'Finance',
  },
  {
    path: '/app/meetings',
    icon: <LiaCalendar className={iconClasses}/>,
    name: 'Meetings',
  },
  {
    path: '/app/tickets', // url
    icon: <LiaTicketAltSolid className={iconClasses}/>, // icon component
    name: 'Tickets', // name that appear in Sidebar
  },
  {
    path: '/app/events', // url
    icon: <LiaNewspaper className={iconClasses}/>, // icon component
    name: 'Events', // name that appear in Sidebar
  },
  {
    path: '/app/messages', // url
    icon: <LiaCommentsSolid className={iconClasses}/>, // icon component
    name: 'Messages', // name that appear in Sidebar
  },
  {
    path: '/app/noticeboard', // url
    icon: <LiaChalkboardSolid className={iconClasses}/>, // icon component
    name: 'Notice Board', // name that appear in Sidebar
  },
  {
    path: '/app/settings', // url
    icon: <LiaChalkboardSolid className={iconClasses}/>, // icon component
    name: 'Settings', // name that appear in Sidebar
  },
]

export default routes


