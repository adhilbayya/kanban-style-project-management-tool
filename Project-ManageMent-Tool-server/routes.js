const express = require("express");
const router = express.Router();
const dbController = require("./dbController");

// Project routes
router.get("/projects", dbController.getAllProjects);
router.post("/projects", dbController.createProject);
router.get("/projects/:projectId", dbController.getProjectById);

// Card routes (project-specific)
router.get("/projects/:projectId/cards", dbController.getCardsByProject);
router.post("/projects/:projectId/cards", dbController.createCard);
router.put("/projects/:projectId/cards/:cardId", dbController.updateCard);
router.delete("/projects/:projectId/cards/:cardId", dbController.deleteCard);

module.exports = router;
