const express = require("express");
const router = express.Router();
const dbController = require("./dbController");
const { requireAuth } = require("@clerk/express");

// Protect all routes with requireAuth
router.use(requireAuth());

// Project routes
router.get("/projects", dbController.getAllProjects);
router.post("/projects", dbController.createProject);
router.get("/projects/:projectId", dbController.getProjectById);
router.put("/projects/:projectId", dbController.updateProject);
router.delete("/projects/:projectId", dbController.deleteProject);

// Card routes (project-specific)
router.get("/projects/:projectId/cards", dbController.getCardsByProject);
router.post("/projects/:projectId/cards", dbController.createCard);
router.put("/projects/:projectId/cards/:cardId", dbController.updateCard);
router.delete("/projects/:projectId/cards/:cardId", dbController.deleteCard);

module.exports = router;
