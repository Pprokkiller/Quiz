const express = require("express");

const router = express.Router();

const responseController = require("../controllers/responseController");

// ========================================
// Student submits an answer
// ========================================
router.post(
    "/",
    responseController.submitResponse
);


// ========================================
// Get all responses for participant
// ========================================
router.get(
    "/participant/:participantId",
    responseController.getParticipantResponses
);


// ========================================
// Get participant progress
// ========================================
router.get(
    "/participant/:participantId/progress",
    responseController.getParticipantProgress
);


// ========================================
// Get all responses for a live session
// ========================================
router.get(
    "/session/:sessionId",
    responseController.getSessionResponses
);


// ========================================
// Get live leaderboard
// ========================================
router.get(
    "/session/:sessionId/leaderboard",
    responseController.getSessionLeaderboard
);


module.exports = router;