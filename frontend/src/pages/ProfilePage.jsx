import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Loader from '../components/Loader';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (user) return;
      try {
        const response = await authService.getProfile();
        if (mounted) {
          setProfile(response.user);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) return <Loader />;

  return (
    <section className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
        <p className="mt-2 text-[var(--muted)]">View and manage your account details and identity settings.</p>
      </div>

      {/* Profile Card */}
      <article className="glass-panel rounded-[2rem] p-8 space-y-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary)]/15 border-2 border-[var(--border)] text-3xl font-bold text-[var(--primary)] flex-shrink-0">
            {(profile?.name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)] mb-2">Account</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">{profile?.name || 'Unknown User'}</p>
            <p className="text-sm text-[var(--muted)] mt-1">{profile?.email}</p>
            <div className="mt-3 inline-block">
              <span className="rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-3 py-1 text-xs font-semibold text-[var(--primary)] uppercase tracking-[0.22em] capitalize">
                {profile?.role || 'guest'}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border)]" />

        {/* Account Details */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)] mb-2">Email Address</p>
            <p className="text-sm font-medium text-[var(--foreground)]">{profile?.email || '-'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)] mb-2">Account Role</p>
            <p className="text-sm font-medium text-[var(--primary)] capitalize">{profile?.role || '-'}</p>
          </div>
        </div>
      </article>

      {/* Info Section */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
        <p className="text-sm text-[var(--muted)]">
          Your profile information is managed by the workspace administrator. To update your profile details, contact your workspace admin.
        </p>
      </div>
    </section>
  );
};

export default ProfilePage;
