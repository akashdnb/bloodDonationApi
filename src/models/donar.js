const mongoose = require('mongoose');
const validator = require('validator');

const donarSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:3
    },
    bloodGroup:{
        type: String,
        required: true
    },
    phone:{
        type:Number,
        minlength:10,
        maxlength:10,
        required:true,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique:[true,"Email id already present"],
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Error")
            }
        }
    },
    state:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    availability:{
        type:Boolean,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    }
})

donarSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
   }

const donar= new mongoose.model('donars', donarSchema);
module.exports= donar;