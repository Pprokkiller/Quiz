const sessionService = require("../services/sessionService");

// ==============================
// Create Session
// ==============================
exports.createSession = async (req, res) => {
    try {

        const teacherId = req.user.id;

        const session = await sessionService.createSession(
            teacherId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Session created successfully",
            data: session
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==============================
// Start Session
// ==============================
exports.startSession = async (req, res) => {

    try {

        const { id } = req.params;

        const session = await sessionService.startSession(id);

        res.status(200).json({
            success: true,
            message: "Quiz session started",
            data: session
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// End Session
// ==============================
exports.endSession = async (req, res) => {

    try {

        const { id } = req.params;

        const session = await sessionService.endSession(id);

        res.status(200).json({
            success: true,
            message: "Quiz session ended",
            data: session
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Get Session By ID
// ==============================
exports.getSessionById = async (req, res) => {

    try {

        const { id } = req.params;

        const session = await sessionService.getSessionById(id);

        if (!session) {

            return res.status(404).json({
                success: false,
                message: "Session not found"
            });

        }

        res.status(200).json({
            success: true,
            data: session
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==============================
// Get Session By Join Code
// ==============================
exports.getSessionByJoinCode = async (req, res) => {

    try {

        const { joinCode } = req.params;

        const session = await sessionService.getSessionByJoinCode(joinCode);

        if (!session) {

            return res.status(404).json({
                success: false,
                message: "Invalid Join Code"
            });

        }

        res.status(200).json({
            success: true,
            data: session
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};