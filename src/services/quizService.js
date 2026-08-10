const pool = require("../config/db");

// ========================
// Create Quiz
// ========================
exports.createQuiz = async (teacherId, quizData) => {

    const {
        title,
        description,
        subject,
        difficulty,
        quiz_type,
        total_marks
    } = quizData;

    const result = await pool.query(
        `
        INSERT INTO quizzes
        (
            teacher_id,
            title,
            description,
            subject,
            difficulty,
            quiz_type,
            total_marks
        )

        VALUES
        ($1,$2,$3,$4,$5,$6,$7)

        RETURNING *
        `,
        [
            teacherId,
            title,
            description,
            subject,
            difficulty,
            quiz_type,
            total_marks
        ]
    );

    return result.rows[0];
};

// ========================
// Get Teacher's Quizzes
// ========================
exports.getAllQuizzes = async (teacherId) => {

    const result = await pool.query(
        `
        SELECT *
        FROM quizzes
        WHERE teacher_id = $1
        ORDER BY created_at DESC
        `,
        [teacherId]
    );

    return result.rows;
};

// ========================
// Get Quiz By ID
// ========================
exports.getQuizById = async (quizId) => {

    const result = await pool.query(
        `
        SELECT *
        FROM quizzes
        WHERE quiz_id = $1
        `,
        [quizId]
    );

    return result.rows[0];
};

// ========================
// Update Quiz
// ========================
exports.updateQuiz = async (quizId, quizData) => {

    const {
        title,
        description,
        subject,
        difficulty,
        quiz_type,
        total_marks
    } = quizData;

    const result = await pool.query(
        `
        UPDATE quizzes

        SET
            title=$1,
            description=$2,
            subject=$3,
            difficulty=$4,
            quiz_type=$5,
            total_marks=$6

        WHERE quiz_id=$7

        RETURNING *
        `,
        [
            title,
            description,
            subject,
            difficulty,
            quiz_type,
            total_marks,
            quizId
        ]
    );

    return result.rows[0];
};

// ========================
// Delete Quiz
// ========================
exports.deleteQuiz = async (quizId) => {

    await pool.query(
        `
        DELETE FROM quizzes
        WHERE quiz_id = $1
        `,
        [quizId]
    );

    return true;
};
