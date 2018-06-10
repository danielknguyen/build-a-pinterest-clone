var routes = function(app, passport, User) {

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
    User.findOne({ 'github_id': req.user.id }, function(err, data) {
      if (err) {
        console.log(err);
      }

      res.render('dashboard.html', {
        user: req.user,
        data: data
      });
    });
  });

  app.post('/dashboard/:user/add', isAuthenticated, function(req, res) {
    var username = req.params.user; // user's github name
    var imageLink = req.body.formImageLink; // image link from form

    var step1 = new Promise(function(resolve, reject) {
      User.findOne({ 'github_id': req.user.id }, function(err, user) {
        if (err) {
          console.log(err);
        }

        if (user) {
          // user exists -- push new link into existing document
          var image = {
            link: imageLink,
            likes: 0,
            views: 0
          };
          user.images.push(image);

          user.save(function(err) {
            if (err) console.log(err);
          });

          resolve(user);

        } else {
          // user is null -- create new user and assign a new image into document
          var new_user = new User(); // instantiate new user object
          var image = {
            link: imageLink,
            likes: 0,
            views: 0
          };
          new_user.github_id = req.user.id;
          new_user.github_name = req.user._json.name;
          new_user.images = image;

          new_user.save(function(err) { // save into database
            if (err) {
              console.log(err);
            }
          });

          resolve(new_user);
        };
      });
    });

    step1.then(function() {
      req.flash('success', 'Successfully linked to image');
      res.redirect('/dashboard/' + username);
    });
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
