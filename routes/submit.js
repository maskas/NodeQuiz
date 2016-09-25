var express = require('express'),
    repository = require('./../repository'),
    router = express.Router();

router.post('/', function(req, res) {
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


module.exports = router;
