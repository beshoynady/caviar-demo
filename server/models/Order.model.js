const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const OrderSchema = new mongoose.Schema({
    serial: {
        type: Number,
        unique: true,
        required: true,
        min: 1,
        max: 1000000,
        trim: true,
        validate: {
            validator: function (v) {
                return v >= 1 && v <= 1000000;
            },
            message: '{VALUE} is not a valid sirial number'
        }
    },
    ordernum:{
        type : Number,
        min: 1,
        trim: true, 
    },

    products: [
        {
            productid: {
                type: ObjectId,
                ref: 'Product',
            },
            name: {
                type: String,
                required: true,
                trim: true,
            },

            quantity: {
                type: Number,
                required: true,
                min: 1,
                max: 1000000,
                trim: true,
                validate: {
                    validator: function (v) {
                        return v >= 1 && v <= 1000000;
                    },
                    message: '{VALUE} is not a valid quantity'
                }
            },
            notes:{
                type: String,
                default: ""
            },
            price: {
                type: Number,
                required: true,
                min: 1,
                max: 1000000,
                trim: true,
                validate: {
                    validator: function (v) {
                        return v >= 1 && v <= 1000000;
                    },
                    message: '{VALUE} is not a valid price'
                }
            },
            totalprice: {
                type: Number,
                min: 1,
                max: 1000000,
                trim: true,
            },
            isDone:{
                type: Boolean,
                default: false,
                required: true,
            },
            isAdd:{
                type: Boolean,
                default: false,
                required: true, 
            }
        }
    ],
    total: {
        type: Number,
        default: 0
    },
    table: {
        type: ObjectId,
        ref: 'Table',
        default: null
    },
    user: {
        type: ObjectId,
        ref: 'User',
        default: null
    },
    employee: {
        type: ObjectId,
        ref: 'User',
        default: null
    },
    name: {
        type: String,
        minLength: 3
    },
    address: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
        },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },

    waiter:{
        type: ObjectId,
        ref: 'User',
        default: null
    },
    deliveryMan:{
        type: ObjectId,
        ref: 'User',
        default: null
    },
    help:{
        type: String,
        default: 'لم يطلب',
        required: true,
        enum: ['لم يطلب', 'يطلب مساعدة','يطلب الفاتورة','ارسال ويتر','في الطريق','تمت المساعدة'],
    },
    status: {
        type: String,
        default: 'انتظار',
        required: true,
        enum: ['انتظار', 'موافق','جاري التحضير','تم التحضير','في الطريق','تم التوصيل', 'ملغي'],
    },
    order_type: {
        type: String,
        enum: ['داخلي', 'ديلفري','تيك اوي'],
        default : 'داخلي',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },
    
    payment_status: {
        type: String,
        default: 'انتظار',
        required: true,
        enum: ['انتظار', 'تم الدفع'],
        trim: true,
    },
    payment_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    payment_method: {
        type: String,
        default: 'Cash',
        required: true,
        enum: ['Cash', 'Credit Card'],
        trim: true,
        validate: {
            validator: function (v) {
                return v === 'Cash' || v === 'Credit Card';
            },
            message: '{VALUE} is not a valid payment method'
        }
    },
}, { timestamps: true }
);


const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel
