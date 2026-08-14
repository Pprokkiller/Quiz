const pool = require("../config/db");

// ======================================
// Join Session
// ======================================
exports.joinSession = async (sessionId, studentId) => {

    // Check that session exists
    const sessionResult = await pool.query(
        `
        SELECT *
        FROM quiz_sessions
        WHERE session_id = $1
        `,
        [sessionId]
    );

    if (sessionResult.rows.length === 0) {
        throw new Error("Quiz session not found");
    }

    const session = sessionResult.rows[0];

    // Do not allow students to join an ended session
    if (session.status === "Ended") {
        throw new Error("This quiz session has ended");
    }

    // Check if student already joined
    const existingParticipant = await pool.query(
        `
        SELECT *
        FROM participants
        WHERE session_id = $1
        AND student_id = $2
        `,
        [
            sessionId,
            studentId
        ]
    );

    if (existingParticipant.rows.length > 0) {

        return existingParticipant.rows[0];

    }

    // Create participant
    const result = await pool.query(
        `
        INSERT INTO participants
        (
            session_id,
            student_id
        )
        VALUES
        ($1, $2)
        RETURNING *
        `,
        [
            sessionId,
            studentId
        ]
    );

    return result.rows[0];
};


// ======================================
// Get Participant
// ======================================
exports.getParticipant = async (
    sessionId,
    studentId
) => {

    const result = await pool.query(
        `
        SELECT *
        FROM participants
        WHERE session_id = $1
        AND student_id = $2
        `,
        [
            sessionId,
            studentId
        ]
    );

    return result.rows[0];
};


// ======================================
// Get All Participants
// ======================================
exports.getSessionParticipants = async (sessionId) => {

    const result = await pool.query(
        `
        SELECT
            p.*,
            u.name,
            u.email
        FROM participants p
        JOIN users u
            ON u.user_id = p.student_id
        WHERE p.session_id = $1
        ORDER BY p.joined_at ASC
        `,
        [sessionId]
    );

    return result.rows;
};


// ======================================
// Get Participant Count
// ======================================
exports.getParticipantCount = async (sessionId) => {

    const result = await pool.query(
        `
        SELECT COUNT(*)::int AS participant_count
        FROM participants
        WHERE session_id = $1
        `,
        [sessionId]
    );

    return result.rows[0].participant_count;
};