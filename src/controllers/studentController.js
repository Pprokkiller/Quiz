const studentService = require("../services/studentService");

// ======================================
// Get Student Dashboard Data
// ======================================

exports.getDashboardData = async (req, res) => {
    try {

        // Logged-in student's ID comes from JWT
        const studentId = req.user.id;

        const dashboardData =
            await studentService.getDashboardData(studentId);

        res.status(200).json({
            success: true,
            data: dashboardData
        });

    } catch (error) {

        console.error("Student Dashboard Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};