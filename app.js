// require packages used in the project
const express = require('express')
const app = express()
const port = 4000

// require express-handlebars here
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

// 載入 express-session 與 passport
const session = require('express-session')
const passport = require('passport')

const flash = require('connect-flash')

// 使用 express session 
app.use(session({
  secret: 'asdfasdfglkajsfdglkjalasdfasdxxxfasdf',                // secret: 定義一組自己的私鑰（字串)
  resave: 'false',
  saveUninitialized: 'false'
}))
// 使用 Passport 
app.use(passport.initialize())
app.use(passport.session())

// 使用 express connect-flash
app.use(flash());

// 載入 Passport config
require('./config/passport')(passport)

// 這裏是　Express Middle-Ware
app.use((req, res, next) => {
  res.locals.user = req.user

  res.locals.isAuthenticated = req.isAuthenticated() //辨識使用者是否已經登入的變數，讓 view 可以使用
  // isAuthenticated() 是一個 function ，回傳是一個 boolean 變數, 所以用一個變數去存。

  next()
})

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
// app.use('/auth', require('./routes/auths'))

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
