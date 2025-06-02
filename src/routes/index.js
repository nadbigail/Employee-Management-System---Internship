import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const DocFeatures = lazy(() => import('../pages/DocFeatures'))
const DocComponents = lazy(() => import('../pages/DocComponents'))
const Projects = lazy(() => import('../pages/protected/Projects'))
const Task = lazy(() => import('../pages/protected/Task'))
const Timesheet = lazy(() => import('../pages/protected/Timesheet'))
const Finance = lazy(() => import('../pages/protected/Finance'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Meetings = lazy(() => import('../pages/protected/Meetings'))
const Events = lazy(() => import('../pages/protected/Events'))


const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
 
  // {
  //   path: '/leads',
  //   component: Leads,
  // },
  {
    path: '/settings-team',
    component: Team,
  },
  {
    path: '/calendar',
    component: Calendar,
  },
  {
    path: '/transactions',
    component: Transactions,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/settings-billing',
    component: Bills,
  },
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/features',
    component: DocFeatures,
  },
  {
    path: '/components',
    component: DocComponents,
  },
  {
    path: '/integration',
    component: Integration,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/work-projects',
    component: Projects,
  },
  {
    path: '/work-tasks',
    component: Task,
  },
  {
    path: '/work-timesheet',
    component: Timesheet,
  },
  {
    path: '/finance',
    component: Finance,
  },
  {
    path: '/Meetings',
    component: Meetings,
  },
  {
    path: '/events',
    component: Events,
  },
]

export default routes
