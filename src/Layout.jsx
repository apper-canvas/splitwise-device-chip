import { Outlet, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { tabRoutes } from './config/routes';
import ApperIcon from './components/ApperIcon';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-white border-t border-surface-200 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabRoutes.map((route) => {
            const isActive = location.pathname === route.path;
            return (
              <NavLink
                key={route.id}
                to={route.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-surface-500 hover:text-primary hover:bg-surface-50'
                }`}
              >
                <ApperIcon 
                  name={route.icon} 
                  size={20}
                  className="mb-1"
                />
                <span className="text-xs font-medium">{route.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;