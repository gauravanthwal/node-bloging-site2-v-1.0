require('dotenv').config()
const port = process.env.PORT || 3000;
const path = require('path')
const express = require('express')
const app = express()
const expressEjsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')


const indexRoute = require('./routes/index')
const userRoute = require('./routes/userRoute')

// cookie parser
app.use(cookieParser())

// session 
app.use(session({ secret: 'prcoess.env.SESSION_KEY', resave: false, saveUninitialized: false}))
// set public 
app.use(express.static(path.join(__dirname, 'public')))

// set views
app.use(expressEjsLayouts)
app.set('view engine', 'ejs')

// bodyParser
app.use(express.urlencoded({ extended: false}))
app.use(flash())

// route handle
app.use('/', indexRoute)
app.use('/user', userRoute)


app.listen(port, ()=> console.log('server is up on the port ', port))

