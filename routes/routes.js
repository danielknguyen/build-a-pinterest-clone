var routes = function(app, passport) {

  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/',
      session: true
     }),
     function(req, res) {
    // Successful authentication, redirect home.
    req.flash('success', 'Successfully logged in!');
    res.redirect('/');
  });

  app.get('/', (req, res) => {
    res.render('index.html', { user: req.user });
  });

  app.get('/dashboard/:user', isAuthenticated, function(req, res) {
    res.render('dashboard.html', {
      user: req.user
    });
  });

  app.get('/logout', function(req, res){
    console.log('logging out');
    req.logout(); // passport terminates session
    res.redirect('/');
  });

};

// middleware to check if user is authenticatd
var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log('User is not authenticated');
    res.redirect('/');
  }
};

module.exports = routes;
