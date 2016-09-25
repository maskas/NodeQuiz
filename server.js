var
    bodyParser = require('body-parser'),
    express = require('express'),
    http = require('http'),
    app = new express();

var
    bundle = require('./routes/bundle'),
    index = require('./routes/index'),
    submit = require('./routes/submit');


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


