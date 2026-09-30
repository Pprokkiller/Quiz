const express = require("express");
const router = express.Router();

const optionController = require("../controllers/optionController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyTeacher } = require("../middleware/roleMiddleware");

// Create Option
router.post(
    "/",
    verifyToken,
    verifyTeacher,
    optionController.createOption
);

// Get Options for a Question
router.get(
    "/:questionId",
    verifyToken,
    optionController.getOptionsByQuestionId
);

// Update Option
router.put(
    "/:id",
    verifyToken,
    verifyTeacher,
    optionController.updateOption
);

// Delete Option
router.delete(
    "/:id",
    verifyToken,
    verifyTeacher,
    optionController.deleteOption
);

module.exports = router;