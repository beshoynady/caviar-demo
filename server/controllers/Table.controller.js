const QRCode = require('qrcode');
const TableModel = require('../models/Table.model');

// Create a new table
const createTable = async (req, res) => {
    const { tablenum, description, chairs } = req.body;

    try {
        // Validate the request body if needed

        // Create a new table in the database
        const tableCreated = await TableModel.create({ tablenum, description, chairs });

        // Return the success response
        return res.status(201).json({ message: "Table created successfully", data: tableCreated });
    } catch (err) {
        console.error("Error creating table:", err);
        // Return an error response with details
        return res.status(400).json({ message: "Error creating table", error: err.message });
    }
};

// Create a QR code based on the provided URL
const createQR = async (req, res) => {
    const { URL } = req.body;

    try {
        // Generate a QR code from the URL
        const QR = await QRCode.toDataURL(URL);

        // Return the generated QR code
        return res.status(200).json(QR);
    } catch (err) {
        console.error("Error creating QR code:", err);
        // Return an error response with details
        return res.status(400).json({ message: "Error creating QR code", error: err.message });
    }
};

// Retrieve all tables
const showAllTables = async (_req, res) => {
    try {
        // Retrieve all tables from the database
        const allTables = await TableModel.find();

        // Return the list of tables
        return res.status(200).json(allTables);
    } catch (error) {
        console.error("Error getting all tables:", error);
        // Return an error response with details
        return res.status(400).json({ message: "Error getting all tables", error: error.message });
    }
};

// Retrieve a single table by ID
const showOneTable = async (req, res) => {
    const id = req.params.tableid;

    try {
        // Retrieve a table by ID from the database
        const oneTable = await TableModel.findById(id);

        // Check if the table exists
        if (!oneTable) {
            return res.status(404).json({ message: "No such table exists" });
        }

        // Return the found table
        return res.status(200).json(oneTable);
    } catch (e) {
        console.error("Error getting one table:", e);
        // Return an error response with details
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update a table by ID
const updateTable = async (req, res) => {
    const id = req.params.tableid;
    const { tablenum, description, chairs, isValid } = req.body;

    try {
        // Update the table in the database
        const updatedTable = await TableModel.findByIdAndUpdate(
            { _id: id },
            { $set: { tablenum, description, chairs, isValid } },
            { new: true }
        );

        // Check if the table exists
        if (!updatedTable) {
            return res.status(404).json({ message: "No such table exists" });
        }

        // Return the updated table
        return res.status(200).json(updatedTable);
    } catch (err) {
        console.error("Error updating table:", err);
        // Return an error response with details
        return res.status(400).json({ message: "Error updating table", error: err.message });
    }
};

// Delete a table by ID
const deleteTable = async (req, res) => {
    const id = req.params.tableid;

    try {
        // Delete the table from the database
        const deletedTable = await TableModel.findByIdAndDelete(id);

        // Check if the table was deleted
        if (deletedTable) {
            return res.status(200).json({ message: "Table successfully deleted" });
        } else {
            return res.status(404).json({ message: "Table not found or already deleted" });
        }
    } catch (error) {
        console.error("Error deleting table:", error);
        // Return an error response with details
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createTable,
    createQR,
    showAllTables,
    showOneTable,
    updateTable,
    deleteTable
};
