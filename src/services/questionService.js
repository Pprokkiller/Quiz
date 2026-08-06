const pool = require("../config/db");

// =========================
// Create Question
// =========================
exports.createQuestion = async (questionData) => {

    const {
        quiz_id,
        question_text,
        question_type,
        marks,
        explanation
    } = questionData;

    const result = await pool.query(
        `
        INSERT INTO questions
        (
            quiz_id,
            question_text,
            question_type,
            marks,
            explanation
        )

        VALUES
        ($1,$2,$3,$4,$5)

        RETURNING *
        `,
        [
            quiz_id,
            question_text,
            question_type,
            marks,
            explanation
        ]
    );

    return result.rows[0];
};

// =========================
// Get Questions By Quiz ID
// =========================
exports.getQuestionsByQuizId = async (quizId) => {

    const result = await pool.query(
        `
        SELECT *
        FROM questions
        WHERE quiz_id = $1
        ORDER BY question_id ASC
        `,
        [quizId]
    );

    return result.rows;
};

// =========================
// Update Question
// =========================
exports.updateQuestion = async (questionId, questionData) => {

    const {
        question_text,
        question_type,
        marks,
        explanation
    } = questionData;

    const result = await pool.query(
        `
        UPDATE questions

        SET
            question_text = $1,
            question_type = $2,
            marks = $3,
            explanation = $4

        WHERE question_id = $5

        RETURNING *
        `,
        [
            question_text,
            question_type,
            marks,
            explanation,
            questionId
        ]
    );

    return result.rows[0];
};

// =========================
// Delete Question
// =========================
exports.deleteQuestion = async (questionId) => {

    await pool.query(
        `
        DELETE FROM questions
        WHERE question_id = $1
        `,
        [questionId]
    );

    return true;
};