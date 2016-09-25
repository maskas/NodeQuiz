var React = require('react'),
    Pagination = React.createFactory(require('./Pagination')),
    DOM = React.DOM,
    a = DOM.a,
    div = DOM.div,
    button = DOM.button,
    li = DOM.li,
    ul = DOM.ul;


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
                    className: 'btn btn-primary pull-left',
                    onClick: this.move.bind(this, -1)
                },
                '← Prev'
            ) : null,
            showNextButton ? button({
                    className: 'btn btn-primary pull-right',
                    onClick: this.move.bind(this, 1)
                },
                'Next  →'
            ) : null,
            Pagination({
                questionCount: this.state.questionCount,
                curQuestion: this.state.curQuestion,
                navigateToCallback: this.props.navigateToCallback,
                stateProviderCallback: this.props.stateProviderCallback
            })
        )
    }
});
