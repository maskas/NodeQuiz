var React = require('react'),
    Question = React.createFactory(require('./Question')),
    Navigation = React.createFactory(require('./Navigation')),
    DOM = React.DOM,
    div = DOM.div,
    button = DOM.button;

module.exports = React.createClass({

    getInitialState: function () {
        return {
            questions: this.props.questions,
            currentQuestion: this.props.currentQuestion,
            correctAnswers: {},
            disabled: true
        }
    },

    componentDidMount: function () {
        this.setState({disabled: false})
    },

    navigateTo: function(questionNumber) {
        if (questionNumber < 0) {
            questionNumber = 0;
        }
        if (questionNumber > this.state.questions.length - 1) {
            questionNumber = this.state.questions.length - 1;
        }
        this.setState({
            currentQuestion: questionNumber
        })
    },

    submit: function () {
        var selectedAnswers = {};
        this.state.questions.map(function (question) {
            selectedAnswers[question.id] = question.selectedAnswerId
        });

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selectedAnswers: selectedAnswers
            })
        })
        .then(function(response){return response.json()})
        .then(function(jsonResponse) {
            this.setState({
                correctAnswers: jsonResponse.correctAnswers
            });
        }.bind(this));

    },

    handleAnswerSelect: function (answerId) {
        var questions = this.state.questions;
        questions[this.state.currentQuestion].selectedAnswerId = answerId;
        this.setState({
            questions: questions
        })
    },

    render: function () {
        var curQuestion = this.state.questions[this.state.currentQuestion];
        var correctAnswerId = this.state.correctAnswers[curQuestion.id];
        var showSubmitButton = (this.state.currentQuestion === this.state.questions.length - 1) && !correctAnswerId;

        var className = 'in-progress';

        if (correctAnswerId) {
            className = 'complete'
        }

        return div({className: className},

            Question({
                answerSelectCallback: this.handleAnswerSelect,
                selectedAnswerId: curQuestion.selectedAnswerId,
                text: curQuestion.text,
                answers: curQuestion.answers,
                correctAnswerId: correctAnswerId
            }),
            Navigation({
                navigateToCallback: this.navigateTo,
                questionCount: this.state.questions.length,
                curQuestion: this.state.currentQuestion
            }),
            showSubmitButton ? button({
                    className: 'btn btn-success pull-right',
                    onClick: this.submit,
                    visible: false
                },
                'Submit'
            ) : null
        )
    }
});
