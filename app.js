var express = require('express');
var mailer = require('express-mailer');
var i18n = require('i18n');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-mate');
var validate = require('form-validate');

// #ROUTES
var routes = require('./routes/index');
var services = require('./routes/services');
var price = require('./routes/price');
var contact = require('./routes/contact');
var portfolio = require('./routes/portfolio');
var offer = require('./routes/offer');

var app = express();

// #VIEW ENGINE SETUP
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public/images/favicon', 'favicon.ico')));

// #SETTING LOCALES
i18n.configure({
  locales:['en', 'ru'],
  directory: __dirname + '/locales'
});
app.use(i18n.init);

// #SETTING MAIL
mailer.extend(app, {
  from: 'by.metran@gmail.com',
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 465,
  transportMethod: 'SMTP',
  auth: {
    user: 'by.metran@gmail.com',
    pass: '10049116kain'
  }
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// #VALIDATE FORM
var validationConfig = {
  stripTags : true
};
app.use(validate(app, validationConfig));

// #BIND ROUTES todo split all routes
app.use('/', routes);
app.use('/', services);
app.use('/', price);
app.use('/', contact);
app.use('/', portfolio);
app.use('/', offer);

// #CATCH 404 AND FORWARD TO ERROR HANDLER
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// #ERROR HANDLERS

// #DEVELOPMENT ERROR HANDLER
// #WILL PRINT STACKTRACE
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: 'ELEPHANT|Эвакуатор|Ремонт',
      route: req.url,
      message: err.message,
      error: err
    });
  });
}

// #PRODUCTION ERROR HANDLER
// #NO STACKTRACES LEAKED TO USER
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: 'ELEPHANT|Эвакуатор|Ремонт',
    route: req.url,
    message: err.message,
    error: {}
  });
});


module.exports = app;
