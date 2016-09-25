var low = require('lowdb');
var dbQuestions = low('db-questions.json');
var dbCandidates = low('db-candidates.json');

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
