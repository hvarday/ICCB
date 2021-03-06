var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
//var busboy = require('connect-busboy');
var inputRoutes = require(path.join(__dirname, 'routes', 'input'));
var routes = require(path.join(__dirname, 'routes', 'index'));
var users = require(path.join(__dirname, 'routes', 'users'));
var mongo = require('express-mongo-db');
var MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/iccb';
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false,keepExtensions:true}));
app.use(cookieParser(process.env.COOKIE_SECRET || 'randomsecretstring', {signed: true}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(busboy);
app.use(mongo(MONGO_URL));
//app.use(multer({ dest: './paper-submissions/'}).single('fileUpload'));
/*
app.use(multer({
    dest: './paper-submissions/',
    rename: function (fieldname, filename) {
        return filename.replace(/\s+/g, "-").toLowerCase();
    },
    limits: {
        files: 1
    }
}));
*/
app.use('/', routes);
app.use('/users', users);
app.use('/input', inputRoutes);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
