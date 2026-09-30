// ======================================
// Verify Teacher
// ======================================

exports.verifyTeacher = (req, res, next) => {

    if (req.user.role !== "teacher") {

        return res.status(403).json({
            error: "Only teachers can perform this action."
        });

    }

    next();
};


// ======================================
// Verify Student
// ======================================

exports.verifyStudent = (req, res, next) => {

    if (req.user.role !== "student") {

        return res.status(403).json({
            error: "Only students can perform this action."
        });

    }

    next();
};