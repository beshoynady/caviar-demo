const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const TableSchema = new mongoose.Schema(
    {
        tablenum: {
            type:  Number,
            required: true,
            unique: true,
            trim: true,
            min: 1,
            max: 100000,
            validate: {
                validator: function (v) {
                    return v > 0
                },
                message: '{VALUE} is not a valid table number'
            }
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100,
        },
        chairs: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
            default: 1,
            validate: {
                validator: function (v) {
                    return v > 0
                },
                message: '{VALUE} is not a valid number of chairs'
            }
        },
        isValid:{
            type : Boolean,
            default: true,
        },
        reservation:{
            type:ObjectId,
            ref:'User',
            default: null,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
            trim: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            trim: true,
        },
        deletedAt: {
            type: Date,
            default: null,
            trim: true,
        }
    },{
        timestamps: true,
    }

)
const TableModel= mongoose.model('Table', TableSchema);
module.exports = TableModel

