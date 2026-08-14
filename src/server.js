const express = require("express");
const cors = require("cors");
require("dotenv").config();


// =============================
// ROUTES
// =============================

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const optionRoutes = require("./routes/optionRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const responseRoutes = require("./routes/responseRoutes");
const participantRoutes = require("./routes/participantRoutes");
const resultRoutes = require("./routes/resultRoutes");


// =============================
// APP
// =============================

const app = express();

app.use(cors());
app.use(express.json());


// =============================
// API ROUTES
// =============================

app.use("/api/auth", authRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/options", optionRoutes);

app.use("/api/session", sessionRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/responses", responseRoutes);

app.use("/api/participants", participantRoutes);

app.use("/api/results", resultRoutes);

// =============================
// TEST ROUTE
// =============================

app.get("/", (req, res) => {
    res.send("Quiz Backend Running");
});


// =============================
// SERVER
// =============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});