// config/passport.js
const LocalStrategy = require('passport-local').Strategy

const FacebookStrategy = require('passport-facebook').Strategy

const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')

const passport = require('passport')
const User = require('../models/users')


module.exports = passport => {

  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false, { message: 'That email is not registered' }) }

        if (user.password != password) {
          return done(null, false, { message: 'Email or Password incorrect' })
        }
        return done(null, user);
      });
    }
  ))

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    })
  })
}




