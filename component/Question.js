var React = require('react'),
    DOM = React.DOM,
    div = DOM.div,
    ul = DOM.ul,
    li = DOM.li,
    a = DOM.a,
    h2 = DOM.h2;

module.exports = React.createClass({

    getInitialState: function () {
        return {
            text: this.props.text,
            answers: this.props.answers,
            selectedAnswerId: this.props.selectedAnswerId,
            correctAnswerId: this.props.correctAnswerId,
            disabled: true
        }
    },

    componentDidMount: function () {
        this.setState({
            disabled: false
        })
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            text: nextProps.text,
            answers: nextProps.answers,
            selectedAnswerId: nextProps.selectedAnswerId,
            correctAnswerId: nextProps.correctAnswerId
        })
    },

    handleClick: function (answerId) {
        this.props.answerSelectCallback(answerId)
    },

    render: function () {
        return div(null,

            h2({className: 'question'}, this.state.text),
            ul({
                className: 'nav nav-pills nav-stacked answers', children: this.state.answers.map(function (answer) {
                    var className = '';
                    if (this.state.correctAnswerId) {
                        //show correct / incorrect answers
                        if (this.state.correctAnswerId === answer.id) {
                            className = 'correct'
                        }
                        if (this.state.selectedAnswerId === answer.id && this.state.selectedAnswerId !== this.state.correctAnswerId) {
                            className = 'incorrect'
                        }
                    } else {
                        //show selected answers as we don't know the right answers yet
                        if (this.state.selectedAnswerId === answer.id) {
                            className = 'active'
                        }
                    }

                    return li({
                            onClick: this.state.correctAnswerId ? null : this.handleClick.bind(this, answer.id),
                            role: 'presentation',
                            className: className
                        },
                        a(null, answer.text)
                    )
                }, this)
            })
        )
    }
});
