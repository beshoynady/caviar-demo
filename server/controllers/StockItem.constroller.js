const StockItemsModel = require('../models/StockItems.model');


const CreateStockItem = async (req, res) => {
    try {
        const itemName = await req.body.itemName;
        const categoryId = await req.body.categoryId;
        const largeUnit = await req.body.largeUnit;
        const smallUnit = await req.body.smallUnit;
        const Balance = await req.body.Balance;
        const price = await req.body.price;
        const totalCost = await req.body.totalCost;
        const Parts = await req.body.Parts;
        const costOfPart = await req.body.costOfPart;
        const createBy = await req.body.createBy;             
        const createAt = await req.body.createAt;      

        const newstockitem = await StockItemsModel.create({ itemName,categoryId, largeUnit,smallUnit,costOfPart,Parts,totalCost, price,Balance, createBy, createAt });
        
        newstockitem.save();
        res.status(200).json(newstockitem);
    } catch (err) {
        res.status(400).json(err)
    }
}



const getAllStockItems = async (req, res) => {
    try {
        const allItems = await StockItemsModel.find({});
        res.status(200).json(allItems);
    } catch (err) {
        res.status(400).json(err)
    }
}


const getoneItem = async (req, res) => {
    try {
        const itemId =await req.params.itemId;
        const oneItem = await StockItemsModel.findById(itemId);
        res.status(200).json(oneItem);
    } catch (err) {
        res.status(400).json(err)
    }
}

const updateStockItem = async (req, res) => {
    try {
        const itemId = await req.params.itemId;
        const itemName = await req.body.itemName;
        const categoryId = await req.body.categoryId;
        const largeUnit = await req.body.largeUnit;
        const smallUnit = await req.body.smallUnit;
        const Balance = await req.body.Balance;
        const price = await req.body.price;
        const totalCost = await req.body.totalCost;
        const Parts = await req.body.Parts;
        const costOfPart = await req.body.costOfPart;
        const createBy = await req.body.createBy;             

        const updatedstockitem = await StockItemsModel.findByIdAndUpdate({_id: itemId },{ itemName, categoryId,largeUnit,smallUnit,costOfPart,Parts,totalCost, price,Balance, createBy}, { new: true });
        res.status(200).json(updatedstockitem);
    } catch (err) {
        res.status(500).json({ err: err });
    }
}

const movements = async(req, res)=>{
    try {
        const itemId = await req.params.itemId;
        const Balance = await req.body.newBalance;
        const price = await req.body.price;
        const totalCost = await req.body.newcost;

        const moveedstockitem = await StockItemsModel.findByIdAndUpdate({ _id: itemId },{ Balance, totalCost, price}, { new: true });        
        res.status(200).json(moveedstockitem)        
    } catch (error) {
        res.status(500).json(error);
    }

}

const deleteItem = async (req, res) => {
    try {
        const itemId = await req.params.itemId;
        const itemdelete = await StockItemsModel.findByIdAndDelete(itemId);
        res.status(200).json(itemdelete);
    } catch (err) {
        res.status(500).json(err)
    }
}



module.exports = { CreateStockItem, getAllStockItems, getoneItem, updateStockItem,movements, deleteItem }