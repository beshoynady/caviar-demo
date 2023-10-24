const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const StockItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      require: true,
      unique: true
    },
    
    largeUnit: {
      type: String,
      require: true,
    },
    Balance: {
      type: Number,
      require: true,
      default: 0,
    },
    price: {
      type: Number,
      require: true,
      default: 0,
    },
    totalCost: {
      type: Number,
      require: true,
      default: 0,
    },
    smallUnit:{
      type: String,
      require: true,
    },
    parts: {
      type: Number,
      require: true,
    },
    costOfPart: { 
      type : Number,
      require: true
    },
    createAt: {
      type: Date,
    },
    createBy: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)
const StockItemModel = mongoose.model('StockItem', StockItemSchema)
module.exports = StockItemModel
