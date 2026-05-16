import { useEffect, useMemo, useState } from 'react';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatDate } from '../utils/formatters';
import Modal from '../components/Modal';

const statusTone = {
  completed: 'text-emerald-300 bg-emerald-500/15',
  'in-progress': 'text-cyan-300 bg-cyan-500/15',
  todo: 'text-amber-300 bg-amber-500/15',
};

const MemberDashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const loadData = async () => {
    try {
      const [taskData, projectData] = await Promise.all([
        taskService.getTasks(),
        projectService.getProjects(),
      ]);
      setTasks(taskData || []);
      setProjects(projectData || []);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      await loadData();
      if (mounted) setLoading(false);
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  // Auto-refresh data every 5 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      await loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter tasks assigned to this member
  const memberTasks = useMemo(() => 
    tasks.filter((task) => task.assignedToId === user?.id), 
    [tasks, user?.id]
  );

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const stats = {
      total: memberTasks.length,
      completed: memberTasks.filter((t) => t.status === 'completed').length,
      inProgress: memberTasks.filter((t) => t.status === 'in-progress').length,
      todo: memberTasks.filter((t) => t.status === 'todo').length,
    };
    stats.completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    return stats;
  }, [memberTasks]);

  // Filter projects this member is assigned to
  const memberProjects = useMemo(() => 
    projects.filter((project) => 
      project.members?.some((member) => member._id === user?.id || member.id === user?.id)
    ),
    [projects, user?.id]
  );

  const recentTasks = useMemo(
    () => [...memberTasks].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).slice(0, 6),
    [memberTasks]
  );

  const recentActivity = useMemo(
    () => [...memberTasks].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).slice(0, 5),
    [memberTasks]
  );

  const projectProgress = useMemo(() => memberProjects.map((project) => {
    const projectTasks = memberTasks.filter((task) => task.projectId === project.id);
    const completed = projectTasks.filter((task) => task.status === 'completed').length;
    const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
    return { ...project, taskCount: projectTasks.length, completed, progress };
  }), [memberProjects, memberTasks]);

  const teamOverview = useMemo(() => memberProjects.flatMap((project) => {
    const members = Array.isArray(project.members) ? project.members : [];

    return members
      .filter((member) => (member?._id || member?.id || member) !== user?.id)
      .map((member) => ({
        id: member._id || member.id || member,
        name: member.name || member.fullName || String(member),
        email: member.email || 'Project collaborator',
        assignedCount: memberTasks.filter((task) => task.projectId === project.id).length,
        completedCount: memberTasks.filter((task) => task.projectId === project.id && task.status === 'completed').length,
      }));
  }), [memberProjects, memberTasks, user?.id]);

  const handleStatusUpdate = async (task, status) => {
    if (!task || !status) return;
    
    setStatusUpdating(task.id);
    try {
      await taskService.updateTask(task.id, { status });
      toast({ 
        title: 'Task updated', 
        description: `${task.title} marked as ${status}`, 
        variant: 'success' 
      });
      setSelectedTask(null);
      await loadData();
    } catch (err) {
      toast({ 
        title: 'Update failed', 
        description: err.message || 'Unable to update task status', 
        variant: 'error' 
      });
    } finally {
      setStatusUpdating(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="space-y-4">
      <div className="page-header flex flex-col gap-3 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="dashboard-eyebrow">Member Workspace</p>
          <h1 className="dashboard-title mt-2">Overview</h1>
          <p className="dashboard-subtitle mt-2">Track your assigned work with the same experience as the rest of the product.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="metric-card">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Total Tasks</p>
          <div className="mt-3 flex items-end justify-between">
            <h3 className="text-3xl font-extrabold text-cyan-100">{taskStats.total}</h3>
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">{taskStats.completionRate}% complete</p>
        </article>

        <article className="metric-card">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Completed Tasks</p>
          <div className="mt-3 flex items-end justify-between">
            <h3 className="text-3xl font-extrabold text-emerald-100">{taskStats.completed}</h3>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-[var(--surface-soft)]">
            <div className="h-1.5 rounded-full bg-emerald-400/50" style={{ width: `${taskStats.completionRate}%` }} />
          </div>
        </article>

        <article className="metric-card">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">In Progress</p>
          <div className="mt-3 flex items-end justify-between">
            <h3 className="text-3xl font-extrabold text-cyan-100">{taskStats.inProgress}</h3>
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">Currently active</p>
        </article>

        <article className="metric-card">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Projects</p>
          <div className="mt-3 flex items-end justify-between">
            <h3 className="text-3xl font-extrabold text-violet-100">{memberProjects.length}</h3>
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">Assigned to you</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="section-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--foreground)]">Recent Tasks</h3>
            </div>
          </div>

          <div className="table-card overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr key={task.id} className="data-row cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[var(--foreground)]">{task.title}</div>
                      <div className="text-xs text-[var(--muted)]">{task.description || 'No description'}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">{task.project || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="dashboard-pill rounded-full px-2.5 py-1 text-xs font-semibold capitalize">
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusTone[task.status] || statusTone.todo}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">{formatDate(task.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section-card">
          <h3 className="text-lg font-bold text-[var(--foreground)]">Recent Activity</h3>
          <div className="mt-4 space-y-3">
            {recentActivity.map((task) => (
              <article key={task.id} className="dashboard-row rounded-[1.35rem] border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{task.title}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {task.project || 'No project linked'} • {task.assignee || 'Unassigned'}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone[task.status] || statusTone.todo}`}>
                    {task.status}
                  </span>
                </div>
                <p className="mt-3 text-xs text-[var(--muted)]">Updated {formatDate(task.updatedAt)}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="section-card">
          <h3 className="text-lg font-bold text-[var(--foreground)]">Project Progress</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {projectProgress.map((project) => (
              <article key={project.id} className="dashboard-row rounded-[1.5rem] border px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{project.title}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{project.taskCount} tasks • {project.completed} completed</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/15 px-2.5 py-1 text-xs font-semibold text-cyan-200">{project.progress}%</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${project.progress}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-card">
          <h3 className="text-lg font-bold text-[var(--foreground)]">Team Members</h3>
          <div className="mt-4 space-y-2">
            {teamOverview.length === 0 ? (
              <p className="text-xs text-[var(--muted)]">No collaborators visible for these projects.</p>
            ) : (
              teamOverview.map((member) => (
                <article key={`${member.id}-${member.email}`} className="flex items-center justify-between rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{member.name}</p>
                    <p className="text-xs text-[var(--muted)]">{member.email}</p>
                  </div>
                  <div className="text-right text-xs text-[var(--muted)]">
                    <p>{member.assignedCount} assigned</p>
                    <p>{member.completedCount} completed</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Status Update Modal */}
      <Modal 
        open={Boolean(selectedTask)} 
        title="Update Task Status" 
        onClose={() => setSelectedTask(null)}
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{selectedTask?.title}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{selectedTask?.description}</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">Change Status To:</p>
            
            <div className="grid gap-2">
              {['todo', 'in-progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(selectedTask, status)}
                  disabled={statusUpdating === selectedTask?.id}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    newStatus === status
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                  } ${statusUpdating === selectedTask?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {statusUpdating === selectedTask?.id ? 'Updating...' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={() => setSelectedTask(null)} 
            variant="ghost" 
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default MemberDashboardPage;
