const questionService = require("../services/questionService");

// =============================
// Create Question
// =============================
exports.createQuestion = async (req, res) => {
    try {

        const question = await questionService.createQuestion(req.body);

        res.status(201).json({
            success: true,
            message: "Question added successfully",
            data: question
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =============================
// Get Questions By Quiz ID
// =============================
exports.getQuestionsByQuizId = async (req, res) => {
    try {

        const { quizId } = req.params;

        const questions = await questionService.getQuestionsByQuizId(quizId);

        res.status(200).json({
            success: true,
            data: questions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =============================
// Update Question
// =============================
exports.updateQuestion = async (req, res) => {
    try {

        const { id } = req.params;

        const updatedQuestion = await questionService.updateQuestion(
            id,
            req.body
        );

        if (!updatedQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: updatedQuestion
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =============================
// Delete Question
// =============================
exports.deleteQuestion = async (req, res) => {
    try {

        const { id } = req.params;

        await questionService.deleteQuestion(id);

        res.status(200).json({
            success: true,
            message: "Question deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};