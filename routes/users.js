// routes/users.js
const express = require('express')
//呼叫 Express 的 middleware Router，並放到 router 這個常數裡，讓之後使用更方便。

const router = express.Router()
const User = require('../models/users')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/register', (req, res) => {
  return res.render('register')
})
router.get('/login', (req, res) => {
  return res.render('login')
})

// 登入檢查
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {                    // 使用 passport 認證
    successRedirect: '/',                             // 登入成功會回到根目錄
    failureRedirect: '/users/login'                   // 失敗會留在登入頁面
  })(req, res, next)
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()

  // 加入訊息提示
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/users/login')
})

router.post('/register', (req, res) => {

  const { name, email, password, password2 } = req.body

  // 加入錯誤訊息提示
  let errors = []

  if (!name || !email || !password || !password2) {
    errors.push({ message: '所有欄位都是必填' })
  }
  if (password !== password2) {
    errors.push({ message: '密碼輸入錯誤' })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {

    User.findOne({ email: email }).then(user => {
      if (user) {

        // console.log('User already exist')
        errors.push({ message: '這個 Email 已經註冊過了' })

        res.render('register', {
          errors,
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

        // 先用 genSalt 產生「鹽」，第一個參數是複雜度係數，預設值是 10
        bcrypt.genSalt(10, (err, salt) =>
          // 再用 hash 把鹽跟使用者的密碼配再一起，然後產生雜湊處理後的 hash
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash

            // 用 bcrypt 處理密碼後，再把它儲存起來
            newUser
              .save()
              .then(user => {
                res.redirect('/')
              })
              .catch(err => console.log(err))
          })
        )


      }
    })

  }//if else
})






// setup Router
module.exports = router  //會把這個 router 的設定 export 到 router.js 裡。