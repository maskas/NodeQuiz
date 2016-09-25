//fetch questions and store applicant data

var low = require('lowdb');
var dbQuestions = low('data/questions.json');
var dbCandidates = low('data/candidates.json');

dbQuestions.defaults({questions: []}).value();
dbCandidates.defaults({candidates: []}).value();

module.exports = {
    getQuestions: function () {
        return dbQuestions.get('questions').value();
    },

    storeCandidate: function (candidate) {
        dbCandidates.get('candidates').push(candidate).value();
    }
};
