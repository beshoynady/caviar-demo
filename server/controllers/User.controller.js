const Usermodel = require('../models/Users.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create a new user
const createuser = async (req, res) => {
    try {
        const {
            username,
            email,
            address,
            salary,
            phone,
            role,
            isAdmin,
            password: pass, // Renamed for clarity
        } = req.body;

        // Validate required fields
        if (!username || !phone || !pass) {
            return res.status(404).json({ message: 'Username, phone, or password is missing' });
        }

        // Check if the phone number is already in use
        const isUserFound = await Usermodel.findOne({ phone });
        if (isUserFound) {
            return res.status(404).json({ message: 'This phone number is already in use' });
        }

        // Hash the password
        const password = await bcrypt.hash(pass, 10);

        // Create a new user in the database
        const newUser = await Usermodel.create({ username, email, phone, salary, address, password, isAdmin, role });

        // Generate an access token for the new user
        const accessToken = jwt.sign(
            {
                userinfo: {
                    id: newUser._id,
                    isAdmin: newUser.isAdmin,
                    isActive: newUser.isActive, // Assuming isActive is a property of the user model
                    role: newUser.role,
                },
            },
            process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        );

        // Return success response
        res.status(200).json({ accessToken, newUser });
    } catch (err) {
        // Return error response with details
        res.status(404).json({ message: err.message });
    }
};

// Retrieve a single user by ID
const getoneuser = async (req, res) => {
    try {
        const userid = req.params.userid;
        const user = await Usermodel.findById(userid);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Retrieve all users
const getallusers = async (req, res) => {
    try {
        const allUsers = await Usermodel.find({});
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Update a user by ID
const updateuser = async (req, res) => {
    try {
        const id = req.params.userid;
        const {
            username,
            email,
            address,
            salary,
            phone,
            role,
            isAdmin,
            isActive,
            password: pass,
        } = req.body;

        // Validate required fields
        if (!username || !phone) {
            return res.status(404).json({ message: 'Username or phone is missing' });
        }

        // Check if the user exists
        const isUserFound = await Usermodel.findOne({ phone });
        if (!isUserFound) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the password if provided
        if (pass) {
            const password = await bcrypt.hash(pass, 10);
            const updateUser = await Usermodel.findByIdAndUpdate(
                id,
                { username, email, phone, salary, address, password, isAdmin, isActive, role },
                { new: true }
            );
            res.status(200).json(updateUser);
        } else {
            // Update user without changing the password
            const updateUser = await Usermodel.findByIdAndUpdate(
                id,
                { username, email, phone, salary, address, isAdmin, isActive, role },
                { new: true }
            );
            res.status(200).json(updateUser);
        }

        // Generate an access token for the updated user
        const accessToken = jwt.sign(
            {
                userinfo: {
                    id: updateUser._id,
                    isAdmin: updateUser.isAdmin,
                    isActive: updateUser.isActive,
                    role: updateUser.role,
                },
            },
            process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        );

        // Return success response
        res.status(200).json({ accessToken, updateUser });
    } catch (err) {
        res.status(400).json(err);
    }
};

// Delete a user by ID
const deleteuser = async (req, res) => {
    const id = req.params.userid;
    try {
        const userDeleted = await Usermodel.findByIdAndDelete(id);
        if (userDeleted) {
            return res.status(200).json({ message: "User deleted successfully", userDeleted });
        } else {
            return res.status(404).json({ message: "User not found or already deleted" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { createuser, getoneuser, getallusers, updateuser, deleteuser };
