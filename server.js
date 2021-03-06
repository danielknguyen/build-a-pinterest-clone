const express = require('express'),
    dotenv = require('dotenv').config(),
    engines = require('consolidate'),
    morgan = require('morgan'),
    util = require('util'),
    flash = require('connect-flash'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    db = require('./db/db.js'),
    Link = require('./models/linkSchema.js'),
    passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
    // create express instance
    app = express();

app.use(express.static(__dirname + '/public')); // serve static files, assets, css, javascript in public directory
app.set('views', __dirname + '/views'); // set directory of views templates
app.engine('html', engines.nunjucks); // sete engine template to nunjucks
app.use(morgan('dev')); // log every request in console
app.use(bodyParser.urlencoded({ extended: true})); // convert data to be easily transferred through the web
app.use(bodyParser.json()); // parse/analyze incoming data as json object
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
   mongooseConnection: db.connection,
   // 1 day in seconds
   ttl: 86400,
   autoRemove: 'native'
  }),
  cookie: {
   secure: false,
   // 30 min in milli
   maxAge: 1800000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // flash messaging

// set success and error variables on every request
app.use(function(req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

passport.serializeUser(function(user, done) {
  // null is for errors
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // null is for errors
  done(null, user);
});

// passport github strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://fcc-photo-share.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

const routes = require('./routes/routes.js')(app, passport, Link);
