const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const EmployeeSalarySchema = new mongoose.Schema(
  {
    EmployeeId: {
      type: ObjectId,
      ref: 'StockItems',
      require: true,
    },
    Employeename: {
      type: String,
      require: true,
    },
    movement: {
      type: String,
      enum: ['سلف', 'خصم', 'غياب','اضافي','','','','','','','','','','','','','',''],
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


const EmployeeSalaryModel = mongoose.model('EmployeeSalary', EmployeeSalarySchema)
module.exports = EmployeeSalaryModel
