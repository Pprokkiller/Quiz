const express = require("express");

const router = express.Router();

const responseController = require("../controllers/responseController");
const { verifyToken } = require("../middleware/authMiddleware");
const { verifyTeacher } = require("../middleware/roleMiddleware");

// ========================================
// Student submits an answer
// ========================================
router.post(
    "/",
    verifyToken,
    responseController.submitResponse
);


// ========================================
// Get all responses for participant
// ========================================
router.get(
    "/participant/:participantId",
    verifyToken,
    responseController.getParticipantResponses
);


// ========================================
// Get participant progress
// ========================================
router.get(
    "/participant/:participantId/progress",
    verifyToken,
    responseController.getParticipantProgress
);


// ========================================
// Get all responses for a live session
// ========================================
router.get(
    "/session/:sessionId",
    verifyToken,
    verifyTeacher,
    responseController.getSessionResponses
);


// ========================================
// Get live leaderboard
// ========================================
router.get(
    "/session/:sessionId/leaderboard",
    verifyToken,
    responseController.getSessionLeaderboard
);


module.exports = router;