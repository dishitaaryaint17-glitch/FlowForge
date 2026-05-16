import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { userService } from '../services/userService';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

const SettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    workspaceName: 'FlowForge Team Space',
    emailNotifications: true,
    taskDigest: true,
    compactMode: false,
  });
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const response = await userService.getSettings();
        if (mounted) {
          setSettings(response.settings);
        }
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || err.message || 'Unable to load settings');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const updatedSettings = await userService.updateSettings(settings);
      setSettings(updatedSettings);
      toast({ title: 'Settings saved', description: 'Your workspace preferences were updated.', variant: 'success' });
    } catch (err) {
      const messageText = err.response?.data?.message || err.message || 'Unable to save settings';
      setError(messageText);
      toast({ title: 'Save failed', description: messageText, variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="space-y-6 max-w-4xl">
      <div className="page-header p-5">
        <p className="dashboard-eyebrow">Settings</p>
        <h1 className="dashboard-title mt-2">Preferences</h1>
        <p className="dashboard-subtitle mt-2">Manage your workspace preferences and account settings.</p>
      </div>

      {error && (
        <div className="rounded-[1.35rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {/* Profile Section */}
      <div className="space-y-4">
        <div className="border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Profile</h2>
          <p className="mt-1 text-xs text-[var(--muted)] uppercase tracking-[0.22em]">Your account identity</p>
        </div>

        <article className="section-card space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/15 border border-[var(--border)] text-lg font-bold text-[var(--primary)]">
              {(user?.name || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-[var(--muted)] uppercase tracking-[0.22em]">Account</p>
              <p className="text-lg font-semibold text-[var(--foreground)]">{user?.name || 'Unknown'}</p>
              <p className="text-sm text-[var(--muted)]">{user?.email}</p>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)] mb-2">Email</p>
              <p className="text-sm font-medium text-[var(--foreground)]">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)] mb-2">Role</p>
              <p className="text-sm font-medium text-[var(--primary)] capitalize">{user?.role || 'guest'}</p>
            </div>
          </div>
        </article>
      </div>

      {/* Workspace Settings */}
      <div className="space-y-4">
        <div className="border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Workspace</h2>
          <p className="mt-1 text-xs text-[var(--muted)] uppercase tracking-[0.22em]">Customize your workspace</p>
        </div>

        <article className="section-card space-y-4">
          <Input
            label="Workspace Name"
            value={settings.workspaceName}
            onChange={(event) => setSettings((current) => ({ ...current, workspaceName: event.target.value }))}
          />
        </article>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <div className="border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Notifications</h2>
          <p className="mt-1 text-xs text-[var(--muted)] uppercase tracking-[0.22em]">Control how you receive updates</p>
        </div>

        <article className="section-card space-y-3">
          <label className="switch-row flex items-center justify-between px-4 py-3 cursor-pointer transition">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Email Notifications</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">Receive updates about your tasks and workspace</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(event) => setSettings((current) => ({ ...current, emailNotifications: event.target.checked }))}
              className="w-5 h-5"
            />
          </label>

          <label className="switch-row flex items-center justify-between px-4 py-3 cursor-pointer transition">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Task Digest</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">Weekly summary of your completed tasks</p>
            </div>
            <input
              type="checkbox"
              checked={settings.taskDigest}
              onChange={(event) => setSettings((current) => ({ ...current, taskDigest: event.target.checked }))}
              className="w-5 h-5"
            />
          </label>

          <label className="switch-row flex items-center justify-between px-4 py-3 cursor-pointer transition">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Compact Mode</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">Use a more condensed layout for the dashboard</p>
            </div>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(event) => setSettings((current) => ({ ...current, compactMode: event.target.checked }))}
              className="w-5 h-5"
            />
          </label>
        </article>
      </div>

      {/* Save Button */}
      <div className="form-save-bar flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </section>
  );
};

export default SettingsPage;
