const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    email: {
        type: String,
        unique: true,
        maxlength: 100,
        minlength: 5,
        trim: true,
        validate: {
            validator: function (v) {
                // Simple email validation
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: 'Please enter a valid email address',
        },
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        maxlength: 200,
        minlength: 8,
        select: false, // Hide password from query results
    },
    address: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 150,
        required: [true, 'Address is required'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        length: 11,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: [true, 'isActive required'],
    },
},
{ timestamps: true }
);

const Usermodel = mongoose.model('User', userschema);

module.exports = Usermodel;

