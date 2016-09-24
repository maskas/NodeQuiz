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

    Quiz = React.createFactory(require('./App'));
    app = new express();


app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');

    // `props` represents the data to be passed in to the React component for
    // rendering - just as you would pass data, or expose variables in
    // templates such as Jade or Handlebars.  We just use some dummy data
    // here (with some potentially dangerous values for testing), but you could
    // imagine this would be objects typically fetched async from a DB,
    // filesystem or API, depending on the logged-in user, etc.
    var props = {
        questions: [
            {
                id: 1,
                text: 'Question 1',
                answers: [
                    {
                        id: 1,
                        text: 'Answer 1-1'
                    },
                    {
                        id: 2,
                        text: 'Answer 1-2'
                    },
                    {
                        id: 3,
                        text: 'Answer 1-3'
                    },
                    {
                        id: 4,
                        text: 'Answer 1-4'
                    }
                ]
            },
            {
                id: 2,
                text: 'Question 2',
                answers: [
                    {
                        id: 5,
                        text: 'Answer 2-1'
                    },
                    {
                        id: 6,
                        text: 'Answer 2-2'
                    },
                    {
                        id: 7,
                        text: 'Answer 2-3'
                    },
                    {
                        id: 8,
                        text: 'Answer 2-4'
                    }
                ]
            },
            {
                id: 3,
                text: 'Question 3 </script><!--inject!-->',
                answers: [
                    {
                        id: 9,
                        text: 'Answer 3-1 </script><!--inject!-->'
                    },
                    {
                        id: 10,
                        text: 'Answer 3-2'
                    },
                    {
                        id: 11,
                        text: 'Answer 3-3'
                    },
                    {
                        id: 12,
                        text: 'Answer 3-4'
                    }
                ]
            }
        ],
        currentQuestion: 0
    };

    // Here we're using React to render the outer body, so we just use the
    // simpler renderToStaticMarkup function, but you could use any templating
    // language (or just a string) for the outer page template
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
            // The actual server-side rendering of our component occurs here, and we
            // pass our data in as `props`. This div is the same one that the client
            // will "render" into on the browser from browser.js

            div({className: 'page-header'}, h1(null, 'JS GURU QUIZ')),

            div({
                id: 'content',
                className: 'wrapper',
                dangerouslySetInnerHTML: {
                    __html: ReactDOMServer.renderToString(Quiz(props))
                }
            }),

            // The props should match on the client and server, so we stringify them
            // on the page to be available for access by the code run in browser.js
            // You could use any var name here as long as it's unique
            script({
                dangerouslySetInnerHTML: {
                    __html: 'var APP_PROPS = ' + safeStringify(props) + ';'
                }
            }),

            // We'll load React from a CDN - you don't have to do this,
            // you can bundle it up or serve it locally if you like
            script({src: '//cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react.min.js'}),
            script({src: '//cdnjs.cloudflare.com/ajax/libs/react/15.3.0/react-dom.min.js'}),

            // Then the browser will fetch and run the browserified bundle consisting
            // of browser.js and all its dependencies.
            // We serve this from the endpoint a few lines down.
            script({src: '/bundle.js'})
        )));

    // Return the page to the browser
    res.end(htmlContent)
});


app.get('/bundle.js', function (req, res) {

    res.setHeader('Content-Type', 'text/javascript');

    // Here we invoke browserify to package up browser.js and everything it requires.
    // DON'T do it on the fly like this in production - it's very costly -
    // either compile the bundle ahead of time, or use some smarter middleware
    // (eg browserify-middleware).
    // We also use literalify to transform our `require` statements for React
    // so that it uses the global variable (from the CDN JS file) instead of
    // bundling it up with everything else
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

    //store to DB req.body.selectedAnswers

    var correctAnswers = {
        1: 1,
        2: 5,
        3: 9
    };

    res.end(JSON.stringify({correctAnswers: correctAnswers}));
});

app.listen(3000);


// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
