const pool = require("../config/db");

// =====================================================
// Get Student Dashboard Data
// =====================================================

exports.getStudentDashboard = async (studentId) => {

    // -------------------------------------------------
    // 1. Completed quizzes
    // -------------------------------------------------

    const completedResult = await pool.query(
        `
        SELECT COUNT(*) AS completed
        FROM results r
        INNER JOIN participants p
            ON r.participant_id = p.participant_id
        WHERE p.student_id = $1
        `,
        [studentId]
    );


    // -------------------------------------------------
    // 2. Average score
    // -------------------------------------------------

    const averageResult = await pool.query(
        `
        SELECT COALESCE(AVG(r.percentage), 0) AS average_score
        FROM results r
        INNER JOIN participants p
            ON r.participant_id = p.participant_id
        WHERE p.student_id = $1
        `,
        [studentId]
    );


    // -------------------------------------------------
    // 3. Recent Results
    // -------------------------------------------------

    const recentResults = await pool.query(
        `
        SELECT
            r.result_id,
            q.quiz_id,
            q.title,
            r.score,
            r.percentage,
            r.submitted_at,

            (
                SELECT COUNT(*)
                FROM questions qu
                WHERE qu.quiz_id = q.quiz_id
            ) AS total_questions

        FROM results r

        INNER JOIN participants p
            ON r.participant_id = p.participant_id

        INNER JOIN quiz_sessions qs
            ON p.session_id = qs.session_id

        INNER JOIN quizzes q
            ON qs.quiz_id = q.quiz_id

        WHERE p.student_id = $1

        ORDER BY r.submitted_at DESC

        LIMIT 5
        `,
        [studentId]
    );


    // -------------------------------------------------
    // 4. Upcoming / available quizzes
    // -------------------------------------------------

    /*
       A quiz is considered upcoming for the student
       if the student has not completed it yet.

       We exclude quizzes for which this student
       already has a result.
    */

    const upcomingResult = await pool.query(
        `
        SELECT
            q.quiz_id,
            q.title,
            q.description,
            q.subject,
            q.difficulty,
            q.quiz_type,
            q.total_marks,
            q.created_at,

            (
                SELECT COUNT(*)
                FROM questions qu
                WHERE qu.quiz_id = q.quiz_id
            ) AS total_questions

        FROM quizzes q

        WHERE q.quiz_id NOT IN (

            SELECT DISTINCT qs.quiz_id

            FROM results r

            INNER JOIN participants p
                ON r.participant_id = p.participant_id

            INNER JOIN quiz_sessions qs
                ON p.session_id = qs.session_id

            WHERE p.student_id = $1

        )

        ORDER BY q.created_at DESC

        LIMIT 10
        `,
        [studentId]
    );


    // -------------------------------------------------
    // Return everything
    // -------------------------------------------------

    return {

        upcoming: Number(upcomingResult.rowCount),

        completed: Number(
            completedResult.rows[0].completed
        ),

        averageScore: Number(
            Number(
                averageResult.rows[0].average_score
            ).toFixed(0)
        ),

        recentResults: recentResults.rows,

        upcomingQuizzes: upcomingResult.rows

    };
};

// =====================================================
// Get All Past Results For A Student
// =====================================================

exports.getStudentResults = async (studentId) => {

    const result = await pool.query(
        `
        SELECT
            r.result_id,
            r.participant_id,
            r.score,
            r.percentage,
            r.rank,
            r.submitted_at,

            q.quiz_id,
            q.title,
            q.subject,
            q.difficulty,
            q.total_marks,

            qs.session_id,

            (
                SELECT COUNT(*)::int
                FROM questions qu
                WHERE qu.quiz_id = q.quiz_id
            ) AS total_questions

        FROM results r

        INNER JOIN participants p
            ON r.participant_id = p.participant_id

        INNER JOIN quiz_sessions qs
            ON p.session_id = qs.session_id

        INNER JOIN quizzes q
            ON qs.quiz_id = q.quiz_id

        WHERE p.student_id = $1

        ORDER BY r.submitted_at DESC
        `,
        [studentId]
    );

    return result.rows;
};
