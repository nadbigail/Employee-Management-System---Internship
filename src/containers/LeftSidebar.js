import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import routes from '../routes/sidebar';
import SidebarSubmenu from './SidebarSubmenu';
import { useMemo } from 'react';

function LeftSidebar(){
  const location = useLocation();
  const { role } = useSelector(state => state.user);

  const accessibleRoutes = useMemo(() => {
    return routes
      .map(route => {
        if (route.submenu) {
          const accessibleSubmenu = route.submenu.filter(submenuItem => !submenuItem.role || submenuItem.role === role);
          return { ...route, submenu: accessibleSubmenu };
        }
        return route;
      })
      .filter(route => {
        if (route.role && route.role !== role) {
          return false;
        }
        if (route.submenu && route.submenu.length === 0) {
          return false;
        }
        return true;
      });
  }, [role]);

  const close = () => {
    document.getElementById('left-sidebar-drawer').click()
  }

  return(
    <div className="drawer-side  z-30  ">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu  pt-2 w-80 bg-base-100 min-h-full   text-base-content">
        <button className="btn btn-ghost bg-base-300  btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden" onClick={() => close()}>
          <XMarkIcon className="h-5 inline-block w-5"/>
        </button>

        <li className="mb-2 font-semibold text-xl">

          <Link to={'/app/dashboard'}>
            <img src="/logo.png" alt="DashWind Logo" style={{ width: '360x', height: 'auto' }} />
          </Link> </li>
        {
          accessibleRoutes.map((route, k) => {
            return(
              <li className="" key={k}>
                {
                  route.submenu ?
                    <SidebarSubmenu {...route}/> :
                    (<NavLink
                      end
                      to={route.path}
                      className={({isActive}) => `${isActive ? 'font-semibold  bg-base-200 ' : 'font-normal'}`} >
                      {route.icon} {route.name}
                      {
                        location.pathname === route.path ? (<span className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                                                                  aria-hidden="true"></span>) : null
                      }
                    </NavLink>)
                }

              </li>
            )
          })
        }

      </ul>
    </div>
  )
}

export default LeftSidebar