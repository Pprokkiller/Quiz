const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/sessionController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyTeacher } = require("../middleware/roleMiddleware");

// ===============================
// Create Session
// ===============================
router.post(
    "/create",
    verifyToken,
    verifyTeacher,
    sessionController.createSession
);

// ===============================
// Start Session
// ===============================
router.put(
    "/start/:id",
    verifyToken,
    verifyTeacher,
    sessionController.startSession
);

// ===============================
// End Session
// ===============================
router.put(
    "/end/:id",
    verifyToken,
    verifyTeacher,
    sessionController.endSession
);

// ===============================
// Get Session By ID
// ===============================
router.get(
    "/:id",
    verifyToken,
    sessionController.getSessionById
);

// ===============================
// Get Session By Join Code
// ===============================
router.get(
    "/join/:joinCode",
    sessionController.getSessionByJoinCode
);

module.exports = router;