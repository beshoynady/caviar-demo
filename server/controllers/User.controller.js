const Usermodel = require('../models/Users.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Function to create a new user
const createuser = async (req, res) => {
    try {
        const { username, email, address, phone, password } = req.body;

        // Schema validation using Joi for incoming data
        const schema = Joi.object({
            username: Joi.string().trim().min(3).max(100).required(),
            email: Joi.string().email().trim().min(10).max(100).required(),
            address: Joi.string().trim().min(3).max(150),
            phone: Joi.string().trim().length(11).required(),
            password: Joi.string().trim().min(3).max(200).required(),
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
            return res.status(400).json({ message: validationResult.error.details[0].message });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const isUserFound = await Usermodel.findOne({ phone });
        if (isUserFound) {
            return res.status(409).json({ message: 'This phone number is already in use' });
        }

        const newUser = await Usermodel.create({
            username,
            email,
            address,
            phone,
            password: hashedPassword,
        });

        // Generating JWT token for user authentication
        const accessToken = jwt.sign({
            userinfo: {
                id: newUser._id,
                isActive: newUser.isActive,
            },
        }, process.env.jwt_secret_key, { expiresIn: process.env.jwt_expire });

        res.status(201).json({ accessToken, newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Function to retrieve a single user by ID
const getoneuser = async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await Usermodel.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Function to retrieve all users
const getallusers = async (req, res) => {
    try {
        const allusers = await Usermodel.find({});
        res.status(200).json(allusers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Function to update user information
const updateuser = async (req, res) => {
    try {
        const { userid } = req.params;
        const { username, email, address, phone, password } = req.body;

        // Schema validation using Joi for incoming data
        const schema = Joi.object({
            username: Joi.string().trim().min(3).max(100).required(),
            email: Joi.string().email().trim().min(10).max(100).required(),
            address: Joi.string().trim().min(3).max(150),
            phone: Joi.string().trim().length(11).required(),
            password: Joi.string().trim().min(3).max(200),
            isActive: Joi.boolean(),
        });

        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
            return res.status(400).json({ message: validationResult.error.details[0].message });
        }

        const isUserFound = await Usermodel.findOne({ phone });
        if (!isUserFound) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateFields = {
            username,
            email,
            address,
            phone,
            isActive
        };

        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await Usermodel.findByIdAndUpdate(userid, updateFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Function to delete a user by ID
const deleteuser = async (req, res) => {
    try {
        const { userid } = req.params;
        const userDeleted = await Usermodel.findByIdAndDelete(userid);
        if (!userDeleted) {
            return res.status(404).json({ message: 'User not found or already deleted' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createuser, getoneuser, getallusers, updateuser, deleteuser };
