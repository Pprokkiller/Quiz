const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyTeacher } = require("../middleware/roleMiddleware");

// Create Quiz
router.post(
    "/",
    verifyToken,
    verifyTeacher,
    quizController.createQuiz
);

// Get All Quizzes
router.get(
    "/",
    verifyToken,
    quizController.getAllQuizzes
);

// Get Quiz By ID
router.get(
    "/:id",
    verifyToken,
    quizController.getQuizById
);

// Update Quiz
router.put(
    "/:id",
    verifyToken,
    verifyTeacher,
    quizController.updateQuiz
);

// Delete Quiz
router.delete(
    "/:id",
    verifyToken,
    verifyTeacher,
    quizController.deleteQuiz
);

module.exports = router;