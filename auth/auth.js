const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: verifyToken._id})

        req.user = user;

        next()
    } catch (err) {
        console.log(err);
    }
}
module.exports = auth;