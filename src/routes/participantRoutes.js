const express = require("express");

const router = express.Router();

const participantController =
    require("../controllers/participantController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

const {
    verifyTeacher
} = require("../middleware/roleMiddleware");


// ======================================
// Student joins session
// ======================================
router.post(
    "/join/:sessionId",
    verifyToken,
    participantController.joinSession
);


// ======================================
// Get current student's participant
// ======================================
router.get(
    "/:sessionId/me",
    verifyToken,
    participantController.getParticipant
);


// ======================================
// Get all participants
// Teacher only
// ======================================
router.get(
    "/:sessionId",
    verifyToken,
    verifyTeacher,
    participantController.getSessionParticipants
);


// ======================================
// Get participant count
// Teacher only
// ======================================
router.get(
    "/:sessionId/count",
    verifyToken,
    verifyTeacher,
    participantController.getParticipantCount
);


module.exports = router;