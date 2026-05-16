import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUiStore } from '../store/uiStore';
import Button from './Button';
import LogoutConfirmDialog from './LogoutConfirmDialog';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toggleSidebar } = useUiStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutConfirm = async () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="sticky top-4 z-20 flex justify-center pointer-events-none px-4">
        <div className="navbar-shell pointer-events-auto w-full max-w-6xl flex items-center justify-between gap-4 rounded-[1.5rem] px-5 py-3">
          {/* Left Section - Workspace Info */}
          <div className="hidden sm:block min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">Workspace</p>
            <p className="text-sm font-semibold text-[var(--foreground)] truncate">FlowForge</p>
          </div>

          {/* Right Section - User Profile */}
          <div className="flex items-center justify-end gap-3 ml-auto">
            {/* User Info - Hidden on mobile */}
            <div className="hidden sm:block text-right pr-3 border-r border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--foreground)] leading-tight">
                {user?.name || 'Guest'}
              </p>
              <p className="text-xs text-[var(--muted)] capitalize tracking-[0.12em]">
                {user?.role || 'guest'}
              </p>
            </div>

            {/* Avatar */}
            <div className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              border border-[var(--border)]
              bg-[var(--primary)]/12
              text-xs font-semibold text-[var(--foreground)]
              flex-shrink-0
            ">
              {(user?.name || 'G')
                .slice(0, 1)
                .toUpperCase()}
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={() => {
                setShowLogoutConfirm(true);
              }}
              className="text-xs px-3 py-1.5"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Navbar;