const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const StockManagSchema = new mongoose.Schema(
  {
    itemId: {
      type: ObjectId,
      ref: 'StockItems',
      require: true,
    },
    unit: {
      type: String,
      require: true,
    },
    movement: {
      type: String,
      enum: ['مشتريات', 'منصرف', 'راجع'],
      require: true
    },
    Quantity: {
      type: Number,
      default: 0,
      require: true,
    },
    oldBalance:{
      type: Number,
      require: true,
    },
    Balance:{
      type: Number,
      require: true,
    }, 
    price: {
      type: Number,
      require: true,
    },
    oldCost: {
      type: Number,
      require: true,
    },
    cost: {
      type: Number,
      require: true,
    },
    actionBy: {
      type: ObjectId,
      ref: 'User',
      require: true
    },
    actionAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
      default: Date.now
     }
  },
  {
    timestamps: true,
  }
)


const StockManagModel = mongoose.model('StockManag', StockManagSchema)
module.exports = StockManagModel
