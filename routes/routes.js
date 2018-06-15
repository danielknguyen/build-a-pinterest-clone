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
    var promise = new Promise(function(resolve, reject) {
      Link.find({}, function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        };
        resolve(data);
        console.log(data);
      });
    });

    promise.then(function isOk(data) {
      // if existing user with links, render dashboard with data
      res.render('homepage.html', {
        user: req.user,
        data: data
      });
    }).catch(function notOk(err) {
      // if user is new render dashboard with an empty array assigned to data
      res.render('homepage.html', {
        user: req.user,
        data: []
      });
    });
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
      var dataLength = data.length;
      res.render('dashboard.html', {
        user: req.user,
        data: data,
        totalLength: dataLength
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

  app.post('/dashboard/:user/delete/:linkId', isAuthenticated, function(req, res) {
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

  app.post('/likes/:linkId', isAuthenticated, function(req, res) {
    var linkId = req.params.linkId;
    var user = req.user.id;

    Link.findOne({ '_id': linkId }, function(err, image) {
      if (err) {
        console.log(err);
      }

      if (image.likers.length !== 0) {

        for (var i = 0; i < image.likers.length; i++) {
          if (image.likers[i] === user) {
            // if only 1 user reset likes to 0
            if (image.likers.length === 1) {
              image.likers = [];
              image.likes = 0;
            } else {
              if (i === 0) {
                image.likers = image.likers.slice(1);
              } else if (i === image.likers.length) {
                image.likers = image.likers.slice(0, image.likers.length - 1);
              } else {
                var temp = image.likers.slice(0, i);
                var temp2 = image.likers.slice(i + 1);
                image.likers = temp + temp2;
              };
              image.likes = image.likes - 1;
            };
          } else {
            image.likes = image.likes + 1; // if user does not exist increment likes by 1 and add user
            image.likers.push(user);
          };
        };
      } else {
        // if no likers increment likes by 1 and add user
        image.likers = [user];
        image.likes = image.likes + 1;
      };

      image.save(function(err) { // save updated link object
        if (err) {
          console.log(err);
        }
      })
      res.send(image);
    });

  });

  app.post('/views/:linkId', function(req, res) {
    var linkId = req.params.linkId;

    Link.findOne({ '_id': linkId }, function(err, image) {
      if (err) {
        console.log(err);
      }

      image.views = image.views + 1; // increment views by 1

      image.save(function(err) { // saved updated document
        if (err) {
          console.log(err);
        }
      });

      res.send(image);
    });

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
