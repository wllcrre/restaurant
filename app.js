// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

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
  console.log('mongndb connected 123!')
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
app.get('/', (req, res) => {

  // res.render('index', { restaurants: restaurantList })

  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)
    return res.render('index', { restaurants: restaurants })
  })
})

app.get('/restaurants/:id', (req, res) => {

  //注意：是  restaurant.id 不是 restaurant
  //restaurant => restaurant.id == req.params.restaurant_id  這是 arror function
  // const restaurant = restaurantList.results.filter(restaurant => restaurant.id == req.params.restaurant_id)

  // res.render('show', { restaurant: restaurant[0] })


  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('show', { restaurant: restaurant })
  })


})

app.get('/restaurants/:id/edit', (req, res) => {

  //注意：是  restaurant.id 不是 restaurant
  //restaurant => restaurant.id == req.params.restaurant_id  這是 arror function
  // const restaurant = restaurantList.results.filter(restaurant => restaurant.id == req.params.restaurant_id)

  // res.render('edit', { restaurant: restaurant[0] })


  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('edit', { restaurant: restaurant })
  })

})

// Modify a restaurant
app.post('/restaurants/:id', (req, res) => {

  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)

    restaurant.name = req.body.name
    restaurant.name_en = req.body.name_en
    restaurant.category = req.body.category
    restaurant.image = req.body.image
    restaurant.location = req.body.location
    restaurant.phone = req.body.phone
    restaurant.google_map = req.body.google_map
    restaurant.rating = req.body.rating
    restaurant.description = req.body.description

    restaurant.save((err) => {
      if (err) return console.log(err)
      return res.redirect('/')
    })

    //save to model
  })

})



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
