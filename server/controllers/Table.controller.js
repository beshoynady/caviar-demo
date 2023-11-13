const QRCode = require('qrcode')

const TableModel = require('../models/Table.model');

const createTable = async (req, res) => {
    const tablenum = req.body.tablenum;
    const description = req.body.description;
    const chairs = req.body.chairs;
    try {
        const tablecreated = await TableModel.create({ tablenum, description, chairs });

        return res.json({ "message": "table created successfully", "data": tablecreated }).status(200)

    } catch (err) {
        res.status(400).json(err.Message)
    }
}

const createQR = async (req, res) => {
    const URL = req.body.URL;
    try {
        const QR = await QRCode.toDataURL(URL);
        res.json(QR).status(200);
    } catch (err) {
        res.status(400).json(err)
    }
}

const showAllTables = async (_req, res) => {
    try {
        const allTable = await TableModel.find();
        return res.status(200).json(allTable)
    }
    catch (error) {
        console.log("Error in getting all tables", error);
        res.status(400).json(error)
    };
}

const showOneTable = async (req, res) => {
    const id = req.params.tableid
    try {
        const oneTable = await TableModel.findById(id);
        if (!oneTable) return res.status(404).json({ "Message": "No such a table exist" });
        else return res.status(200).json(oneTable)
    }
    catch (e) {
        console.log(e, " Something Went Wrong")
        return res.status(500).json({ "Mesage": "Internal Server Error " });
    }
}

const updateTable = async (req, res) => {
    const id = req.params.tableid
    const tablenum = req.body.tablenum;
    const description = req.body.description;
    const chairs = req.body.chairs;
    const isValid = req.body.isValid;
    try {
        const updatedTable = await TableModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                tablenum,
                description,
                chairs,
                isValid
            }
        },
            { new: true }).exec()
        if (!updatedTable) {
            return res.status(404).json({ "Message": "no Such A Table Exist" });
        }
        else {
            return res.status(201).json(updatedTable);
        }
    } catch (err) {
        console.log({ message: "Invalid Request Body" }, err);
        return res.status(400).json({ "Message": 'Invalid request body' });

    }
}

const deleteTable = async (req, res) => {
    const id =await req.params.tableid
    try {
        const deletedTable = await TableModel.findByIdAndDelete(id).exec();
        if (deletedTable) {
            return res.status(200).json({ "Deleted Message": "The requested table has been successfully Deleted." });
        } else {
            return res.status(404).json({ "Error message": "Requested table not found or already deleted!" })
        };
    } catch (error) {
        console.log("Something went wrong", error);
        return res.status(500).json({ "Server Error ": "Unable to process your request at this time please contact support" })
    }
}

module.exports = {
    createTable,
    createQR,
    showAllTables,
    showOneTable,
    updateTable,
    deleteTable
}