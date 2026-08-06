const pool = require("../config/db");

// =============================
// Create Option
// =============================
exports.createOption = async (optionData) => {

    const {
        question_id,
        option_text,
        is_correct
    } = optionData;

    const result = await pool.query(
        `
        INSERT INTO options
        (
            question_id,
            option_text,
            is_correct
        )

        VALUES
        ($1,$2,$3)

        RETURNING *
        `,
        [
            question_id,
            option_text,
            is_correct
        ]
    );

    return result.rows[0];
};

// =============================
// Get Options By Question ID
// =============================
exports.getOptionsByQuestionId = async (questionId) => {

    const result = await pool.query(
        `
        SELECT *
        FROM options
        WHERE question_id = $1
        ORDER BY option_id ASC
        `,
        [questionId]
    );

    return result.rows;
};

// =============================
// Update Option
// =============================
exports.updateOption = async (optionId, optionData) => {

    const {
        option_text,
        is_correct
    } = optionData;

    const result = await pool.query(
        `
        UPDATE options

        SET
            option_text = $1,
            is_correct = $2

        WHERE option_id = $3

        RETURNING *
        `,
        [
            option_text,
            is_correct,
            optionId
        ]
    );

    return result.rows[0];
};

// =============================
// Delete Option
// =============================
exports.deleteOption = async (optionId) => {

    await pool.query(
        `
        DELETE FROM options
        WHERE option_id = $1
        `,
        [optionId]
    );

    return true;
};