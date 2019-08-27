// routes/todo.js
const express = require('express')

//呼叫 Express 的 middleware Router，並放到 router 這個常數裡，讓之後使用更方便。
const router = express.Router()

const Restaurant = require('../models/restaurant')

// 載入 auth middleware 裡的 authenticated 方法
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {

  // res.render('index', { restaurants: restaurantList })

  Restaurant.find({ userId: req.user._id })
    .sort({ name: 'asc' })
    .exec(
      (err, restaurants) => {                  // 把 restaurants model 所有的資料都抓回來
        if (err) return console.error(err)
        return res.render('index', { restaurants: restaurants })  // 將資料傳給 index 樣板
      })
})


// setup Router
module.exports = router  //會把這個 router 的設定 export 到 router.js 裡。