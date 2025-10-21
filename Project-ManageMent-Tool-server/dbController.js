const Card = require("./card");
const Project = require("./project");

// Project controllers
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  const project = new Project({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      { _id: req.params.projectId },
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete({
      _id: req.params.projectId,
    });
    if (!deletedProject) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(deletedProject);
  } catch (error) {
    json.status(400).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
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
    const cards = await Card.find({ projectId: req.params.projectId });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCard = async (req, res) => {
  const card = new Card({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    projectId: req.params.projectId,
  });
  try {
    const newCard = await card.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const updatedCard = await Card.findOneAndUpdate(
      { _id: req.params.cardId, projectId: req.params.projectId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findOneAndDelete({
      _id: req.params.cardId,
      projectId: req.params.projectId,
    });
    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(deletedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
