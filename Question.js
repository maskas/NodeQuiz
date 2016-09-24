var React = require('react'),
    DOM = React.DOM,
    div = DOM.div,
    ul = DOM.ul,
    li = DOM.li,
    a = DOM.a,
    h2 = DOM.h2;

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

  // We initialise its state by using the `props` that were passed in when it
  // was first rendered. We also want the button to be disabled until the
  // component has fully mounted on the DOM
  getInitialState: function() {
    return {
      text: this.props.text,
      answers: this.props.answers,
      selectedAnswerId: this.props.selectedAnswerId,
      correctAnswerId: this.props.correctAnswerId,
      disabled: true
    }
  },

  // Once the component has been mounted, we can enable the button
  componentDidMount: function() {
    this.setState({
      disabled: false
    })
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      text: nextProps.text,
      answers: nextProps.answers,
      selectedAnswerId: nextProps.selectedAnswerId,
      correctAnswerId: nextProps.correctAnswerId
    })
  },

  handleClick: function(answerId) {
    this.props.answerSelectCallback(answerId)
  },

  // For ease of illustration, we just use the React JS methods directly
  // (no JSX compilation needed)
  // Note that we allow the button to be disabled initially, and then enable it
  // when everything has loaded
  render: function() {
    console.log(this.state.correctAnswerId);
    return div(null,

      h2({className: 'question'}, this.state.text),
      ul({className: 'nav nav-pills nav-stacked answers', children: this.state.answers.map(function(answer) {
        var className = '';
        if (this.state.correctAnswerId) {
          //show correct / incorrect answers
          if (this.state.correctAnswerId  === answer.id) {
            className = 'correct'
          }
          if (this.state.selectedAnswerId  === answer.id && this.state.selectedAnswerId !== this.state.correctAnswerId) {
            className = 'incorrect'
          }
        } else {
          //show selected answers as we don't know the right answers yet
          if (this.state.selectedAnswerId === answer.id) {
            className = 'active'
          }
        }

        return li({
          onClick: this.state.correctanswerId? null : this.handleClick.bind(this, answer.id), role: 'presentation',
          className: className
        },
            a(null, answer.text)
        )
      }, this)})

    )
  },
})
