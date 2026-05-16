import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Modal from '../components/Modal';
import AlertDialog from '../components/AlertDialog';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';
import { formatDate } from '../utils/formatters';
import { USER_ROLES } from '../utils/constants';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

const initialForm = {
  title: '',
  description: '',
  members: [],
  dueDate: '',
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');

  const loadData = async () => {
    const [projectData, taskData] = await Promise.all([
      projectService.getProjects(),
      taskService.getTasks(),
    ]);
    setProjects(projectData);
    setTasks(taskData);

    if (isAdmin) {
      const userData = await userService.getUsers();
      setUsers(userData);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        await loadData();
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load projects');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const memberOptions = useMemo(() => users.filter((candidate) => candidate.role === 'member'), [users]);

  const enrichedProjects = useMemo(() => projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);
    const completed = projectTasks.filter((task) => task.status === 'completed').length;
    const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
    const nextDue = projectTasks
      .filter((task) => task.dueDate)
      .map((task) => new Date(task.dueDate))
      .sort((a, b) => a - b)[0];

    return {
      ...project,
      taskCount: projectTasks.length,
      progress,
      nextDue,
    };
  }), [projects, tasks]);

  const openCreate = () => {
    setEditingProject(null);
    setForm(initialForm);
    setFieldErrors({});
    setError('');
    setOpen(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title || '',
      description: project.description || '',
      members: (project.memberIds || []).filter((memberId) => memberOptions.some((candidate) => candidate.id === memberId)),
      dueDate: project.dueDate ? String(project.dueDate).slice(0, 10) : '',
    });
    setFieldErrors({});
    setError('');
    setOpen(true);
  };

  const toggleMember = (memberId) => {
    setForm((current) => {
      const members = current.members.includes(memberId)
        ? current.members.filter((value) => value !== memberId)
        : [...current.members, memberId];

      return { ...current, members };
    });
  };

  const removeMember = (memberId) => {
    setForm((current) => ({
      ...current,
      members: current.members.filter((value) => value !== memberId),
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = 'Project name is required';

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        members: form.members,
        dueDate: form.dueDate || undefined,
      };

      if (editingProject) {
        await projectService.updateProject(editingProject.id, payload);
        toast({ title: 'Project updated', description: `${form.title} was updated successfully.`, variant: 'success' });
      } else {
        await projectService.createProject(payload);
        toast({ title: 'Project created', description: `${form.title} was added to the workspace.`, variant: 'success' });
      }

      setOpen(false);
      setEditingProject(null);
      setForm(initialForm);
      setFieldErrors({});
      await loadData();
    } catch (err) {
      const message = getFriendlyErrorMessage(err, 'Unable to save project');
      setError(message);
      toast({ title: 'Project action failed', description: message, variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await projectService.deleteProject(deleteTarget.id);
      toast({ title: 'Project deleted', description: `${deleteTarget.title} was removed.`, variant: 'success' });
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      toast({ title: 'Delete failed', description: err.message || 'Unable to delete project', variant: 'error' });
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="space-y-4">
      <div className="page-header flex flex-col gap-3 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="dashboard-eyebrow">Projects</p>
          <h1 className="dashboard-title mt-2">Workspace portfolio</h1>
        </div>
        {isAdmin && <Button onClick={openCreate}>New Project</Button>}
      </div>

      {error && <p className="rounded-[1.35rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="metric-card"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Projects</p><h3 className="mt-3 text-2xl font-extrabold text-cyan-100">{projects.length}</h3></article>
        <article className="metric-card"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Tasks</p><h3 className="mt-3 text-2xl font-extrabold text-violet-100">{tasks.length}</h3></article>
        <article className="metric-card"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Completed</p><h3 className="mt-3 text-2xl font-extrabold text-emerald-100">{tasks.filter((task) => task.status === 'completed').length}</h3></article>
        <article className="metric-card"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Members</p><h3 className="mt-3 text-2xl font-extrabold text-amber-100">{memberOptions.length}</h3></article>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {enrichedProjects.map((project) => (
          <article key={project.id} className="section-card transition hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-50">{project.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">{project.description || 'No description.'}</p>
              </div>
              <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-200">{project.progress}%</span>
            </div>

            <div className="mt-4 h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${project.progress}%` }} />
            </div>

            <div className="mt-4 grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Task count</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{project.taskCount}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Next due</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{formatDate(project.dueDate || project.nextDue)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">Assigned members</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(project.members || [])
                    .filter((member) => (member?.role ? member.role !== 'admin' : true))
                    .map((member) => (
                      <span key={member._id || member} className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium text-[var(--foreground)]">
                        {member.name || member}
                      </span>
                    ))}
                  {!project.members?.length && <span className="text-sm text-[var(--muted)]">None assigned</span>}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-5 flex items-center justify-between gap-2">
                <button onClick={() => openEdit(project)} className="flex-1 rounded-lg bg-[var(--surface-soft)] text-[var(--foreground)] border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--surface-hover)] transition">Edit</button>
                <button
                  onClick={() => setDeleteTarget(project)}
                  title="Delete project"
                  className="rounded-lg p-2 h-9 w-9 flex items-center justify-center text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M 9 3 L 9 2 L 15 2 L 15 3 M 6 5 L 18 5 L 17 20 Q 17 21 16 21 L 8 21 Q 7 21 7 20 Z M 10 8 L 10 18 M 12 8 L 12 18 M 14 8 L 14 18"/>
                  </svg>
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <Modal open={open} title={editingProject ? 'Edit Project' : 'Create Project'} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Project name"
            value={form.title}
            onChange={(event) => {
              setForm((current) => ({ ...current, title: event.target.value }));
              setFieldErrors((current) => ({ ...current, title: '' }));
            }}
            error={fieldErrors.title}
            invalid={Boolean(fieldErrors.title)}
          />
          <Textarea label="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />

          <Input label="Due date" type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} />

          <div className="field-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">Assigned members</p>
                <p className="text-xs text-[var(--muted)]">Add or remove members without using a dropdown.</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{form.members.length} selected</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {form.members.length ? form.members.map((memberId) => {
                const member = memberOptions.find((candidate) => candidate.id === memberId);
                return (
                  <button
                    key={memberId}
                    type="button"
                    onClick={() => removeMember(memberId)}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                  >
                    <span>{member?.name || 'Member'}</span>
                    <span aria-hidden="true">×</span>
                  </button>
                );
              }) : <span className="text-sm text-[var(--muted)]">No members selected.</span>}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {memberOptions.map((candidate) => {
                const checked = form.members.includes(candidate.id);

                return (
                  <label key={candidate.id} className={`flex cursor-pointer items-start gap-3 rounded-[1.15rem] border px-3 py-3 transition ${checked ? 'border-cyan-300/30 bg-cyan-400/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMember(candidate.id)}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-cyan-500 focus:ring-cyan-400/30"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{candidate.name}</p>
                      <p className="text-xs text-[var(--muted)]">{candidate.email}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Project'}</Button>
          </div>
        </form>
      </Modal>

      <AlertDialog
        open={Boolean(deleteTarget)}
        title="Delete project"
        description={deleteTarget ? `Delete ${deleteTarget.title}? This removes it from the workspace.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default ProjectsPage;
