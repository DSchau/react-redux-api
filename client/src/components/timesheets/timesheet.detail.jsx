var React = require('react/addons');
var Router = require('react-router');
var _ = require('lodash');

var TimesheetForm = require('./timesheet.form');
var Timeunits = require('../timeunits/timeunits');
var TimesheetActions = require('../../actions/timesheet.actions');
var TimesheetMixin = require('../../mixins/timesheet.mixin');

var TimesheetDetail = React.createClass({

  mixins: [
    Router.Navigation,
    Router.State,
    TimesheetMixin
  ],

  editTimesheet: function (event) {
    this.transitionTo('timesheets.edit', {_id: this.props.timesheet._id});
  },

  get: function (timesheetId) {
    var timesheet = this.store.getState().timesheet;
    if (_.isEmpty(timesheet)) {
      TimesheetActions.get(timesheetId);
    }
    else {
      this.onChange();
    }
  },

  getInitialState: function () {
    return {
      saveText: 'Edit',
      timesheet: {},
      errors: {}
    };
  },

  onChange: function () {
    this.setState(this.store.getState());
  },

  componentWillMount: function () {
    this.get(this.getParams()._id);
    this.store.addChangeListener(this.onChange);
  },

  componentWillUnmount: function () {
    this.store.removeChangeListener(this.onChange);
  },

  render: function () {
    return (
      <div>
        <div className="row">
          <TimesheetForm timesheet={this.state.timesheet}
            saveText={this.state.saveText}
            onSave={this.editTimesheet}
            errors={this.state.errors}
            hasErrors={this.hasErrors}
            validate={this.validate} />
        </div>

        <div className="ui divider"></div>

        <Timeunits timesheet={this.state.timesheet} />
      </div>
    );
  }
});

module.exports = TimesheetDetail;
