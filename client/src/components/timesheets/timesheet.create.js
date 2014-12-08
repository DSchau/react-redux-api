/** @jsx React.DOM */

var React = require('react/addons');
var Router = require('react-router');

var TimesheetActions = require('../../actions/timesheet.actions');
var TimesheetForm = require('./timesheet.form');
var TimesheetMixin = require('../../mixins/timesheet.mixin');

var TimesheetCreate = React.createClass({

  mixins: [
    Router.Navigation,
    TimesheetMixin
  ],

  getInitialState: function () {
    return {
      saveText: 'Create',
      timesheet: {},
      errors: {}
    };
  },

  onSave: function (event) {
    event.preventDefault();
    TimesheetActions.create(this.state.timesheet);
    this.goBack();
  },

  render: function () {
    return (
      <TimesheetForm timesheet={this.state.timesheet}
        errors={this.state.errors}
        hasErrors={this.hasErrors}
        onCancel={this.goBack} />
    );
  }
});

module.exports = TimesheetCreate;
