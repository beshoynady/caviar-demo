const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const EmployeeSalarySchema = new mongoose.Schema(
  {
    EmployeeId: {
      type: ObjectId,
      ref: 'Employee',
      require: true,
    },
    EmployeeName: {
      type: String,
      require: true,
    },
    movement: {
      type: String,
      enum: ['سلف', 'خصم', 'غياب','اضافي','مكافأة'],
      require: true
    },
    Amount: {
      type: Number,
      default: 0,
      require: true,
    },
    oldAmount:{
      type: Number,
      require: true,
    },
    newAmount:{
      type: Number,
      require: true,
    }, 
    actionBy: {
      type: ObjectId,
      ref: 'employees',
      require: true
    },
    actionAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
     }
  },
  {
    timestamps: true,
  }
)


const EmployeeSalaryModel = mongoose.model('EmployeeSalary', EmployeeSalarySchema)
module.exports = EmployeeSalaryModel
