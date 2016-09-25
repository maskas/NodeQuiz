var express = require('express'),
    repository = require('./../repository'),
    router = express.Router(),
    json = require('json'),
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
    h1 = DOM.h1;

Quiz = React.createFactory(require('./../component/App'));

router.get('/', function(req, res) {
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

module.exports = router;

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
