var React = require('react'),
    DOM = React.DOM, div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li, input = DOM.input, label = DOM.label, p = DOM.p, a = DOM.a, h2 = DOM.h2

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

  // We initialise its state by using the `props` that were passed in when it
  // was first rendered. We also want the button to be disabled until the
  // component has fully mounted on the DOM
  getInitialState: function() {
    return {text: this.props.text, answers: this.props.answers, disabled: true}
  },

  // Once the component has been mounted, we can enable the button
  componentDidMount: function() {
    this.setState({disabled: false})
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({text: nextProps.text, answers: nextProps.answers})
  },

  // For ease of illustration, we just use the React JS methods directly
  // (no JSX compilation needed)
  // Note that we allow the button to be disabled initially, and then enable it
  // when everything has loaded
  render: function() {
    return div(null,

      h2({className: 'question'}, this.state.text),
      ul({className: 'nav nav-pills nav-stacked answers', children: this.state.answers.map(function(answer) {
        return li({role: 'presentation'}, a(null, answer.text))
      })})

    )
  },
})
