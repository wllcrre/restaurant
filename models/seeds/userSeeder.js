const mongoose = require('mongoose')
const User = require('../users')

const bcrypt = require('bcryptjs')
const passport = require('passport')

mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })

const db = mongoose.connection


db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connnected!')

  const userList = require('../../user.json')

  //將 restaurant.json 中的 array 一筆筆寫入 Model : Restaurant
  userList.results.forEach((user) => {
    console.log(user.name)

    const name = user.name
    const email = user.email
    const password = user.password

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
              .catch(err => console.log(err))
          })
        )


    console.log('user add done!')

  })

})  