const pool = require("../config/db");

// ======================================
// Generate Result for a Participant
// ======================================
exports.generateResult = async (participantId) => {
    // Get participant information
    const participantResult = await pool.query(
        `
        SELECT
            p.participant_id,
            p.session_id,
            p.student_id
        FROM participants p
        WHERE p.participant_id = $1
        `,
        [participantId]
    );

    if (participantResult.rows.length === 0) {
        return null;
    }

    const participant = participantResult.rows[0];

    // Get quiz information
    const quizResult = await pool.query(
        `
        SELECT
            q.quiz_id,
            q.title,
            q.total_marks
        FROM quiz_sessions qs
        JOIN quizzes q
            ON q.quiz_id = qs.quiz_id
        WHERE qs.session_id = $1
        `,
        [participant.session_id]
    );

    if (quizResult.rows.length === 0) {
        return null;
    }

    const quiz = quizResult.rows[0];

    // Count correct answers
    const responseResult = await pool.query(
        `
        SELECT
            COUNT(*) FILTER (WHERE is_correct = true)::int AS correct_answers
        FROM responses
        WHERE participant_id = $1
        `,
        [participantId]
    );

    const correctAnswers = responseResult.rows[0].correct_answers || 0;
    const questionCountResult = await pool.query(
        "SELECT COUNT(*)::int AS total_questions FROM questions WHERE quiz_id = $1",
        [quiz.quiz_id]
    );

    const totalQuestions = questionCountResult.rows[0].total_questions || 0;

    // Calculate percentage
    const percentage =
        totalQuestions > 0
            ? Number(((correctAnswers / totalQuestions) * 100).toFixed(2))
            : 0;

    // For now, score = number of correct answers
    const score = correctAnswers;

    // Check if result already exists
    const existingResult = await pool.query(
        `
        SELECT *
        FROM results
        WHERE participant_id = $1
        `,
        [participantId]
    );

    let result;

    if (existingResult.rows.length > 0) {
        // Update existing result
        const updateResult = await pool.query(
            `
            UPDATE results
            SET
                score = $1,
                percentage = $2,
                submitted_at = NOW()
            WHERE participant_id = $3
            RETURNING *
            `,
            [
                score,
                percentage,
                participantId
            ]
        );

        result = updateResult.rows[0];
    } else {
        // Create new result
        const insertResult = await pool.query(
            `
            INSERT INTO results
            (
                participant_id,
                score,
                percentage,
                submitted_at
            )
            VALUES
            ($1, $2, $3, NOW())
            RETURNING *
            `,
            [
                participantId,
                score,
                percentage
            ]
        );

        result = insertResult.rows[0];
    }

    // Calculate rank
    await pool.query(
        `
        WITH session_info AS (
            SELECT qs.session_id
            FROM participants p
            JOIN quiz_sessions qs ON qs.session_id = p.session_id
            WHERE p.participant_id = $1
        ),
        ranked_results AS (
            SELECT
                r.result_id,
                RANK() OVER (
                    ORDER BY r.percentage DESC
                ) AS calculated_rank
            FROM results r
            JOIN participants p ON p.participant_id = r.participant_id
            WHERE p.session_id = (SELECT session_id FROM session_info)
        )
        UPDATE results r
        SET rank = rr.calculated_rank
        FROM ranked_results rr
        WHERE r.result_id = rr.result_id
        `,
        [participantId]
    );

    // Get final result
    const finalResult = await pool.query(
        `
        SELECT
            r.result_id,
            r.participant_id,
            r.score,
            r.percentage,
            r.rank,
            r.submitted_at,
            p.session_id,
            p.student_id,
            q.quiz_id,
            q.title AS quiz_title,
            q.total_marks
        FROM results r
        JOIN participants p
            ON p.participant_id = r.participant_id
        JOIN quiz_sessions qs
            ON qs.session_id = p.session_id
        JOIN quizzes q
            ON q.quiz_id = qs.quiz_id
        WHERE r.participant_id = $1
        `,
        [participantId]
    );

    return finalResult.rows[0];
};


// ======================================
// Get Result By Participant
// ======================================
exports.getResultByParticipant = async (participantId) => {

    const result = await pool.query(
        `
        SELECT
            r.result_id,
            r.participant_id,
            r.score,
            r.percentage,
            r.rank,
            r.submitted_at,
            p.session_id,
            p.student_id,
            q.quiz_id,
            q.title AS quiz_title,
            q.total_marks
        FROM results r
        JOIN participants p
            ON p.participant_id = r.participant_id
        JOIN quiz_sessions qs
            ON qs.session_id = p.session_id
        JOIN quizzes q
            ON q.quiz_id = qs.quiz_id
        WHERE r.participant_id = $1
        `,
        [participantId]
    );

    return result.rows[0];
};


// ======================================
// Get All Results For A Session
// ======================================
exports.getSessionResults = async (sessionId) => {

    const result = await pool.query(
        `
        SELECT
            r.result_id,
            r.participant_id,
            r.score,
            r.percentage,
            r.rank,
            r.submitted_at,
            p.student_id,
            q.title AS quiz_title
        FROM results r
        JOIN participants p
            ON p.participant_id = r.participant_id
        JOIN quiz_sessions qs
            ON qs.session_id = p.session_id
        JOIN quizzes q
            ON q.quiz_id = qs.quiz_id
        WHERE p.session_id = $1
        ORDER BY r.rank ASC, r.percentage DESC
        `,
        [sessionId]
    );

    return result.rows;
};
// ======================================
// Get All Results For a Specific Quiz (Across all sessions)
// ======================================
exports.getQuizResults = async (quizId, teacherId) => {
    // We join results -> participants -> quiz_sessions -> quizzes
    // We also make sure the quiz belongs to the requesting teacher
    const query = `
        SELECT
            r.result_id,
            r.score,
            r.percentage,
            r.rank,
            r.submitted_at,
            p.participant_id,
            u.full_name AS student_name,
            u.email AS student_email,
            qs.session_id,
            qs.status AS session_status,
            q.title AS quiz_title,
            q.total_marks
        FROM results r
        JOIN participants p ON r.participant_id = p.participant_id
        JOIN users u ON p.student_id = u.id
        JOIN quiz_sessions qs ON p.session_id = qs.session_id
        JOIN quizzes q ON qs.quiz_id = q.quiz_id
        WHERE q.quiz_id = $1 AND q.teacher_id = $2
        ORDER BY r.percentage DESC, r.submitted_at DESC;
    `;

    const result = await pool.query(query, [quizId, teacherId]);
    return result.rows;
};
