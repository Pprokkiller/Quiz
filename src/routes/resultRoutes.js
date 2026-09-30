const express = require("express");
const router = express.Router();

const resultController = require("../controllers/resultController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyTeacher } = require("../middleware/roleMiddleware");


// ======================================
// Generate Result
// Student submits/completes quiz
// ======================================
router.post(
    "/participant/:participantId/generate",
    verifyToken,
    resultController.generateResult
);


// ======================================
// Get Result By Participant
// Student views own result
// ======================================
router.get(
    "/participant/:participantId",
    verifyToken,
    resultController.getResultByParticipant
);


// ======================================
// Get All Results For Session
// Teacher views session results
// ======================================
router.get(
    "/session/:sessionId",
    verifyToken,
    verifyTeacher,
    resultController.getSessionResults
);


// ======================================
// Get All Results For Quiz
// Teacher views all student results for a specific quiz
// ======================================
router.get(
    "/quiz/:quizId",
    verifyToken,
    verifyTeacher,
    resultController.getQuizResults
);
module.exports = router;
