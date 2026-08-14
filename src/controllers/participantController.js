const participantService = require("../services/participantService");


// ======================================
// Student Joins Session
// ======================================
exports.joinSession = async (req, res) => {

    try {

        const { sessionId } = req.params;

        const studentId = req.user.id;

        const participant =
            await participantService.joinSession(
                sessionId,
                studentId
            );

        res.status(201).json({

            success: true,

            message: "Joined quiz session successfully",

            data: participant

        });

    } catch (error) {

        console.error(error);

        res.status(400).json({

            success: false,

            message: error.message

        });

    }
};


// ======================================
// Get Current Participant
// ======================================
exports.getParticipant = async (req, res) => {

    try {

        const { sessionId } = req.params;

        const studentId = req.user.id;

        const participant =
            await participantService.getParticipant(
                sessionId,
                studentId
            );

        if (!participant) {

            return res.status(404).json({

                success: false,

                message: "You have not joined this session"

            });

        }

        res.status(200).json({

            success: true,

            data: participant

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ======================================
// Get Session Participants
// Teacher Only
// ======================================
exports.getSessionParticipants = async (req, res) => {

    try {

        const { sessionId } = req.params;

        const participants =
            await participantService.getSessionParticipants(
                sessionId
            );

        res.status(200).json({

            success: true,

            data: participants

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
};


// ======================================
// Get Participant Count
// Teacher Only
// ======================================
exports.getParticipantCount = async (req, res) => {

    try {

        const { sessionId } = req.params;

        const count =
            await participantService.getParticipantCount(
                sessionId
            );

        res.status(200).json({

            success: true,

            data: {
                participant_count: count
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
};