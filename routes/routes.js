var routes = function(app, passport, Link) {

  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/',
      session: true
     }),
     function(req, res) {
    // Successful authentication, redirect home.
    req.flash('success', 'Successfully logged in');
    res.redirect('/');
  });

  app.get('/', (req, res) => {
    res.render('index.html', { user: req.user });
  });

  app.get('/dashboard/:user', isAuthenticated, function(req, res) {

    var promise = new Promise(function(resolve, reject) {
      Link.find({ 'github_id': req.user.id }, function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        };
        resolve(data);
      });
    });

    promise.then(function isOk(data) {
      // if existing user with links, render dashboard with data
      res.render('dashboard.html', {
        user: req.user,
        data: data
      });
    }).catch(function notOk(err) {
      // if user is new render dashboard with an empty array assigned to data
      res.render('dashboard.html', {
        user: req.user,
        data: []
      });
    });

  });

  app.post('/dashboard/:user/add', isAuthenticated, function(req, res) {
    var username = req.params.user; // user's github name
    var imageLink = req.body.formImageLink; // image link from form

    var new_link = new Link(); // instantiate new user object

    new_link.github_id = req.user.id;
    new_link.github_name = req.user._json.name;
    new_link.link = imageLink;
    new_link.likes = 0;
    new_link.views = 0;

    new_link.save(function(err) { // save into database
      if (err) {
        console.log(err);
      }
    });

    req.flash('success', 'Successfully linked to image');
    res.redirect('/dashboard/' + username);
  });

  app.post('/dashboard/:user/delete/:linkId', function(req, res) {
    var username = req.params.user;
    var linkId = req.params.linkId;

    Link.findOneAndRemove({ 'github_id': req.user.id, '_id': linkId }, function(err, user) {
      if (err) {
        console.log(err);
      }
    });

    req.flash('success', 'Successfully removed image link');
    res.redirect('/dashboard/' + username);
  });

  app.get('/logout', isAuthenticated, function(req, res) {
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
