const Project = require('../models/Project');
const { successResponse, errorResponse } = require('../utils/responseHandler');


exports.createProject = async (req, res) => {
  try {
    const { title, description, members, dueDate } = req.body;
    const project = await Project.create({ title, description, members, dueDate, createdBy: req.user.id });
    successResponse(res, { project }, 201);
  } catch (err) {
    errorResponse(res, err.message || 'Server Error', 500);
  }
};


exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('members', 'name email').populate('createdBy', 'name email');
    } else {
      projects = await Project.find({ members: req.user.id }).populate('members', 'name email').populate('createdBy', 'name email');
    }
    successResponse(res, { projects });
  } catch (err) {
    errorResponse(res, err.message || 'Server Error', 500);
  }
};


exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email').populate('createdBy', 'name email');
    if (!project) return errorResponse(res, 'Project not found', 404);

    if (req.user.role !== 'admin' && !project.members.some(m => m._id.toString() === req.user.id)) {
      return errorResponse(res, 'Forbidden', 403);
    }

    successResponse(res, { project });
  } catch (err) {
    errorResponse(res, err.message || 'Server Error', 500);
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);

    const { title, description, members, dueDate } = req.body;
    project.title = title || project.title;
    project.description = description || project.description;
    if (members) project.members = members;
    if (dueDate) project.dueDate = dueDate;

    await project.save();
    successResponse(res, { project });
  } catch (err) {
    errorResponse(res, err.message || 'Server Error', 500);
  }
};


exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);
    await Project.findByIdAndDelete(req.params.id);
    successResponse(res, { message: 'Project removed' });
  } catch (err) {
    errorResponse(res, err.message || 'Server Error', 500);
  }
};
