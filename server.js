var http = require('http'),
    bodyParser = require('body-parser'),
    browserify = require('browserify'),
    express = require('express'),
    fs = require('fs'),
    json = require('json'),
    literalify = require('literalify'),
    React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    DOM = React.DOM,
    html = DOM.html,
    body = DOM.body,
    div = DOM.div,
    script = DOM.script,
    link = DOM.link,
    head = DOM.head,
    meta = DOM.meta,
    h1 = DOM.h1,
    querystring = require('querystring'),
    repository = require('./repository'),

    Quiz = React.createFactory(require('./App'));
app = new express();


app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');

    var props = {
        questions: repository.getQuestions(),
        currentQuestion: 0
    };

    var htmlContent = ReactDOMServer.renderToStaticMarkup(html(null,
        head(null,
            meta({
                charSet: 'utf-8'
            }),
            link({
                rel: 'stylesheet',
                type: 'text/css',
                href: '/bootstrap.min.css'
            }),
            link({
                rel: 'stylesheet',
                type: 'text/css',
                href: '/style.css'
            })
        ),
        body(null,
            div({className: 'page-header'}, h1(null, 'JS GURU QUIZ')),

            div({
                id: 'content',
                className: 'wrapper',
                dangerouslySetInnerHTML: {
                    __html: ReactDOMServer.renderToString(Quiz(props))
                }
            }),

            script({
                dangerouslySetInnerHTML: {
                    __html: 'var APP_PROPS = ' + safeStringify(props) + ';'
                }
            }),

            script({src: '//cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react.min.js'}),
            script({src: '//cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react-dom.min.js'}),

            script({src: '/bundle.js'})
        )));

    res.end(htmlContent)
});


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

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
