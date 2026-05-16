import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { useUiStore } from '../store/uiStore';
import { classNames } from '../utils/formatters';
import BrandMark from './BrandMark';

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarOpen } = useUiStore();

  const links = NAV_LINKS.filter((link) => link.roles.includes(user?.role));

  return (
    <aside
      className={classNames(
        'sidebar-shell hidden min-h-screen w-72 flex-col p-6 lg:flex',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
      aria-label="Sidebar"
    >
      <div className="mb-8 flex items-center justify-between">
        <BrandMark compact />
        <span className="dashboard-pill rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
          {user?.role || 'guest'}
        </span>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              classNames(
                'sidebar-link group flex items-center justify-between text-sm font-medium',
                isActive && 'sidebar-link-active'
              )
            }
          >
            <span className="font-medium">{link.label}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-current/30 opacity-0 transition group-hover:opacity-100" />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
