require('dotenv').config()

const express = require('express')
const { pages, apis } = require('./routes')


const app = express()
const port = process.env.PORT || 3000

const cors = require('cors')

// app.all('/', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://eric9530873.github.io");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
// })

// app.options('*', cors({
//     origin: 'https://eric9530873.github.io'
// }))

// app.use(cors({
//     origin: 'https://eric9530873.github.io'
// }))
app.use(cors())

const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const session = require('express-session')
const SESSION_SECRET = 'secret'
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

const passport = require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

const { getUser } = require('./helpers/auth-helpers')

const flash = require('connect-flash')
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    res.locals.user = getUser(req)
    next()
})

const path = require('path')
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use('/api', apis)
app.use(pages)

const handlebarsHelpers = require('./helpers/handlebars-helpers')
const handlebars = require('express-handlebars')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers, handlebars: allowInsecurePrototypeAccess(Handlebars) }))
app.set('view engine', 'hbs')



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app

