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
        VALUES ($1,$2,$3,$4,$5,$6,$7)
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
        SELECT
            q.*,
            COUNT(questions.question_id)::int AS question_count
        FROM quizzes q
        LEFT JOIN questions
            ON questions.quiz_id = q.quiz_id
        WHERE q.teacher_id = $1
        GROUP BY q.quiz_id
        ORDER BY q.created_at DESC
        `,
        [teacherId]
    );

    return result.rows;
};


// ========================
// Get Quiz By ID
// Includes Questions + Options
// ========================
exports.getQuizById = async (quizId) => {

    const quizResult = await pool.query(
        `
        SELECT *
        FROM quizzes
        WHERE quiz_id = $1
        `,
        [quizId]
    );

    if (quizResult.rows.length === 0) {
        return null;
    }

    const quiz = quizResult.rows[0];


    // Get questions
    const questionsResult = await pool.query(
        `
        SELECT *
        FROM questions
        WHERE quiz_id = $1
        ORDER BY question_id ASC
        `,
        [quizId]
    );


    // Get options for every question
    for (const question of questionsResult.rows) {

        const optionsResult = await pool.query(
            `
            SELECT *
            FROM options
            WHERE question_id = $1
            ORDER BY option_id ASC
            `,
            [question.question_id]
        );

        question.options = optionsResult.rows;
    }


    quiz.questions = questionsResult.rows;

    return quiz;
};


// ========================
// Update Quiz
// ========================
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
            title = $1,
            description = $2,
            subject = $3,
            difficulty = $4,
            quiz_type = $5,
            total_marks = $6
        WHERE quiz_id = $7
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