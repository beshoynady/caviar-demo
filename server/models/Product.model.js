const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      unique: [true, 'Name must be unique'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      minlength: [2, 'Name must have at least 2 characters'],
    },
    Recipe: [
      {
        itemId: {
          type: ObjectId,
          ref: 'StockItem',
          trim: true,
          required: [true, 'Item ID is required'],
        },
        name: {
          type: String,
          trim: true,
          required: [true, 'Name is required'],
        },
        amount: {
          type: Number,
          required: [true, 'Amount is required'],
        },
        unit: {
          type: String,
          trim: true,
          required: [true, 'Unit is required'],
        },
        costofitem: {
          type: Number,
          required: [true, 'Cost of item is required'],
        },
        totalcostofitem: {
          type: Number,
          required: [true, 'Total cost of item is required'],
        },
      },
    ],
    totalcost: {
      type: Number,
      required: [true, 'Total cost is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [100, 'Description cannot exceed 100 characters'],
      minlength: [3, 'Description must have at least 3 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      max: [10000, 'Price cannot exceed 10000'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      required: [true, 'Discount is required'],
      min: [0, 'Discount cannot be negative'],
      default: 0,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: props => `${props.value} is not a valid value for discount`,
      },
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, 'Price after discount cannot be negative'],
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
      required: [true, 'Quantity is required'],
    },
    numberofcomments: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    avaliable:{
      type: Boolean,
      default: true,
      required: true
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
