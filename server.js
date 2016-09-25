var http = require('http'),
    bodyParser = require('body-parser'),
    browserify = require('browserify'),
    express = require('express'),
    fs = require('fs'),
    json = require('json'),
    literalify = require('literalify'),
    React = require('react'),
    DOM = React.DOM,
    body = DOM.body,
    querystring = require('querystring'),
    repository = require('./repository'),
    rootController = require('./controller/root.js'),

app = new express();


app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', rootController.handle);


app.get('/bundle.js', function (req, res) {

    res.setHeader('Content-Type', 'text/javascript');

    // DON'T DO THIS IN PRODUCTION :)
    browserify()
        .add('./browser.js')
        .transform(literalify.configure({
            'react': 'window.React',
            'react-dom': 'window.ReactDOM'
        }))
        .bundle()
        .pipe(res)
});

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


