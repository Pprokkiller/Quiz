const resultService = require("../services/resultService");

// ======================================
// Generate / Submit Result
// ======================================
exports.generateResult = async (req, res) => {
    try {
        const { participantId } = req.params;

        const result = await resultService.generateResult(
            participantId
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Participant or quiz not found"
            });
        }

        res.status(201).json({
            success: true,
            message: "Result generated successfully",
            data: result
        });

    } catch (error) {
        console.error("Generate Result Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================
// Get Result By Participant
// ======================================
exports.getResultByParticipant = async (req, res) => {
    try {
        const { participantId } = req.params;

        const result = await resultService.getResultByParticipant(
            participantId
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Get Result Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================
// Get All Results For Session
// ======================================
exports.getSessionResults = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const results = await resultService.getSessionResults(
            sessionId
        );

        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        console.error("Get Session Results Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};