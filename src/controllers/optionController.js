const optionService = require("../services/optionService");

// =============================
// Create Option
// =============================
exports.createOption = async (req, res) => {
    try {

        const option = await optionService.createOption(req.body);

        res.status(201).json({
            success: true,
            message: "Option added successfully",
            data: option
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
// Get Options By Question ID
// =============================
exports.getOptionsByQuestionId = async (req, res) => {
    try {

        const { questionId } = req.params;

        const options = await optionService.getOptionsByQuestionId(questionId);

        res.status(200).json({
            success: true,
            data: options
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =============================
// Update Option
// =============================
exports.updateOption = async (req, res) => {
    try {

        const { id } = req.params;

        const option = await optionService.updateOption(
            id,
            req.body
        );

        if (!option) {
            return res.status(404).json({
                success: false,
                message: "Option not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Option updated successfully",
            data: option
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =============================
// Delete Option
// =============================
exports.deleteOption = async (req, res) => {
    try {

        const { id } = req.params;

        await optionService.deleteOption(id);

        res.status(200).json({
            success: true,
            message: "Option deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};