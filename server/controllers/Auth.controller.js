const Usermodel = require('../models/Users.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const signup = async (req, res) => {
    try {
        const { username, email, address, phone, password, passconfirm } = req.body;

        // Check if passwords match
        if (password !== passconfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Validate input fields using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const isUserExist = await Usermodel.findOne({ phone });
        if (isUserExist) {
            return res.status(409).json({ message: 'This phone number is already in use' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await Usermodel.create({
            username,
            email,
            phone,
            address,
            password: passwordHash,
        });

        const accessToken = generateAccessToken(newUser);

        res.status(201).json({ accessToken, newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const findUser = await Usermodel.findOne({ phone });
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is active before allowing login
        if (!findUser.isActive) {
            return res.status(401).json({ message: 'User is not active' });
        }

        const match = await bcrypt.compare(password, findUser.password); // Compare hashed password
        if (!match) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        const accessToken = generateAccessToken(findUser);

        res.status(200).json({ findUser, accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userinfo: {
                id: user._id,
                isActive: user.isActive,
                username: user.username,
                phone: user.phone,
            },
        },
        process.env.jwt_secret_key,
        { expiresIn: process.env.jwt_expire }
    );
};

module.exports = { signup, login };
