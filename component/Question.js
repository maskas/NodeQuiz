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

    componentWillMount: function(){
        document.addEventListener("keydown", this.handleKey, false);
    },

    componentWillUnmount: function() {
        document.removeEventListener("keydown", this.handleKey, false);
    },

    handleKey:function(event){
        var keyCode = event.keyCode;
        if (keyCode > 57) { //shift numpad keys on top of regular number keys
            keyCode -= 48;
        }
        keyCode = keyCode - 49; //if user pressed key 1 (code 49,) shift it to 0 - first answer

        if (keyCode < 0 || keyCode > 8) {
            return; //not a number
        }

        if (this.state.answers.length < keyCode + 1) {
            return; //key pressed is greater than total count of provided answers
        }

        this.props.answerSelectCallback(this.state.answers[keyCode].id)
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
        return div({className: "section"},

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
                            onClick: this.handleClick.bind(this, answer.id),
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
