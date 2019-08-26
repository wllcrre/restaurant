// require packages used in the project
const express = require('express')
const app = express()
const port = 4000

// require express-handlebars here
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })
const db = mongoose.connection


db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongndb connected restaurant db!')
})

// 載入 restaurant Model
const Restaurant = require('./models/restaurant')
// hereee  error !!!!

const restaurantList = require('./restaurant.json')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.use('/', require('./routes/home'))
app.use('/users', require('./routes/users'))

app.use('/restaurants', require('./routes/restaurant'))

app.get('/search', (req, res) => {
  //req.query 取得？後的參數值
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    //return restaurant.name.includes(keyword)
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })

  res.render('index', { restaurants: restaurants, keyword: keyword })
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
