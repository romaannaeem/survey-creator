const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'] // We're asking Google for access to the user's profile and email
    })
  );

  // This will take the google OAuth callback and send it to the /surveys route!
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // A logged in user can get access to user
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
