const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const db = require('./models') //include DB
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const port = process.env.PORT || 3000

//view engine
app.engine('handlebars', handlebars())
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebar-helpers')
}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize()) //init passport
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.use('/upload', express.static(__dirname + '/upload'))

//include routes
// require('./routes')(app, passport)
require('./routes')(app)

app.listen(port, () => {
  // db.sequelize.sync() //sync DB
  console.log(`Example app listening on port ${port}!`)
})