const pool = require("../config/db");

// ========================================
// Submit Student Response
// ========================================
exports.submitResponse = async ({
    participantId,
    questionId,
    optionId,
    responseTime
}) => {

    // ----------------------------------------
    // 1. Check that the selected option
    // belongs to the selected question
    // ----------------------------------------
    const optionResult = await pool.query(
        `
        SELECT
            option_id,
            question_id,
            is_correct
        FROM options
        WHERE option_id = $1
          AND question_id = $2
        `,
        [optionId, questionId]
    );

    if (optionResult.rows.length === 0) {
        throw new Error(
            "Selected option does not belong to this question"
        );
    }

    const option = optionResult.rows[0];

    // ----------------------------------------
    // 2. Check participant exists
    // ----------------------------------------
    const participantResult = await pool.query(
        `
        SELECT
            participant_id,
            session_id,
            student_id
        FROM participants
        WHERE participant_id = $1
        `,
        [participantId]
    );

    if (participantResult.rows.length === 0) {
        throw new Error("Participant not found");
    }

    const participant = participantResult.rows[0];

    // ----------------------------------------
    // 3. Check question exists
    // ----------------------------------------
    const questionResult = await pool.query(
        `
        SELECT
            question_id,
            quiz_id,
            marks
        FROM questions
        WHERE question_id = $1
        `,
        [questionId]
    );

    if (questionResult.rows.length === 0) {
        throw new Error("Question not found");
    }

    // ----------------------------------------
    // 4. Determine whether answer is correct
    // ----------------------------------------
    const isCorrect = option.is_correct === true;

    // ----------------------------------------
    // 5. Prevent duplicate answer
    // ----------------------------------------
    const existingResponse = await pool.query(
        `
        SELECT response_id
        FROM responses
        WHERE participant_id = $1
          AND question_id = $2
        `,
        [participantId, questionId]
    );

    if (existingResponse.rows.length > 0) {

        // Update existing answer instead of
        // creating another response
        const updateResult = await pool.query(
            `
            UPDATE responses
            SET
                option_id = $1,
                response_time = $2,
                is_correct = $3
            WHERE participant_id = $4
              AND question_id = $5
            RETURNING *
            `,
            [
                optionId,
                responseTime,
                isCorrect,
                participantId,
                questionId
            ]
        );

        return {
            response: updateResult.rows[0],
            isCorrect,
            updated: true
        };
    }

    // ----------------------------------------
    // 6. Insert new response
    // ----------------------------------------
    const result = await pool.query(
        `
        INSERT INTO responses
        (
            participant_id,
            question_id,
            option_id,
            response_time,
            is_correct
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
            participantId,
            questionId,
            optionId,
            responseTime,
            isCorrect
        ]
    );

    return {
        response: result.rows[0],
        isCorrect,
        updated: false
    };
};


// ========================================
// Get Responses For Participant
// ========================================
exports.getParticipantResponses = async (participantId) => {

    const result = await pool.query(
        `
        SELECT
            r.response_id,
            r.participant_id,
            r.question_id,
            r.option_id,
            r.response_time,
            r.is_correct,

            q.question_text,
            q.marks,

            o.option_text

        FROM responses r

        INNER JOIN questions q
            ON q.question_id = r.question_id

        INNER JOIN options o
            ON o.option_id = r.option_id

        WHERE r.participant_id = $1

        ORDER BY r.response_id ASC
        `,
        [participantId]
    );

    return result.rows;
};


// ========================================
// Get Participant Progress
// ========================================
exports.getParticipantProgress = async (participantId) => {

    const result = await pool.query(
        `
        SELECT
            COUNT(*)::int AS answered_questions,

            COUNT(*) FILTER (
                WHERE is_correct = true
            )::int AS correct_answers,

            COUNT(*) FILTER (
                WHERE is_correct = false
            )::int AS incorrect_answers

        FROM responses
        WHERE participant_id = $1
        `,
        [participantId]
    );

    return result.rows[0];
};


// ========================================
// Get Responses For A Session
// ========================================
exports.getSessionResponses = async (sessionId) => {

    const result = await pool.query(
        `
        SELECT
            r.response_id,
            r.participant_id,
            r.question_id,
            r.option_id,
            r.response_time,
            r.is_correct,

            p.student_id,

            u.full_name AS student_name,

            q.question_text,

            o.option_text

        FROM responses r

        INNER JOIN participants p
            ON p.participant_id = r.participant_id

        INNER JOIN users u
            ON u.id = p.student_id

        INNER JOIN questions q
            ON q.question_id = r.question_id

        INNER JOIN options o
            ON o.option_id = r.option_id

        WHERE p.session_id = $1

        ORDER BY r.response_id ASC
        `,
        [sessionId]
    );

    return result.rows;
};


// ========================================
// Get Live Progress For Every Student
// ========================================
exports.getSessionLeaderboard = async (sessionId) => {

    const result = await pool.query(
        `
        SELECT
            p.participant_id,
            p.student_id,
            u.full_name AS student_name,

            COUNT(r.response_id)::int AS answered_questions,

            COUNT(r.response_id)
                FILTER (
                    WHERE r.is_correct = true
                )::int AS correct_answers,

            COUNT(r.response_id)
                FILTER (
                    WHERE r.is_correct = false
                )::int AS incorrect_answers,

            COALESCE(
                SUM(
                    CASE
                        WHEN r.is_correct = true
                        THEN q.marks
                        ELSE 0
                    END
                ),
                0
            )::int AS score

        FROM participants p

        INNER JOIN users u
            ON u.id = p.student_id

        LEFT JOIN responses r
            ON r.participant_id = p.participant_id

        LEFT JOIN questions q
            ON q.question_id = r.question_id

        WHERE p.session_id = $1

        GROUP BY
            p.participant_id,
            p.student_id,
            u.full_name

        ORDER BY
            score DESC,
            correct_answers DESC,
            answered_questions DESC
        `,
        [sessionId]
    );

    return result.rows;
};