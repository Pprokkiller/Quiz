const pool = require("../config/db");

// ======================================
// Generate Random Join Code
// ======================================
function generateJoinCode(length = 6) {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        code += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return code;
}

// ======================================
// Create Session
// ======================================
exports.createSession = async (teacherId, sessionData) => {

    const { quiz_id } = sessionData;

    const joinCode = generateJoinCode();

    const result = await pool.query(
        `
        INSERT INTO quiz_sessions
        (
            quiz_id,
            join_code,
            status
        )
        VALUES
        ($1, $2, $3)
        RETURNING *
        `,
        [
            quiz_id,
            joinCode,
            "Waiting"
        ]
    );

    return result.rows[0];
};

// ======================================
// Start Session
// ======================================
exports.startSession = async (sessionId) => {

    const result = await pool.query(
        `
        UPDATE quiz_sessions
        SET
            status = 'Live',
            start_time = NOW()
        WHERE session_id = $1
        RETURNING *
        `,
        [sessionId]
    );

    return result.rows[0];
};

// ======================================
// End Session
// ======================================
exports.endSession = async (sessionId) => {

    const result = await pool.query(
        `
        UPDATE quiz_sessions
        SET
            status = 'Ended',
            end_time = NOW()
        WHERE session_id = $1
        RETURNING *
        `,
        [sessionId]
    );

    return result.rows[0];
};

// ======================================
// Get Session By ID
// ======================================
exports.getSessionById = async (sessionId) => {

    const result = await pool.query(
        `
        SELECT *
        FROM quiz_sessions
        WHERE session_id = $1
        `,
        [sessionId]
    );

    return result.rows[0];
};

// ======================================
// Get Session By Join Code
// ======================================
exports.getSessionByJoinCode = async (joinCode) => {

    const result = await pool.query(
        `
        SELECT *
        FROM quiz_sessions
        WHERE join_code = $1
        `,
        [joinCode]
    );

    return result.rows[0];
};