const express = require("express");

const router = express.Router();

const studentController = require("../controllers/studentController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyStudent } = require("../middleware/roleMiddleware");

// ======================================
// Get Student Dashboard Data
// ======================================

router.get(
    "/dashboard",
    verifyToken,
    verifyStudent,
    studentController.getDashboardData
);

module.exports = router;