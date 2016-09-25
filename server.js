var http = require('http'),
    bodyParser = require('body-parser'),
    express = require('express'),
    fs = require('fs'),
    json = require('json'),
    React = require('react'),
    DOM = React.DOM,
    body = DOM.body,
    querystring = require('querystring'),
    index = require('./routes/index'),
    bundle = require('./routes/bundle'),
    submit = require('./routes/submit'),
    app = new express();


app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', index);

app.use('/bundle.js', bundle);

app.use('/submit', submit);

var port = 3000;
if (process.env.SERVER_PORT) {
    port = process.env.SERVER_PORT
}
app.listen(port);


