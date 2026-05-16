import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Loader from '../components/Loader';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Modal from '../components/Modal';
import AlertDialog from '../components/AlertDialog';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { USER_ROLES } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

const initialForm = {
  title: '',
  description: '',
  project: '',
  assignedTo: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

const priorityTone = {
  low: 'text-emerald-300 bg-emerald-500/15',
  medium: 'text-amber-300 bg-amber-500/15',
  high: 'text-rose-300 bg-rose-500/15',
};

const TasksPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusOnly, setStatusOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');

  const loadData = async () => {
    const [taskData, projectData] = await Promise.all([
      taskService.getTasks(),
      projectService.getProjects(),
    ]);

    setTasks(taskData);
    setProjects(projectData);

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
        if (mounted) setError(err.response?.data?.message || err.message || 'Unable to load tasks');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.status === 'completed').length,
    active: tasks.filter((task) => task.status === 'in-progress').length,
    dueSoon: tasks.filter((task) => task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)).length,
  }), [tasks]);

  const openCreate = () => {
    setEditingTask(null);
    setStatusOnly(false);
    setForm(initialForm);
    setFieldErrors({});
    setError('');
    setOpen(true);
  };

  const openEdit = (task, statusOnlyMode = false) => {
    setEditingTask(task);
    setStatusOnly(statusOnlyMode);
    setForm({
      title: task.title || '',
      description: task.description || '',
      project: task.projectId || '',
      assignedTo: task.assignedToId || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : '',
    });
    setFieldErrors({});
    setError('');
    setOpen(true);
  };

  const validate = () => {
    const nextErrors = {};

    if (!statusOnly && !form.title.trim()) nextErrors.title = 'Title is required';

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
      if (statusOnly) {
        await taskService.updateTask(editingTask.id, { status: form.status });
        toast({ title: 'Task status updated', description: `${editingTask.title} moved to ${form.status}.`, variant: 'success' });
      } else {
        const payload = {
          title: form.title,
          description: form.description,
          project: form.project,
          assignedTo: form.assignedTo,
          status: form.status,
          priority: form.priority,
          dueDate: form.dueDate || undefined,
        };

        if (editingTask) {
          await taskService.updateTask(editingTask.id, payload);
          toast({ title: 'Task updated', description: `${form.title} was updated successfully.`, variant: 'success' });
        } else {
          await taskService.createTask(payload);
          toast({ title: 'Task created', description: `${form.title} was added to the workspace.`, variant: 'success' });
        }
      }

      setOpen(false);
      setEditingTask(null);
      setStatusOnly(false);
      setForm(initialForm);
      setFieldErrors({});
      await loadData();
    } catch (err) {
      const message = getFriendlyErrorMessage(err, 'Unable to save task');
      setError(message);
      toast({ title: 'Task action failed', description: message, variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await taskService.deleteTask(deleteTarget.id);
      toast({ title: 'Task deleted', description: `${deleteTarget.title} was removed.`, variant: 'success' });
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      toast({ title: 'Delete failed', description: err.message || 'Unable to delete task', variant: 'error' });
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="space-y-4">
      <div className="page-header flex flex-col gap-3 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="dashboard-eyebrow">Tasks</p>
          <h1 className="dashboard-title mt-2">Task list</h1>
        </div>

        {isAdmin && <Button onClick={openCreate}>New Task</Button>}
      </div>

      {error && <p className="rounded-[1.35rem] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="metric-card"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total</p><h3 className="mt-3 text-2xl font-extrabold text-cyan-100">{stats.total}</h3></article>
        <article className="metric-card"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Completed</p><h3 className="mt-3 text-2xl font-extrabold text-emerald-100">{stats.completed}</h3></article>
        <article className="metric-card"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Active</p><h3 className="mt-3 text-2xl font-extrabold text-violet-100">{stats.active}</h3></article>
        <article className="metric-card"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Due soon</p><h3 className="mt-3 text-2xl font-extrabold text-amber-100">{stats.dueSoon}</h3></article>
      </div>

      <div className="table-card overflow-hidden rounded-[2rem] border border-[var(--border)]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Assignee</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Due date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const canEditStatus = !isAdmin && task.assignedToId === user?.id;
              const canAdminManage = isAdmin;

              return (
                <tr key={task.id} className="data-row">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--foreground)]">{task.title}</div>
                    <div className="text-xs text-[var(--muted)]">{task.description || 'No description'}</div>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{task.project || '-'}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-cyan-400/10 text-xs font-semibold text-cyan-100">
                        {(task.assignee || 'U').slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--foreground)]">{task.assignee || 'Unassigned'}</div>
                        <div className="text-xs text-[var(--muted)]">{task.project || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${priorityTone[task.priority] || priorityTone.medium}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{task.status}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{formatDate(task.dueDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {canAdminManage && (
                        <>
                          <Button variant="ghost" onClick={() => openEdit(task)} className="text-xs px-3 py-1.5">Edit</Button>
                          <button
                            onClick={() => setDeleteTarget(task)}
                            title="Delete task"
                            className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41zM9 2a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zm-7 4h2v8H8V6zm4 0h2v8h-2V6zm4 0h2v8h-2V6z"/>
                              <path d="M 9 3 L 9 2 L 15 2 L 15 3 M 6 5 L 18 5 L 17 20 Q 17 21 16 21 L 8 21 Q 7 21 7 20 Z M 10 8 L 10 18 M 12 8 L 12 18 M 14 8 L 14 18"/>
                            </svg>
                          </button>
                        </>
                      )}

                      {canEditStatus && (
                        <Button variant="ghost" onClick={() => openEdit(task, true)} className="text-xs px-3 py-1.5">Update Status</Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editingTask ? (statusOnly ? 'Update Task Status' : 'Edit Task') : 'Create Task'}
        onClose={() => setOpen(false)}
      >
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {statusOnly ? (
            <Select
              label="Status"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          ) : (
            <>
              <Input label="Title" value={form.title} onChange={(event) => {
                setForm((current) => ({ ...current, title: event.target.value }));
                setFieldErrors((current) => ({ ...current, title: '' }));
              }} error={fieldErrors.title} invalid={Boolean(fieldErrors.title)} />
              <Textarea label="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
              <Select label="Project" value={form.project} onChange={(event) => setForm((current) => ({ ...current, project: event.target.value }))}>
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </Select>
              <Select label="Assigned To" value={form.assignedTo} onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))}>
                <option value="">Select assignee</option>
                {users.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} ({candidate.role})
                  </option>
                ))}
              </Select>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select label="Status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
                <Select label="Priority" value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>
              <Input label="Due Date" type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} />
            </>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Task'}</Button>
          </div>
        </form>
      </Modal>

      <AlertDialog
        open={Boolean(deleteTarget)}
        title="Delete task"
        description={deleteTarget ? `Delete ${deleteTarget.title}? This cannot be undone.` : ''}
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default TasksPage;
