const express = require("express");
const router = express.Router();

const questionController = require("../controllers/questionController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyTeacher } = require("../middleware/roleMiddleware");

// =========================
// Create Question
// =========================
router.post(
    "/",
    verifyToken,
    verifyTeacher,
    questionController.createQuestion
);

// =========================
// Get Questions By Quiz ID
// =========================
router.get(
    "/:quizId",
    verifyToken,
    questionController.getQuestionsByQuizId
);

// =========================
// Update Question
// =========================
router.put(
    "/:id",
    verifyToken,
    verifyTeacher,
    questionController.updateQuestion
);

// =========================
// Delete Question
// =========================
router.delete(
    "/:id",
    verifyToken,
    verifyTeacher,
    questionController.deleteQuestion
);

module.exports = router;