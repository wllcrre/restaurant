// routes/todo.js
const express = require('express')

//呼叫 Express 的 middleware Router，並放到 router 這個常數裡，讓之後使用更方便。
const router = express.Router()

const Restaurant = require('../models/restaurant')


//　在每一個 router 上都加上驗證，驗證使用者是否已經登入
const { authenticated } = require('../config/auth')


// create new restaurant page
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})

router.get('/:id', authenticated, (req, res) => {

  //注意：是  restaurant.id 不是 restaurant
  //restaurant => restaurant.id == req.params.restaurant_id  這是 arror function
  // const restaurant = restaurantList.results.filter(restaurant => restaurant.id == req.params.restaurant_id)

  // res.render('show', { restaurant: restaurant[0] })


  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('show', { restaurant: restaurant })
  })


})

router.get('/:id/edit', authenticated, (req, res) => {

  //注意：是  restaurant.id 不是 restaurant
  //restaurant => restaurant.id == req.params.restaurant_id  這是 arror function
  // const restaurant = restaurantList.results.filter(restaurant => restaurant.id == req.params.restaurant_id)

  // res.render('edit', { restaurant: restaurant[0] })


  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)
    return res.render('edit', { restaurant: restaurant })
  })

})

// Create a restaurant
router.post('/', authenticated, (req, res) => {

  Restaurant.create()

  const restaurant = new Restaurant({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })

  restaurant.save((err) => {
    if (err) console.log(err)
    return res.redirect('/')
  })

})

// Modify a restaurant
router.post('/:id', authenticated, (req, res) => {

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

// delete a restaurant
router.post('/:id/delete', authenticated, (req, res) => {

  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.log(err)

    restaurant.remove((err) => {
      if (err) return console.log(err)
      return res.redirect('/')
    })
  })

})



// setup Router
module.exports = router  //會把這個 router 的設定 export 到 router.js 裡。