var React = require('react'),
    Question = React.createFactory(require('./Question')),
    $ = require('jquery'),
    DOM = React.DOM, div = DOM.div, button = DOM.button, h1 = DOM.h1

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

    // We initialise its state by using the `props` that were passed in when it
    // was first rendered. We also want the button to be disabled until the
    // component has fully mounted on the DOM
    getInitialState: function () {
        return {
            questions: this.props.questions,
            currentQuestion: this.props.currentQuestion,
            correctAnswers: {},
            disabled: true
        }
    },

    // Once the component has been mounted, we can enable the button
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

    // For ease of illustration, we just use the React JS methods directly
    // (no JSX compilation needed)
    // Note that we allow the button to be disabled initially, and then enable it
    // when everything has loaded
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
