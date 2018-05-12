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
      // This is where the actual authentication is being done.
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true // Doesn't switch back to http when going through Heroku proxy - stays as https and prevents error
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id }); // Becomes existingUser

      if (existingUser) {
        // We already have a record with the given profile ID
        return done(null, existingUser);
      }

      // Only runs if existingUser doesn't exist, because of the return statement
      // We dont have a user record with this ID, make a new record
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
