//supply bundle.js

var browserify = require('browserify'),
    express = require('express'),
    literalify = require('literalify'),
    router = express.Router();

router.get('/', function(req, res) {
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

module.exports = router;
