const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'required'],
        maxlength: 50,
        minlength: 2,
        unique: [true,'unique'],
    },
    description:{
        type: String,
        required : [true,'required'],
        maxlength: 100,
        minlength : 3,
    },
    price : {
        type : Number,
        required : [true,'required'],
        max: 10000,
        min: 0,
    },
    discount : {
        type : Number,
        required : [true,'required'],
        min: 0,
        default : 0,
        validate : {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} is not a valid value`
        }
    },

    quantity: {
        type : Number,
        default : 0,
        required : [true,'required'],
    },
    numberofcomments:{
        type : Number,
        default : 0,
    },
    sales:{
        type : Number,
        default : 0,
    },
    category : {
        type : ObjectId,
        ref : 'Category',
        required : [true,'required'],
    },
    ratingsAvrage : {
        type : Number,
        min : [1, 'min'],
        max : [5, 'max'],
    },
    retingsQuantity : {
        type : Number,
        default : 0,
    },    
    image : {
        type : String,
        // required : [true,'required'],
    }
},
{timestamp: true}
)


const Productmodel = mongoose.model('Product', productSchema)

module.exports = Productmodel