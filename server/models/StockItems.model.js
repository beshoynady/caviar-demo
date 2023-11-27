const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const StockItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      unique: true
    },
    categoryId: {
      type: ObjectId,
      ref: 'CategoryStock',
      required: true,
    },
    largeUnit: {
      type: String,
      required: true,
    },
    Balance: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    smallUnit:{
      type: String,
      required: true,
    },
    parts: {
      type: Number,
      required: true,
    },
    costOfPart: { 
      type : Number,
      require: true
    },
    createBy: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
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
