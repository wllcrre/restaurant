const mongoose = require('mongoose')
const Restaurant = require('../restaurant')

mongoose.connect('mongodb://127.0.0.1/restaurant', { useNewUrlParser: true })

const db = mongoose.connection


db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connnected!')

  const restaurantList = require('../../restaurant.json')

  //將 restaurant.json 中的 array 一筆筆寫入 Model : Restaurant
  restaurantList.results.forEach((restaurant) => {
    console.log(restaurant.name)

    Restaurant.create({
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      name_en: restaurant.name_en,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  })

  console.log('done!')
})

