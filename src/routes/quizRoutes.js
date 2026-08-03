const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Teacher only
router.post(
    "/",
    authMiddleware,
    roleMiddleware("teacher"),
    quizController.createQuiz
);

router.get(
    "/",
    authMiddleware,
    quizController.getAllQuizzes
);

router.get(
    "/:id",
    authMiddleware,
    quizController.getQuizById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("teacher"),
    quizController.updateQuiz
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("teacher"),
    quizController.deleteQuiz
);

module.exports = router;