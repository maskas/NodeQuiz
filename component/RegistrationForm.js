var React = require('react'),
    DOM = React.DOM,
    button = DOM.button,
    div = DOM.div,
    form = DOM.form,
    input = DOM.input,
    h2 = DOM.h2;

module.exports = React.createClass({

    getInitialState: function () {
        return {}
    },

    handleNameChange: function (e) {
        this.setState({name: e.target.value});
    },

    handleSubmit: function (e) {
        e.preventDefault();
        this.props.handleNameCallback(this.state.name);
    },

    render: function () {
        return div(null,

            h2({className: 'question'}, 'Please enter your full name'),
            form({onSubmit: this.handleSubmit},
                div({className: "input-group"},
                    input({onChange: this.handleNameChange, className: "form-control"})
                ),
                div({className: "input-group"},
                    button({
                            className: 'btn btn-success pull-right',
                            type: 'submit'
                        },
                        'Start'
                    )
                )
            )
        )
    }
});
