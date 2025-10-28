const Card = require("./card");
const Project = require("./project");

const ensureUserId = (req, res) => {
  const userId = req.body.userId || req.query.userId;
  if (!userId) {
    res.status(400).json({
      message: "Missing userId. Include Clerk user id in body or query.",
    });
    return null;
  }
  return userId;
};

// Project controllers
exports.getAllProjects = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    }
    const projects = await Project.find({ userId: req.auth.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    }

    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      userId: req.auth.userId,
    });
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    }
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId,
    });
    if (!project) return res.status(404).json({ message: "Project Not found" });

    project.title = req.body.title ?? project.title;
    project.description = req.body.description ?? project.description;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    }

    const deletedProject = await Project.findOneAndDelete({
      _id: req.params.projectId,
      userId: req.auth.userId,
    });
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(deletedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId)
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.auth.userId,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Card controllers (project-specific)
exports.getCardsByProject = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId)
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.auth.userId,
    });
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found or not owned by user" });

    const cards = await Card.find({ projectId: req.params.projectId });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCard = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.auth.userId,
    });
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found or not owned by user" });

    const card = new Card({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      projectId: req.params.projectId,
      userId: req.auth.userId,
    });
    const newCard = await card.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    }
    const card = await Card.findOne({
      _id: req.params.cardId,
      projectId: req.params.projectId,
      userId: req.auth.userId,
    });
    if (!card)
      return res
        .status(404)
        .json({ message: "Card not found or not owned by user" });

    card.title = req.body.title ?? card.title;
    card.description = req.body.description ?? card.description;
    card.status = req.body.status ?? card.status;

    const updatedCard = await card.save();
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const userId = req.auth.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID not found." });
    }

    const deletedCard = await Card.findOneAndDelete({
      _id: req.params.cardId,
      projectId: req.params.projectId,
      userId: req.auth.userId,
    });
    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(deletedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
