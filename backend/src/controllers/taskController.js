const Task = require('../models/Task');
const Project = require('../models/Project');
const { successResponse, errorResponse } = require('../utils/responseHandler');


// CREATE TASK
exports.createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      dueDate
    } = req.body;

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      dueDate
    });

    return successResponse(
      res,
      { task },
      201
    );

  } catch (err) {

    console.error("CREATE TASK ERROR:", err);

    return errorResponse(
      res,
      err.message || 'Server Error',
      500
    );
  }
};


// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {

    let tasks;

    // ADMIN → SEE ALL TASKS
    if (req.user.role === 'admin') {

      tasks = await Task.find()
        .populate('project')
        .populate('assignedTo', 'name email');

    } else {

      // MEMBER → SEE ASSIGNED + PROJECT TASKS
      const projectIds = await Project.find({
        members: req.user.id
      }).select('_id');

      const ids = projectIds.map(
        p => p._id
      );

      tasks = await Task.find({
        $or: [
          { assignedTo: req.user.id },
          { project: { $in: ids } }
        ]
      })
        .populate('project')
        .populate('assignedTo', 'name email');
    }

    return successResponse(
      res,
      { tasks }
    );

  } catch (err) {

    console.error("GET TASKS ERROR:", err);

    return errorResponse(
      res,
      err.message || 'Server Error',
      500
    );
  }
};


// GET SINGLE TASK
exports.getTaskById = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id)
      .populate('project')
      .populate('assignedTo', 'name email');

    if (!task) {
      return errorResponse(
        res,
        'Task not found',
        404
      );
    }

    // MEMBER ACCESS CHECK
    if (req.user.role !== 'admin') {

      const isProjectMember =
        await Project.exists({
          _id: task.project,
          members: req.user.id
        });

      const isAssigned =
        task.assignedTo &&
        task.assignedTo._id.toString() === req.user.id;

      if (!isProjectMember && !isAssigned) {
        return errorResponse(
          res,
          'Forbidden',
          403
        );
      }
    }

    return successResponse(
      res,
      { task }
    );

  } catch (err) {

    console.error("GET TASK BY ID ERROR:", err);

    return errorResponse(
      res,
      err.message || 'Server Error',
      500
    );
  }
};


// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(
        res,
        'Task not found',
        404
      );
    }

    // ADMIN → FULL UPDATE
    if (req.user.role === 'admin') {

      const {
        title,
        description,
        project,
        assignedTo,
        status,
        priority,
        dueDate
      } = req.body;

      task.title = title || task.title;
      task.description = description || task.description;

      if (project) {
        task.project = project;
      }

      if (assignedTo) {
        task.assignedTo = assignedTo;
      }

      if (status) {
        task.status = status;
      }

      if (priority) {
        task.priority = priority;
      }

      if (dueDate) {
        task.dueDate = dueDate;
      }

      await task.save();

      return successResponse(
        res,
        { task }
      );
    }

    // MEMBER → ONLY STATUS UPDATE
    if (
      task.assignedTo &&
      task.assignedTo.toString() === req.user.id
    ) {

      const { status } = req.body;

      if (!status) {
        return errorResponse(
          res,
          'Status is required',
          400
        );
      }

      // STATUS VALIDATION
      const allowedStatuses = [
        'todo',
        'in-progress',
        'completed'
      ];

      if (!allowedStatuses.includes(status)) {
        return errorResponse(
          res,
          'Invalid status',
          400
        );
      }

      task.status = status;

      await task.save();

      return successResponse(
        res,
        { task }
      );
    }

    return errorResponse(
      res,
      'Forbidden',
      403
    );

  } catch (err) {

    console.error("UPDATE TASK ERROR:", err);

    return errorResponse(
      res,
      err.message || 'Server Error',
      500
    );
  }
};


// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return errorResponse(
        res,
        'Task not found',
        404
      );
    }

    await Task.findByIdAndDelete(
      req.params.id
    );

    return successResponse(
      res,
      {
        message: 'Task removed'
      }
    );

  } catch (err) {

    console.error("DELETE TASK ERROR:", err);

    return errorResponse(
      res,
      err.message || 'Server Error',
      500
    );
  }
};