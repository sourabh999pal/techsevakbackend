const mongoose = require('mongoose')
const conn = require('../config/db')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const paymentdetailSchema = new mongoose.Schema({
    name:String,
    email:String,
    payments:Array,
    userId:String,
    serviceId:String,
    status:String,
    paymentid:String,
    orderid:String
    
});

const paymentdetail = mongoose.model('paymentdetail', paymentdetailSchema);

const otpSchema = new mongoose.Schema({
    email:String,
    code:String,
    expiresIn:Number  
},{
    timestamps:true
});

const otp = mongoose.model('otp', otpSchema , 'otp');

const dataSchema = new mongoose.Schema({
    name:String,
    mobile:String,
    address:String,
    city:String,
    state:String,
    pincode:String,
    servicename:String,
    paymentstatus:String,
    status:String,
    payment:String,
    userid:String,
   
},{
    timestamps:true
});

const data = mongoose.model('data', dataSchema);


var userSchema = new mongoose.Schema({
   
    name:String,
    email:String,
    mobile:String,
    password:{
        type:String,
        select:true
    },
    tokens:[
        {
            token:{
                type:String,
                require:true
            }
        }
    ],
    
    datas:[{
        data:String,
        
    }]
    
},{
    timestamps:true
})





userSchema.pre('save',function(next){   
var salt = bcrypt.genSaltSync(10);
if(this.password && this.isModified('password')){
    this.password =  bcrypt.hashSync(this.password, salt);
}
 next();
})

userSchema.methods.getAuthToken = async function(data){
    let params = {
        id:this._id,
        email:this.email,
        name:this.name
    }
    var tokenValue = jwt.sign(params, process.env.SECRETKEY,{expiresIn:'300000s'});
    this.tokens = this.tokens.concat({token:tokenValue})
    await this.save();
    return tokenValue;
}

let users = conn.model('users',userSchema)
module.exports = {users, data, paymentdetail, otp};