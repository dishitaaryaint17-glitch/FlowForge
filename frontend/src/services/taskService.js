import apiClient from './apiClient';

export const taskService = {
  getTasks: async () => {
    const response = await apiClient.get('/tasks');
    return (response.data.tasks || []).map((task) => ({
      id: task._id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      assignee: task.assignedTo?.name || '-',
      assignedToId: task.assignedTo?._id || task.assignedTo,
      project: task.project?.title || '-',
      projectId: task.project?._id || task.project,
      dueDate: task.dueDate,
      description: task.description,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  },

  createTask: async (payload) => {
    const response = await apiClient.post('/tasks', payload);
    return response.data.task;
  },

  updateTask: async (id, payload) => {
    const response = await apiClient.put(`/tasks/${id}`, payload);
    return response.data.task;
  },

  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },
};
