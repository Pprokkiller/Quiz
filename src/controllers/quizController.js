const quizService = require("../services/quizService");

// Create Quiz
exports.createQuiz = async (req, res) => {
    try {
        const teacherId = req.user.id; // Comes from auth middleware

        const quiz = await quizService.createQuiz(
            teacherId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: quiz
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Teacher's Quizzes
exports.getAllQuizzes = async (req, res) => {

    try {

        const teacherId = req.user.id;

        const quizzes = await quizService.getAllQuizzes(
            teacherId
        );

        // If student, strip out is_correct
        if (req.user && req.user.role === "student") {
            quiz.questions.forEach(q => {
                if (q.options) {
                    q.options.forEach(o => delete o.is_correct);
                }
            });
        }

        res.status(200).json({
            success: true,
            data: quizzes
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Quiz By ID
exports.getQuizById = async (req, res) => {

    try {

        const { id } = req.params;

        const quiz = await quizService.getQuizById(id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update Quiz
exports.updateQuiz = async (req, res) => {

    try {

        const { id } = req.params;

        const updatedQuiz = await quizService.updateQuiz(
            id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            data: updatedQuiz
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {

    try {

        const { id } = req.params;

        await quizService.deleteQuiz(id);

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};