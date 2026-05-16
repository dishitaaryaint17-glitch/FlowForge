import apiClient from './apiClient';

export const projectService = {
  getProjects: async () => {
    const response = await apiClient.get('/projects');
    return (response.data.projects || []).map((project) => ({
      id: project._id,
      title: project.title,
      members: project.members || [],
      memberIds: (project.members || []).map((member) => member?._id || member),
      membersCount: Array.isArray(project.members) ? project.members.length : 0,
      createdBy: project.createdBy,
      description: project.description,
      dueDate: project.dueDate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  },

  createProject: async (payload) => {
    const response = await apiClient.post('/projects', payload);
    return response.data.project;
  },

  updateProject: async (id, payload) => {
    const response = await apiClient.put(`/projects/${id}`, payload);
    return response.data.project;
  },

  deleteProject: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};
