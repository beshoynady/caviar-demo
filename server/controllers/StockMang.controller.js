const StockManagModel = require('../models/StockManag.model');

const createStockAction = async (req, res, next) => {
    try {
        const {
            itemId,
            unit,
            movement,
            Quantity,
            oldCost,
            oldBalance,
            newBalance,
            price,
            cost,
            actionBy,
            actionAt
        } = req.body;

        const itemAdded = await StockManagModel.create({
            itemId,
            movement,
            Quantity,
            cost,
            oldCost,
            unit,
            Balance: newBalance,
            oldBalance,
            price,
            actionBy,
            actionAt
        });

        res.status(201).json(itemAdded);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStockAction = async (req, res, next) => {
    try {
        const {
            itemId,
            unit,
            movement,
            Quantity,
            oldCost,
            cost,
            oldBalance,
            Balance,
            price,
            actionBy
        } = req.body;

        const actionId = req.params.actionid;

        const updatedAction = await StockManagModel.findByIdAndUpdate(actionId, {
            itemId,
            movement,
            Quantity,
            cost,
            oldCost,
            unit,
            Balance,
            oldBalance,
            price,
            actionBy
        });

        if (!updatedAction) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.status(200).json(updatedAction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllStockActions = async (req, res, next) => {
    try {
        const allActions = await StockManagModel.find({});
        res.status(200).json(allActions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOneStockAction = async (req, res, next) => {
    try {
        const actionId = req.params.actionid;
        const action = await StockManagModel.findById(actionId);

        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.status(200).json(action);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStockAction = async (req, res, next) => {
    try {
        const actionId = req.params.actionid;
        const deletedAction = await StockManagModel.findByIdAndDelete(actionId);

        if (!deletedAction) {
            return res.status(404).json({ message: 'Action not found' });
        }

        res.status(200).json(deletedAction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createStockAction,
    updateStockAction,
    getOneStockAction,
    getAllStockActions,
    deleteStockAction,
};
