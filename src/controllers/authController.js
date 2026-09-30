const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;

        if (!full_name || !email || !password || !role) {
            return res.status(400).json({
                error: "All fields are required."
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: "Email already exists."
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users
            (full_name, email, password_hash, role)
            VALUES ($1,$2,$3,$4)
            RETURNING id, full_name, email, role, created_at`,
            [full_name, email, password_hash, role.toLowerCase()]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {

            return res.status(400).json({
                error: "Email and Password are required"
            });

        }

        // Find user
        const result = await pool.query(

            "SELECT * FROM users WHERE email=$1",

            [email]

        );

        // User not found
        if (result.rows.length === 0) {

            return res.status(401).json({
                error: "Invalid Email or Password"
            });

        }

        const user = result.rows[0];

        // Compare password
        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {

            return res.status(401).json({
                error: "Invalid Email or Password"
            });

        }

        // Create JWT Token
        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: user.role.toLowerCase()
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        // Send response
        res.status(200).json({

            message: "Login Successful",

            token,

            user: {

                id: user.id,

                full_name: user.full_name,

                email: user.email,

                role: user.role.toLowerCase()

            }

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });

    }

};