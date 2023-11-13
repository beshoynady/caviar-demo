const Usermodel = require('../models/Users.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    try {
        const { username, email, address, phone, password } = req.body;

        // Validate required fields
        if (!username || !phone || !password || !address) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if the phone number is already in use
        const isUserFound = await Usermodel.findOne({ phone });
        if (isUserFound) {
            return res.status(409).json({ message: 'This phone number is already in use' });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await Usermodel.create({ username, email, phone, address, password: passwordHash });

        // Generate an access token
        const accessToken = generateAccessToken(newUser);

        res.status(201).json({ accessToken, newUser });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validate required fields
        if (!phone || !password) {
            return res.status(400).json({ message: 'Phone and password are required' });
        }

        // Find the user by phone number
        const user = await Usermodel.findOne({ phone });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        // Generate an access token
        const accessToken = generateAccessToken(user);

        res.status(200).json({ user, accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Helper function to generate an access token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userinfo: {
                id: user._id,
                isAdmin: user.isAdmin,
                role: user.role
            }
        },
        process.env.jwt_secret_key,
        { expiresIn: process.env.jwt_expire }
    );
};

module.exports = { signup, login };
