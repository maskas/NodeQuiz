var React = require('react'),
    DOM = React.DOM,
    div = DOM.div,
    button = DOM.button;

module.exports = React.createClass({

    getInitialState: function () {
        return {
            questionCount: this.props.questionCount,
            curQuestion: this.props.curQuestion
        }
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            questionCount: nextProps.questionCount,
            curQuestion: nextProps.curQuestion
        })
    },

    move: function (step) {
        this.props.navigateToCallback(this.state.curQuestion + step);
    },

    render: function () {
        var showPrevButton = this.state.curQuestion > 0;
        var showNextButton = this.state.questionCount > this.state.curQuestion + 1;

        return div(null,

            showPrevButton ? button({
                    className: 'btn btn-primary',
                    onClick: this.move.bind(this, -1)
                },
                '← Prev'
            ) : null,
            showNextButton ? button({
                    className: 'btn btn-primary pull-right',
                    onClick: this.move.bind(this, 1)
                },
                'Next  →'
            ) : null
        )
    }
});
