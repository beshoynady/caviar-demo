const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const KitchenConsumptionSchema = new mongoose.Schema(
  {
    stockItemId: {
      type: ObjectId,
      ref: 'StockItem',
      required: true,
    },
    quantityTransferredToKitchen: {
      type: Number,
      required: true,
    },
    consumptionQuantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    adjustment: {
      type: Boolean,
      default: false,
    },
    productsProduced: [{
      productId: {
        type: ObjectId,
        ref: 'Product',
        required: true,
      },
      productName: { 
        type : 'string', 
        required: true
      },
      productionCount: {
        type: Number,
        required: true,
      },
    }],
    createBy:{
      type: ObjectId,
      ref: 'Employee',
      required: true,

    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const KitchenConsumptionModel = mongoose.model('KitchenConsumption', KitchenConsumptionSchema);

module.exports = KitchenConsumptionModel;
