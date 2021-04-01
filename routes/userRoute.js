const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const auth = require("../auth/auth");

router.get("/register", (req, res) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  } else {
    message = null;
  }
  res.render("register", { errorMessage: message });
});
router.get("/login", (req, res) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }else {
    message = null;
  }
  res.render("login",{ errorMessage : message});
});

router.post( "/register",async (req, res) => {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        req.flash('error', 'All fields are required!')
        return res.redirect("/user/register");
      }
      if(password.length < 6 ){
        req.flash('error', 'password must be at least 6 character long!')
        return res.redirect('/user/register')
      }
      const user = await User.findOne({ email: email })
        if (user) {
          req.flash('error', 'User already exists')
          return res.redirect("/user/register");
        }

      const newUser = new User({ name, email, password });
      const token = await newUser.generateAuthToken();
      console.log(token);
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 1000 * 60 * (60 * 24 * 30)),
        httpOnly: true,
      });
      newUser.save((err, user) => {
        console.log(user);
        res.redirect("/blogs");
      });
    } catch (err) {
      console.log(err);
    }
  }
);
router.post("/login",async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        req.flash('error', 'All fields are required!')
        return res.redirect("/user/login");
      }
      const newUser = await User.findOne({ email: email }, (err, user) => {
        if(!user){
          req.flash('error', 'No user exist with that E-mail!')
          return res.redirect('/user/login')
        }
        if (!bcrypt.compareSync(password, user.password)) {
          req.flash('error', 'Password is Incorrect!')
          return res.redirect("/user/login");
        }
      });
      const token =  await newUser.generateAuthToken();
      res.cookie('jwt', token, {
          expires: new Date(Date.now() + 1000*60*(60*24*30)),
          httpOnly: true
      })
      res.redirect('/blogs')
    } catch (err) {
      console.log(err);
    }
  }
);

router.get("/logout", auth, async (req, res) => {
  try {
    
    req.user.tokens = [];
    res.clearCookie("jwt");
    req.user.save()
    res.redirect("/user/login");
  } catch (err) {
    console.log(err);
  }
});


router.get('/profile',auth, async(req,res)=>{
  try {
    res.render('userProfile',{ user: req.user})
  } catch (err) {
    console.log(err);
  }
})

router.post('/profile',auth, async(req,res)=>{
  try {
    const userId = req.user.id;
    const updatedData = {
      name: req.body.name,
      email: req.body.email
    }
    await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true},(err, user)=>{
      if(err){
        console.log(err);
      }
      return res.redirect('/user/profile')
    })

  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
