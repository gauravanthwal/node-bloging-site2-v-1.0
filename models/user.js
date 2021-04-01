const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('./posts')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 6)
    }
    next()
})

userSchema.methods.validatePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
        this.tokens = this.tokens.concat({ token })
        await this.save()
        return token;
    } catch (err) {
        console.log(err);
    }
}

module.exports = mongoose.model('User',userSchema)