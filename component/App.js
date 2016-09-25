var React = require('react'),
    Question = React.createFactory(require('./Question')),
    Navigation = React.createFactory(require('./Navigation')),
    RegistrationForm = React.createFactory(require('./RegistrationForm')),
    DOM = React.DOM,
    div = DOM.div,
    button = DOM.button;

module.exports = React.createClass({

    getInitialState: function () {
        return {
            name: '',
            questions: this.props.questions,
            currentQuestionOffset: this.props.currentQuestion,
            correctAnswers: {},
            selectedAnswers: {},
            disabled: true
        }
    },

    componentDidMount: function () {
        this.setState({disabled: false})
    },

    navigateTo: function (questionNumberOffset) {
        if (questionNumberOffset < 0) {
            questionNumberOffset = 0;
        }
        if (questionNumberOffset > this.state.questions.length - 1) {
            questionNumberOffset = this.state.questions.length - 1;
        }
        this.setState({
            currentQuestionOffset: questionNumberOffset
        })
    },

    handleSubmit: function () {
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                selectedAnswers: this.state.selectedAnswers
            })
        })
            .then(function (response) {
                return response.json()
            })
            .then(function (jsonResponse) {
                this.setState({
                    correctAnswers: jsonResponse.correctAnswers
                });
            }.bind(this));

    },

    handleReset: function () {
        this.setState(this.getInitialState())
    },

    handleAnswerSelect: function (answerId) {
        var curQuestion = this.state.questions[this.state.currentQuestionOffset];
        var selectedAnswers = this.state.selectedAnswers;
        selectedAnswers[curQuestion.id] = answerId;

        this.setState({
            selectedAnswers: selectedAnswers
        })
    },

    handleName: function (name) {
        this.setState({
            name: name
        })
    },

    render: function () {
        var curQuestion = this.state.questions[this.state.currentQuestionOffset];
        var correctAnswerId = this.state.correctAnswers[curQuestion.id];
        var showSubmitButton = Object.keys(this.state.selectedAnswers).length === this.state.questions.length && !correctAnswerId;
        var showResetButton = correctAnswerId;

        var className = 'in-progress';

        if (correctAnswerId) {
            className = 'complete'
        }

        if (!this.state.name) {
            return RegistrationForm({
                handleNameCallback: this.handleName
            });
        }

        return div({className: className},
            Question({
                answerSelectCallback: this.handleAnswerSelect,
                selectedAnswerId: this.state.selectedAnswers[curQuestion.id],
                text: curQuestion.text,
                answers: curQuestion.answers,
                correctAnswerId: correctAnswerId
            }),
            Navigation({
                navigateToCallback: this.navigateTo,
                questionCount: this.state.questions.length,
                curQuestion: this.state.currentQuestionOffset
            }),
            showSubmitButton ? div({className: 'submit'},
                button({
                        className: 'btn btn-success submit',
                        onClick: this.handleSubmit,
                        visible: false
                    },
                    'Submit'
                )
            ) : null,
            showResetButton ? div({className: 'submit'},
                button({
                        className: 'btn btn-warning submit',
                        onClick: this.handleReset,
                        visible: false
                    },
                    'Reset'
                )
            ) : null
        )
    }
});
