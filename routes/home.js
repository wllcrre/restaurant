// routes/todo.js
const express = require('express')

//呼叫 Express 的 middleware Router，並放到 router 這個常數裡，讓之後使用更方便。
const router = express.Router()

const Restaurant = require('../models/restaurant')


router.get('/', (req, res) => {

  // res.render('index', { restaurants: restaurantList })

  Restaurant.find((err, restaurants) => {
    if (err) return console.log(err)
    return res.render('index', { restaurants: restaurants })
  })
})


// setup Router
module.exports = router  //會把這個 router 的設定 export 到 router.js 裡。