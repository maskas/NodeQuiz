var express = require('express'),
    repository = require('./../repository'),
    router = express.Router(),
    pug = require('pug'),
    json = require('json'),
    React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    Quiz = React.createFactory(require('./../component/App'));

router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');

    var props = {
        questions: repository.getQuestions(),
        currentQuestion: 0
    };

    var htmlContent = pug.renderFile('./views/index.pug', {
        pageTitle: 'JS GURU QUIZ',
        props: safeStringify(props),
        content: ReactDOMServer.renderToString(Quiz(props))
    });

    res.end(htmlContent)
});

module.exports = router;

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
