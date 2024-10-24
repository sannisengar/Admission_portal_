const express = require('express')
const app = express()
const port = 3000
const web = require('./routes/web')
const connectDb = require('./db/connectdb')
const fileUpload = require("express-fileupload")
const cookieparser = require('cookie-parser')
app.use(cookieparser())

// html css set
app.set('view engine', 'ejs')
// Css  image link
app.use(express.static('public'))
//fileupload image
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true
}))
// connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash')
// messages
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}))
// flash message
app.use(flash())
//connect db
connectDb()
app.use(express.urlencoded({ extended: true }))

//routeing set
app.use('/', web)




// server create
app.listen(port, () => {
    console.log(`Server start localhost: ${port}`)
})
