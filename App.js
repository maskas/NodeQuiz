var React = require('react'),
    Question = React.createFactory(require('./Question')),
    DOM = React.DOM, div = DOM.div, button = DOM.button, h1 = DOM.h1

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

  // We initialise its state by using the `props` that were passed in when it
  // was first rendered. We also want the button to be disabled until the
  // component has fully mounted on the DOM
  getInitialState: function() {
    return {questions: this.props.questions, currentQuestion: this.props.currentQuestion, disabled: true}
  },

  // Once the component has been mounted, we can enable the button
  componentDidMount: function() {
    this.setState({disabled: false})
  },

  moveToPrev: function(questionNumber) {
    this.setState({
      currentQuestion: this.state.currentQuestion - 1
    })
  },

  moveToNext: function(questionNumber) {
    this.setState({
      currentQuestion: this.state.currentQuestion + 1
    })
  },


  // For ease of illustration, we just use the React JS methods directly
  // (no JSX compilation needed)
  // Note that we allow the button to be disabled initially, and then enable it
  // when everything has loaded
  render: function() {
    var curQuestion = this.state.questions[this.state.currentQuestion];
    var nextDisabled = this.state.disabled || this.state.currentQuestion === this.state.questions.length - 1;
    var prevDisabled = this.state.disabled || this.state.currentQuestion === 0;

    return div(null,
      h1(null, 'Super Quiz'),
      button({class: 'btn btn-default', onClick: this.moveToPrev, disabled: prevDisabled}, 'Prev'),
      button({onClick: this.moveToNext, disabled: nextDisabled}, 'Next'),

      Question({text: curQuestion.text, answers: curQuestion.answers})
    )
  },
})
