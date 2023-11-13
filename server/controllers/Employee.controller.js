const Employeemodel = require('../models/Employee.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create a new employee
const createEmployee = async (req, res) => {
    try {
        const {
            fullname,
            numberID,
            username,
            email,
            address,
            phone,
            basicSalary,
            payRoll,
            role,
            isActive,
            password: pass,
        } = req.body;

        // Validate required fields
        if (!fullname || !phone || !pass) {
            return res.status(404).json({ message: 'Full name, phone, or password is missing' });
        }

        // Check if the phone number is already in use
        const isEmployeeFound = await Employeemodel.findOne({ phone });
        if (isEmployeeFound) {
            return res.status(404).json({ message: 'This phone number is already in use' });
        }

        // Hash the password
        const password = await bcrypt.hash(pass, 10);

        // Create a new employee in the database
        const newEmployee = await Employeemodel.create({
            fullname,
            username,
            numberID,
            email,
            phone,
            address,
            password,
            basicSalary,
            payRoll,
            role,
            isActive,
        });

        // Generate an access token for the new employee
        const accessToken = jwt.sign(
            {
                employeeinfo: {
                    id: newEmployee._id,
                    username: newEmployee.username,
                    isAdmin: newEmployee.isAdmin, // Assuming isAdmin is a property of the employee model
                    isActive: newEmployee.isActive,
                    role: newEmployee.role,
                },
            },
            process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        );

        // Return success response
        res.status(200).json({ accessToken, newEmployee });
    } catch (err) {
        // Return error response with details
        res.status(404).json({ message: err.message });
    }
};

// Retrieve a single employee by ID
const getoneEmployee = async (req, res) => {
    try {
        const employeeid = req.params.employeeid;
        const employee = await Employeemodel.findById(employeeid);
        res.status(200).json(employee);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Login for employee
const loginEmployee = async (req, res) => {
    try {
        const phone = req.body.phone;
        const password = req.body.password;

        // Validate required fields
        if (!phone || !password) {
            return res.status(404).json({ message: 'Phone or password is required' });
        }

        // Find the employee by phone
        const findEmployee = await Employeemodel.findOne({ phone });

        // Check if the employee exists
        if (!findEmployee) {
            return res.status(400).json({ message: 'Employee not found' });
        }

        // Compare the password
        const match = await bcrypt.compare(password, findEmployee.password);

        // If the password doesn't match, return an error
        if (!match) {
            return res.status(401).json({ message: 'Wrong Password' });
        }

        // Generate an access token for the employee
        const accessToken = jwt.sign(
            {
                employeeinfo: {
                    id: findEmployee._id,
                    username: findEmployee.username,
                    isAdmin: findEmployee.isAdmin,
                    isActive: findEmployee.isActive,
                    role: findEmployee.role,
                },
            },
            process.env.jwt_secret_key,
            { expiresIn: process.env.jwt_expire }
        );

        // Check if accessToken is generated successfully
        if (!accessToken) {
            return res.status(401).json({ message: 'Access token not signed' });
        }

        // Return success response
        res.status(200).json({ findEmployee, accessToken });
    } catch (error) {
        res.status(404).send('Error');
    }
};

// Retrieve all employees
const getallEmployees = async (req, res) => {
    try {
        const allEmployees = await Employeemodel.find({});
        res.status(200).json(allEmployees);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Update an employee by ID
const updateEmployee = async (req, res) => {
    try {
        const id = req.params.employeeid;
        const {
            fullname,
            numberID,
            username,
            email,
            address,
            phone,
            basicSalary,
            payRoll,
            role,
            isActive,
            password: pass,
        } = req.body;

        // Validate required fields
        if (!fullname || !phone) {
            return res.status(404).json({ message: 'Full name or phone is incorrect' });
        }

        // Check if the employee exists
        const isEmployeeFound = await Employeemodel.findOne({ phone });
        if (!isEmployeeFound) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Hash the password if provided
        if (pass) {
            const password = await bcrypt.hash(pass, 10);
            const updateEmployee = await Employeemodel.findByIdAndUpdate(
                id,
                { fullname, username, numberID, email, phone, address, password, basicSalary, isActive, role },
                { new: true }
            );
            updateEmployee.save();
            res.status(200).json(updateEmployee);
        } else {
            // Update employee without changing the password
            const updateEmployee = await Employeemodel.findByIdAndUpdate(
                id,
                { fullname, username, numberID, email, phone, address, basicSalary, isActive, role },
                { new: true }
            );
            updateEmployee.save();
            res.status(200).json(updateEmployee);
        }
    } catch (err) {
        res.status(400).json(err);
    }
};

// Update payRoll for an employee by ID
const payRollEmployee = async (req, res) => {
    try {
        const id = req.params.employeeid;
        const payRoll = req.body.payRoll;

        // Update payRoll for the employee
        const updatePayRoll = await Employeemodel.findByIdAndUpdate(id, { payRoll }, { new: true });
        updatePayRoll.save();
        res.status(200).json(updatePayRoll);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Delete an employee by ID
const deleteEmployee = async (req, res) => {
    try {
        const id = req.params.employeeid;
        // Delete the employee from the database
        const employeeDeleted = await Employeemodel.findByIdAndDelete(id);

        // Check if the employee was deleted
        if (employeeDeleted) {
            return res.status(200).json({ message: 'Employee deleted successfully', employeeDeleted });
        } else {
            return res.status(404).json({ message: 'Employee not found or already deleted' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    createEmployee,
    getoneEmployee,
    loginEmployee,
    payRollEmployee,
    getallEmployees,
    updateEmployee,
    deleteEmployee
};
