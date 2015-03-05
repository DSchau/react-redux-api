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
    this.transitionTo('timesheets');
  },

  render: function () {
    return (
      <TimesheetForm timesheet={this.state.timesheet}
        saveText={this.state.saveText}
        errors={this.state.errors}
        hasErrors={this.hasErrors}
        onSave={this.onSave}
        validate={this.validate} />
    );
  }
});

module.exports = TimesheetCreate;
