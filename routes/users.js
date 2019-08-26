// routes/users.js
const express = require('express')
//呼叫 Express 的 middleware Router，並放到 router 這個常數裡，讓之後使用更方便。

const router = express.Router()
const User = require('../models/users')


router.get('/register', (req, res) => {
  return res.render('register')
})
router.get('/login', (req, res) => {
  return res.render('login')
})



router.post('/register', (req, res) => {

  const { name, email, password, password2 } = req.body

  User.findOne({ email: email }).then(user => {
    if (user) {

      console.log('User already exist')

      res.render('register', {
        name,
        email,
        password,
        password2
      })
    } else {
      const newUser = new User({
        name,
        email,
        password
      })

      newUser
        .save()
        .then(user => {
          res.redirect('/')
        })
        .catch(err => console.log(err))

    }
  })


})




// setup Router
module.exports = router  //會把這個 router 的設定 export 到 router.js 裡。