var routes = function(app) {
  
  app.get('/', (req, res) => {
    res.render('index.html');
  });

};

module.exports = routes;
