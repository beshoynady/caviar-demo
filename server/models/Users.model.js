const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    username :{
        type : String,
        unique : true,
        require : [ true, 'required username' ],
        trim : true,
        minlength : 3,
        maxlength : 100,
    },
    email : {
        type : String,
        unique : true,
        require : [ true, 'required email'],
        maxlength : 100,
        minlength : 10,
        trim : true,
    },
    password : {
        type : String,
        trim : true,
        require : [true , 'password required'],
        maxlength : 200,
        minlength : 3,
    },
    address:{
        type:String,
        trim: true,
        minlength:3,
        maxlength: 150,
        
    },
    phone:{
        type : String,
        require : [true , 'phone required'],
        trim : true,
        length: 11,
    },
    isAdmin :{
        type : Boolean,
        default : false
    },
    role :{
        type : String,
        enum : ['manager', 'casher', 'waiter', 'Chef','user'],
        default : 'user',
    },
    salary : {
        type : Number,
        min : 10,
    },

    isVarified :{
        type : Boolean,
        default : false
    },
    isActive :{
        type: Boolean,
        default : true,
        require : [true , 'isActive required'],
    }
    
},
{timestamp: true}
);

const Usermodel = mongoose.model('User', userschema);

module.exports = Usermodel;

