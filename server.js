var http = require('http'),
    bodyParser = require('body-parser'),
    express = require('express'),
    fs = require('fs'),
    json = require('json'),
    React = require('react'),
    DOM = React.DOM,
    body = DOM.body,
    querystring = require('querystring'),
    repository = require('./repository'),
    routes = require('./routes'),
    bundle = require('./routes/bundle'),
    app = new express();


app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', routes.index);

app.use('/bundle.js', bundle);

app.post('/submit', function (req, res) {
    repository.storeCandidate({
        selectedAnswers: req.body.selectedAnswers
    });

    var questions = repository.getQuestions();

    var correctAnswers = {};

    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        correctAnswers[question.id] = question.correctAnswerId;
    }

    res.end(JSON.stringify({correctAnswers: correctAnswers}));
});

var port = 3000;
if (process.env.SERVER_PORT) {
    port = process.env.SERVER_PORT
}
app.listen(port);


