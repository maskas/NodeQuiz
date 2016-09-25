var React = require('react'),
    DOM = React.DOM,
    a = DOM.a,
    div = DOM.div,
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

    handleClick: function (position) {
        this.props.navigateToCallback(position);
    },

    render: function () {

        var pages = [];

        for(var i=0; i<this.state.questionCount; i++) {
            var className = '';
            if (this.state.curQuestion === i) {
                className = 'active';
            }

            className = className + ' ' + this.props.stateProviderCallback(i);

            var newItem =
                li({
                    className: className,
                    onClick: this.handleClick.bind(this, i)
                },
                    a(null, i + 1)
                );
            pages.push(newItem)
        }

        return div({className: "bs-component pagination-container"},
                ul({className: "pagination pagination", children: pages})
            )
    }
});
