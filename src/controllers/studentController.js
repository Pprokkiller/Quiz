const studentService = require("../services/studentService");

// ======================================
// Get Student Dashboard Data
// ======================================

exports.getDashboardData = async (req, res) => {
    try {

        // Logged-in student's ID comes from JWT
        const studentId = req.user.id;

        const dashboardData =
            await studentService.getStudentDashboard(studentId);

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

// ======================================
// Get All Past Results For A Student
// ======================================

exports.getStudentResults = async (req, res) => {
    try {

        const studentId = req.user.id;

        const results =
            await studentService.getStudentResults(studentId);

        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {

        console.error("Student Results Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
