const express = require('express'),
    dotenv = require('dotenv').config(),
    engines = require('consolidate'),
    morgan = require('morgan'),
    util = require('util'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

const app = express();

app.use(express.static(__dirname + '/public')); // serve static files, assets, css, javascript in public directory
app.set('views', __dirname + '/views'); // set directory of views templates
app.engine('html', engines.nunjucks); // sete engine template to nunjucks
app.use(bodyParser.urlencoded({ extended: true})); // convert data to be easily transferred through the web
app.use(bodyParser.json()); // parse/analyze incoming data as json object
app.use(morgan('dev')); // log every request in console

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

const routes = require('./routes/routes.js')(app);
