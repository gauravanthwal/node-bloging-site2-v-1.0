const express = require('express')
const Post = require('../models/posts')
const User = require('../models/user')
const auth = require('../auth/auth')
const router = express.Router()

router.get('/',(req,res)=>{
    res.redirect('/user/login')
})

router.get('/blogs', auth,  async(req, res)=>{
    try {
        let isLoggedIn = false;
        if(req.cookies !== 'undefined'){
            isLoggedIn = true;
        }
        const posts = await Post.find()
        res.render('index.ejs', { posts, isLoggedIn, userName: req.user.name })
    } catch (err) {
        console.log(err);
    }
})

router.get('/dashboard',auth, async (req,res)=>{
    try {
        const posts = await Post.find({author: req.user.id})
        res.render('dashboard.ejs',{ posts })
    } catch (err) {
        
    }
})
router.post('/dashboard', auth, async(req,res)=>{
    try {
        const { title, body } = req.body;
        const newPost = new Post({
            title,
            body,
            author: req.user._id
        })
        await newPost.save((err, post)=>{
            if(err){
                console.log(err);
            }
            res.redirect('/blogs')
        })
    } catch (err) {
        console.log(err);
    }
})

router.get('/dashboard/edit/:id',auth , async(req,res)=>{
    const post = await Post.findById(req.params.id)
    res.render('edit', { post })
})
router.get('/dashboard/delete/:id', auth, async(req,res)=>{
    await Post.findByIdAndDelete(req.params.id)
    res.redirect('/dashboard')
})
router.post('/dashboard/edit/:id', auth, async(req,res)=>{
    const id = req.params.id;
    const update = {
        title: req.body.title,
        body: req.body.body
    }
    const updatedInfo = await Post.findByIdAndUpdate(id, update, { new: true, runValidators: true })
    res.redirect('/dashboard')
})

router.get('/post/:id', auth, async(req,res)=>{
    try {
        const id = req.params.id;
        await Post.findOne({ _id: id}, (err, post)=>{
            res.render('post',{ post , author: req.user.name})
        })
        
    } catch (err) {
        
    }
})

module.exports = router;