var React = require('react'),
    DOM = React.DOM,
    button = DOM.button,
    div = DOM.div,
    form = DOM.form,
    input = DOM.input,
    h2 = DOM.h2,
    p = DOM.p;

module.exports = React.createClass({

    getInitialState: function () {
        return {
            name: ''
        }
    },

    handleNameChange: function (e) {
        this.setState({
            name: e.target.value,
            error: e.target.value == ''
        });
    },

    handleSubmit: function (e) {
        e.preventDefault();
        if (this.state.name == '') {
            this.setState({
                error: true
            });
            return;
        }
        this.props.handleNameCallback(this.state.name);
    },

    render: function () {
        return div(null,

            h2({className: 'question'}, 'Please enter your full name'),
            form({onSubmit: this.handleSubmit},
                div({className: "input-group " + (this.state.error ? 'has-error' : '')},
                    input({onChange: this.handleNameChange, className: "form-control"}),
                    this.state.error ? p({
                            className: "text-danger"
                        },
                        'This field is required'
                    ): null
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
