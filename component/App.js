var React = require('react'),
    Question = React.createFactory(require('./Question')),
    $ = require('jquery'),
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

    moveToPrev: function (questionNumber) {
        this.setState({
            currentQuestion: this.state.currentQuestion - 1
        })
    },

    moveToNext: function (questionNumber) {
        this.setState({
            currentQuestion: this.state.currentQuestion + 1
        })
    },

    submit: function () {
        var selectedAnswers = {};
        this.state.questions.map(function (question) {
            selectedAnswers[question.id] = question.selectedAnswerId
        });

        var context = this;
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/submit',
            data: {selectedAnswers: selectedAnswers},
            success: function (data) {
                context.setState({
                    correctAnswers: data.correctAnswers
                })
            }
        })
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
        var showNextButton = this.state.currentQuestion !== this.state.questions.length - 1;
        var showPrevButton = this.state.currentQuestion !== 0;
        var correctAnswerId = this.state.correctAnswers[curQuestion.id];
        var showSubmitButton = !showNextButton && !correctAnswerId;

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
            showPrevButton ? button({
                    className: 'btn btn-primary',
                    onClick: this.moveToPrev
                },
                '← Prev'
            ) : null,
            showNextButton ? button({
                    className: 'btn btn-primary pull-right',
                    onClick: this.moveToNext
                },
                'Next  →'
            ) : null,
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
