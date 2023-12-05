const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

// Define common validation for number fields
const defaultOptions = {
    type: Number,
    default: 0,
    required: true,
    min: 0,
    max: 1000000,
    trim: true,
};

const OrderSchema = new mongoose.Schema({
   // Serial number of the order
   serial: {
    type: String,
    default: '000001',
    required: true,
    unique: true,
    validate: {
        validator: function(v) {
            return /^[0-9]{6}$/.test(v);
        },
        message: '{VALUE} is not a valid serial number'
    }
},
    // Order number
    ordernum: {
        type: Number,
        min: 1,
        max: 1000000,
    },
    // Array of products in the order
    products: [
        {
            productid: {
                type: ObjectId,
                ref: 'Product',
            },
            // Product name
            name: {
                type: String,
                required: true,
                trim: true,
            },
            // Quantity of the product
            quantity: {
                ...defaultOptions,
                validate: {
                    validator: function (v) {
                        return v >= 1 && v <= 1000000;
                    },
                    message: '{VALUE} is not a valid quantity',
                },
            },
            // Notes for the product
            notes: {
                type: String,
                default: "",
            },
            // Price of the product
            price: {
                ...defaultOptions,
                validate: {
                    validator: function (v) {
                        return v >= 1 && v <= 1000000;
                    },
                    message: '{VALUE} is not a valid price',
                },
            },
            priceAfterDiscount:{
                ...defaultOptions,
            },
            // Total price of the product quantity
            totalprice: {
                ...defaultOptions,
            },
            // Indicates if the product is done
            isDone: {
                type: Boolean,
                default: false,
                required: true,
            },
            // Indicates if the product is to be added
            isAdd: {
                type: Boolean,
                default: false,
                required: true,
            }
        }
    ],
    subTotal: {
        type: Number,
        required: true,
        default:0,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: '{VALUE} should be greater than zero'
        }
    },
    // Tax for the order
    tax: {
        type: Number,
        default: 0,
        required: true,
    },
    // Delivery cost of the order
    deliveryCost: {
        type: Number,
        default: 0,
        required: true
    },
    // Total cost of the order
    total: {
        type: Number,
        required: true,
        default:0,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: '{VALUE} should be greater than zero'
        }
    },
    // Table associated with the order

    table: {
        type: ObjectId,
        ref: 'Table',
        default: null
    },
    
    // User associated with the order
    user: {
        type: ObjectId,
        ref: 'User',
        default: null
    },
    // Created by employee
    createBy: {
        type: ObjectId,
        ref: 'Employee',
        default: null
    },
    // Cashier employee
    casher: {
        type: ObjectId,
        ref: 'Employee',
        default: null
    },

    // Customer name
    name: {
        type: String,
        minLength: 3
    },
    // Customer address
    address: {
        type: String,
        default: null,
    },
    // Customer phone number
    phone: {
        type: String,
        default: null,
    },
    // Waiter serving the order
    waiter: {
        type: ObjectId,
        ref: 'Employee',
        default: null
    },
    // Delivery person for the order
    deliveryMan: {
        type: ObjectId,
        ref: 'Employee',
        default: null
    },
    // Help status for the order
    help: {
        type: String,
        default: 'Not requested',
        required: true,
        enum: ['Not requested', 'Requests assistance', 'Requests bill', 'Send waiter', 'On the way', 'Assistance done'],
    },
    // Status of the order
    status: {
        type: String,
        default: 'Pending',
        required: true,
        enum: ['Pending', 'Approved', 'Preparing', 'Prepared', 'On the way', 'Delivered', 'Cancelled'],
    },
    // Type of order (internal, delivery, takeout)
    order_type: {
        type: String,
        enum: ['Internal', 'Delivery', 'Takeaway'],
        default: 'Internal',
        required: true
    },
    // Indicates if the order is active
    isActive: {
        type: Boolean,
        default: true,
        required: true,
    },
    // Payment status of the order
    payment_status: {
        type: String,
        default: 'Pending',
        required: true,
        enum: ['Pending', 'Paid'],
        trim: true,
    },
    // Date of payment
    payment_date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    // Payment method used
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
}, { timestamps: true });

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
