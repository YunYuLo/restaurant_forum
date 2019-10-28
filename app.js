const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const db = require('./models') //include DB
const bodyParser = require('body-parser')
const port = 3000

//view engine
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

//include routes
require('./routes')(app)

app.listen(port, () => {
  db.sequelize.sync() //sync DB
  console.log(`Example app listening on port ${port}!`)
})