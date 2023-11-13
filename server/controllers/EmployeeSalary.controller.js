const EmployeeSalarymodel = require('../models/EmployeeSalary.model');

// Add a salary movement record
const addSalaryMovement = async (req, res, next) => {
    try {
        const { EmployeeId, EmployeeName, movement, Amount, oldAmount, newAmount, actionBy } = req.body;

        // Create a new salary movement record in the database
        const addEmployeeSalary = await EmployeeSalarymodel.create({
            EmployeeId,
            EmployeeName,
            movement,
            Amount,
            oldAmount,
            newAmount,
            actionBy
        });
        
        // Save the new salary movement record
        addEmployeeSalary.save();

        // Return success response
        res.status(200).json(addEmployeeSalary);
    } catch (error) {
        // Return error response with details
        res.status(400).json(error);
        next(error);
    }
};

// Retrieve all salary movement records
const getallSalaryMovement = async (req, res) => {
    try {
        const allSalaryMovement = await EmployeeSalarymodel.find({});

        // Return success response with all salary movement records
        res.status(200).json(allSalaryMovement);
    } catch (error) {
        // Return error response with details
        res.status(400).json(error);
    }
};

// Retrieve a specific salary movement record by ID
const getoneSalaryMovement = async (req, res) => {
    const salarymovementId = req.params.salarymovementId;

    try {
        const EmployeeSalary = await EmployeeSalarymodel.findById(salarymovementId);

        // Check if the salary movement record exists
        if (!EmployeeSalary) {
            return res.status(404).json({ message: 'Salary movement record not found' });
        }

        // Return success response with the specified salary movement record
        res.status(200).json(EmployeeSalary);
    } catch (error) {
        // Return error response with details
        res.status(404).json(error);
    }
};

// Edit a salary movement record by ID
const editSalaryMovement = async (req, res) => {
    try {
        const salarymovementId = req.params.salarymovementId;
        const { EmployeeId, EmployeeName, movement, Amount, oldAmount, newAmount, actionBy } = req.body;

        // Edit the specified salary movement record in the database
        const editMovement = await EmployeeSalarymodel.findByIdAndUpdate(
            { _id: salarymovementId },
            { EmployeeId, EmployeeName, movement, Amount, oldAmount, newAmount, actionBy },
            { new: true }
        );

        // Return success response with the edited salary movement record
        res.status(200).json(editMovement);
    } catch (error) {
        // Return error response with details
        res.status(404).json(error);
    }
};

// Delete a salary movement record by ID
const deleteSalaryMovement = async (req, res) => {
    try {
        const salarymovementId = req.params.salarymovementId;

        // Delete the specified salary movement record from the database
        const SalaryMovementdeleted = await EmployeeSalarymodel.findByIdAndDelete(salarymovementId);

        // Return success response with the deleted salary movement record
        res.status(200).json(SalaryMovementdeleted);
    } catch (error) {
        // Return error response with details
        res.status(404).json(error);
    }
};

module.exports = {
    addSalaryMovement,
    getallSalaryMovement,
    getoneSalaryMovement,
    editSalaryMovement,
    deleteSalaryMovement
};
