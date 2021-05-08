const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({

    firstName : {
        type : String,
        required: true
    },
    lastName : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true,
        unique: true
    },
    password : {
        type : String,
        required: true
    },
    confirmPassword : {
        type : String,
        required: true
    },
    tokens: [{
        token : {
            type : String,
            required: true
        }
    }]
})

employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const generated_token = jwt.sign({_id: this._id}, "mynameissiddheshkulkarniwebdeveloper");
        this.tokens = this.tokens.concat({token : generated_token});
        await this.save();
        return token;
    }
    catch(e)
    {
        res.send("the error is "+ e);
        console.log(e);
    }
}

/* employeeSchema.pre("save", async function(next) {

    console.log(`the current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password , 10);

    console.log(`the updated pawssword is ${this.password}`);
    next();
}); */ 

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;