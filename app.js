// require packages used in the project
const express = require('express')
const app = express()
const port = 3000

// require express-handlebars here
const exphbs = require('express-handlebars')

const restaurantList = require('./restaurant.json')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {

  // past the number list into 'index' partial template
  // res.render('index', { restaurants: restaurantList })
  res.render('index', { restaurants: restaurantList.results })

})


app.get('/', (req, res) => {
  // past the movie data into 'index' partial template
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {

  //注意：是  restaurant.id 不是 restaurant
  //restaurant => restaurant.id == req.params.restaurant_id  這是 arror function
  const restaurant = restaurantList.results.filter(restaurant => restaurant.id == req.params.restaurant_id)

  res.render('show', { restaurant: restaurant[0] })
})

app.get('/restaurants/:restaurant_id/edit', (req, res) => {

  //注意：是  restaurant.id 不是 restaurant
  //restaurant => restaurant.id == req.params.restaurant_id  這是 arror function
  const restaurant = restaurantList.results.filter(restaurant => restaurant.id == req.params.restaurant_id)

  res.render('edit', { restaurant: restaurant[0] })
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
