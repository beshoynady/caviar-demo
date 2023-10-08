const StockManagModel = require('../models/StockManag.model');



const createStockAction = async (req, res, next) => {
    try {
        const itemId = await req.body.itemId
        const unit = await req.body.unit
        const movement = await req.body.movement;
        const Quantity = await req.body.Quantity;
        const oldCost = await req.body.oldCost;
        const oldBalance = await req.body.oldBalance;
        const Balance = await req.body.newBalance;
        const price = await req.body.price;
        const cost = await req.body.cost;
        const actionBy = await req.body.actionBy;
        const actionAt = await req.body.actionAt;
        
        const itemadded =await StockManagModel.create({itemId, movement, Quantity,cost,oldCost, unit, Balance,oldBalance, price,actionBy,actionAt })
        res.status(200).json(itemadded)
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

const UpdateStockAction = async (req, res, next) => {
    try {
        const actionid =await req.params.actionid
        const itemId = await req.body.itemId
        const unit = await req.body.unit
        const movement = await req.body.movement;
        const Quantity = await req.body.Quantity;
        const oldCost = await req.body.oldCost;
        const cost = await req.body.cost;
        const oldBalance = await req.body.oldBalance;
        const Balance = await req.body.Balance;
        const price = await req.body.price;
        const actionBy = await req.body.actionBy;

        const updatedActon =await StockManagModel.findByIdAndUpdate({ _id: actionid }, {itemId, movement, Quantity,cost,oldCost, unit, Balance,oldBalance, price,actionBy })
        res.status(200).json(updatedActon);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

const getAllStockActions =async (req, res) =>{
    try {
        const allaction =await StockManagModel.find({})
        res.status(200).json(allaction)
    } catch (error) {
        res.status(404).json({ message : error.message});
    }
}


const getoneStockActions =async (req, res) =>{
    try {
        const actionid =await req.params.actionid;
        const action = await StockManagModel.findById(actionid)
        res.status(200).json(action)
    } catch (error) {
        res.status(404).json({ message : error.message});
    }
}

const DeleteStockAction= async (req, res) => {
    try {
        const actionid = await req.params.actionid;
        const deletedAction =await StockManagModel.findByIdAndDelete(actionid)
        res.status(200).json(deletedAction)
    } catch (error) {
        res.status( 404 ).json({message: error.message});
  }
}


module.exports = {createStockAction, UpdateStockAction,getoneStockActions, getAllStockActions, DeleteStockAction }