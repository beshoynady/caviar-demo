const mongoose = require('mongoose');

const employeeschema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        require: [true, 'required fullname'],
        minlength: 3,
        maxlength: 100,
    },
    numberID: {
        type: String,
        unique: true,
        require: [true, 'required numberID'],
        trim: true,
        minlength: 14,
        maxlength: 14,
    },
    address: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 150,
    },
    email: {
        type: String,
        unique: true,
        maxlength: 100,
        minlength: 10,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        require: [true, 'required username'],
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    phone: {
        type: String,
        trim: true,
        length: 11,
    },
    password: {
        type: String,
        trim: true,
        require: [true, 'password required'],
        maxlength: 200,
        minlength: 3,
    },
    isAdmin: {
        type: Boolean,
        default: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        require: [true, 'isActive required'],
    },
    role: {
        type: String,
        trim: true,
        enum: ['manager', 'casher', 'waiter', 'Chef'],
        require: [true, 'role required'],
    },
    basicSalary: {
        type: Number,
        required: true,
        min: 0,
    },
    payRole: [
        {
            Month: {
                type: Number,
                required: true,
            },
            salary: {
                type: Number,
                required: true,
                min: 0,
                default: 0
            },
            Additional: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            Bonus: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            TotalDue: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            Absence: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            Deduction: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            Predecessor: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            Insurance: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            Tax: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            TotalDeductible: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            NetSalary: {
                type: Number,
                required: true,
                min: 0,
                default: 0,
            },
            ispaid: {
                type: Boolean,
                required: true,
                default: false,
            }
        }
    ],
    isVarified: {
        type: Boolean,
        default: false
    },
},
    { timestamp: true }
);

const Employeemodel = mongoose.model('Employee', employeeschema);

module.exports = Employeemodel;

