const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// Generates the cookie token
passport.serializeUser((user, done) => {
  done(null, user.id); // user.id is shortcut to mongo generated user ID
});

// Takes cookie and generates it back into a user
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }) // Becomes existingUser
        .then(existingUser => {
          if (existingUser) {
            // We already have a record with the given profile ID
            done(null, existingUser);
          } else {
            // We dont have a user record with this ID, make a new record
            new User({ googleId: profile.id })
              .save()
              .then(user => done(null, user));
          }
        });
    }
  )
);
