var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var port     = process.env.PORT || 3111;
var routes = require('./routes/index');
var db= require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');

var multer = require('multer');

var tinify = require("tinify");
tinify.key = "JCtv2CQ646psz31PcLRNr4kXWMQSqM6R";
// var md5 = require('md5');

// var crypto = require('crypto-js');

var passport = require('passport');


require('./config/passport')(passport); 


var app = express();

// db.connect(process.env.hcmProductionDBConnection,{useNewUrlParser: true});

db.connect("mongodb://localhost:27017/travel");


app.use(cors({credentials: true, origin: true}))
// view engine setup
app.use(express.static(path.join(__dirname, 'public')));

// app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');



app.use(favicon());
app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
var listener = app.listen(port, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});

module.exports = app;
