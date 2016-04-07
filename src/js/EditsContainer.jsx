var React = require('react');
var request = require('superagent');

var EditsSyntacticalValidity = require('./EditsSyntacticalValidity.jsx');
var EditsHeaderDescription = require('./EditsHeaderDescription.jsx');

var EditsContainer = React.createClass({
  getInitialState: function() {
    return {
    	"syntactical": [],
      "validity": []
    }
  },

  parseResponse: function(err, res) {
    if (err) throw err
    var response = JSON.parse(res.text);
    this.setState({
      "syntactical": response.edits.syntactical,
      "validity": response.edits.validity
    });
  },

  componentWillMount: function() {
    var _this = this;
    request.get('/json/edits.json')
      .end(_this.parseResponse);
  },

  render: function() {
    return (
      <div className="EditsContainer container">
        <div className="third">
          <p>Filing progress will go here. It could be in progress or complete or ...</p>
        </div>
        <div className="two-third">
          <EditsHeaderDescription>Syntactical</EditsHeaderDescription>
          <EditsSyntacticalValidity id="syntactical" edits={this.state.syntactical} />

          <EditsHeaderDescription>Validity</EditsHeaderDescription>
          <EditsSyntacticalValidity id="validity" edits={this.state.validity} />
        </div>
      </div>
    )
  }
});

module.exports = EditsContainer;