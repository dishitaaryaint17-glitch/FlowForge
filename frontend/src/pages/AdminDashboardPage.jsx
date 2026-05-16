import { useEffect, useMemo, useState } from 'react';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';
import { formatDate } from '../utils/formatters';

const severityTone = {
  completed: 'text-emerald-300 bg-emerald-500/15',
  'in-progress': 'text-cyan-300 bg-cyan-500/15',
  todo: 'text-amber-300 bg-amber-500/15',
};

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [projectData, taskData, userData] = await Promise.all([
          projectService.getProjects(),
          taskService.getTasks(),
          userService.getUsers(),
        ]);

        if (!mounted) return;
        setProjects(projectData);
        setTasks(taskData);
        setUsers(userData);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.status === 'completed').length;
    const pendingTasks = tasks.filter((task) => task.status !== 'completed').length;
    const activeProjects = projects.filter((project) => project.membersCount > 0).length;

    return [
      { label: 'Total Tasks', value: tasks.length, tone: 'text-cyan-100' },
      { label: 'Completed Tasks', value: completedTasks, tone: 'text-emerald-100' },
      { label: 'Pending Tasks', value: pendingTasks, tone: 'text-amber-100' },
      { label: 'Active Projects', value: activeProjects, tone: 'text-violet-100' },
    ];
  }, [projects, tasks]);

  const recentTasks = useMemo(() => [...tasks].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).slice(0, 6), [tasks]);
  const recentActivity = useMemo(() => [...tasks].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).slice(0, 5), [tasks]);

  const projectProgress = useMemo(() => projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);
    const completed = projectTasks.filter((task) => task.status === 'completed').length;
    const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
    return { ...project, taskCount: projectTasks.length, completed, progress };
  }), [projects, tasks]);

  const teamOverview = useMemo(() => users
    .filter((member) => member.role !== 'admin') // Exclude admin from regular members
    .map((member) => {
      const assigned = tasks.filter((task) => task.assignedToId === member.id);
      return { ...member, assignedCount: assigned.length, completedCount: assigned.filter((task) => task.status === 'completed').length };
    }), [tasks, users]);

  if (loading) return <Loader />;

  return (
    <section className="space-y-4">
      <div className="page-header flex flex-col gap-3 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="dashboard-eyebrow">Admin Workspace</p>
          <h1 className="dashboard-title mt-2">Overview</h1>
          <p className="dashboard-subtitle mt-2">Track all projects, tasks, and team activity from the same unified shell.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <h3 className={`text-3xl font-extrabold ${metric.tone}`}>{metric.value}</h3>
            </div>
          </article>
        ))}
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
                  <tr key={task.id} className="data-row">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[var(--foreground)]">{task.title}</div>
                      <div className="text-xs text-[var(--muted)]">{task.assignee || 'Unassigned'}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">{task.project || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${severityTone[task.status] || severityTone.todo}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">{task.status}</td>
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
              <article key={task.id} className="dashboard-row rounded-[1.5rem] border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{task.title}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{task.project || 'No project linked'} • {task.assignee || 'Unassigned'}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${severityTone[task.status] || severityTone.todo}`}>
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
              <article key={project.id} className="dashboard-row rounded-[1.5rem] border p-4">
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
            {teamOverview.map((member) => (
              <article key={member.id} className="flex items-center justify-between rounded-[1.35rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{member.name}</p>
                  <p className="text-xs text-[var(--muted)]">{member.email}</p>
                </div>
                <div className="text-right text-xs text-[var(--muted)]">
                  <p>{member.assignedCount} assigned</p>
                  <p>{member.completedCount} completed</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
