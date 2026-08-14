const responseService = require("../services/responseService");

// ========================================
// Submit Response
// ========================================
exports.submitResponse = async (req, res) => {
    try {
        const {
            participantId,
            questionId,
            optionId,
            responseTime
        } = req.body;

        // ----------------------------------------
        // Validate required fields
        // ----------------------------------------
        if (
            !participantId ||
            !questionId ||
            !optionId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "participantId, questionId and optionId are required"
            });
        }

        // ----------------------------------------
        // Submit response
        // ----------------------------------------
        const result = await responseService.submitResponse({
            participantId,
            questionId,
            optionId,
            responseTime: responseTime || 0
        });

        return res.status(201).json({
            success: true,
            message: result.updated
                ? "Response updated successfully"
                : "Response submitted successfully",

            response: result.response,

            // This lets the student frontend
            // immediately know whether the answer
            // was correct.
            isCorrect: result.isCorrect
        });

    } catch (error) {

        console.error(
            "Submit response error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to submit response"
        });
    }
};


// ========================================
// Get Participant Responses
// ========================================
exports.getParticipantResponses = async (req, res) => {
    try {

        const { participantId } = req.params;

        if (!participantId) {
            return res.status(400).json({
                success: false,
                message: "participantId is required"
            });
        }

        const responses =
            await responseService.getParticipantResponses(
                participantId
            );

        return res.status(200).json({
            success: true,
            responses
        });

    } catch (error) {

        console.error(
            "Get participant responses error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get participant responses"
        });
    }
};


// ========================================
// Get Participant Progress
// ========================================
exports.getParticipantProgress = async (req, res) => {
    try {

        const { participantId } = req.params;

        if (!participantId) {
            return res.status(400).json({
                success: false,
                message: "participantId is required"
            });
        }

        const progress =
            await responseService.getParticipantProgress(
                participantId
            );

        return res.status(200).json({
            success: true,
            progress
        });

    } catch (error) {

        console.error(
            "Get participant progress error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get participant progress"
        });
    }
};


// ========================================
// Get All Responses For Session
// ========================================
exports.getSessionResponses = async (req, res) => {
    try {

        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "sessionId is required"
            });
        }

        const responses =
            await responseService.getSessionResponses(
                sessionId
            );

        return res.status(200).json({
            success: true,
            responses
        });

    } catch (error) {

        console.error(
            "Get session responses error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get session responses"
        });
    }
};


// ========================================
// Get Live Session Leaderboard
// ========================================
exports.getSessionLeaderboard = async (req, res) => {
    try {

        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "sessionId is required"
            });
        }

        const leaderboard =
            await responseService.getSessionLeaderboard(
                sessionId
            );

        return res.status(200).json({
            success: true,
            leaderboard
        });

    } catch (error) {

        console.error(
            "Get session leaderboard error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get session leaderboard"
        });
    }
};