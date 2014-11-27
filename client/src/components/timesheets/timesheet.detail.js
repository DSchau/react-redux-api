/** @jsx React.DOM */

var React = require('react/addons');
var Router = require('react-router');
var _ = require('lodash');

var TimesheetForm = require('./timesheet.form');
var Timeunits = require('./timeunits/timeunits');
var TimesheetActions = require('../../actions/timesheet.actions');

var ChangeMixin = require('../../mixins/change.mixin');
var TimesheetMixin = require('../../mixins/timesheet.mixin');

var TimesheetDetail = React.createClass({

  mixins: [
    ChangeMixin,
    TimesheetMixin
  ],

  editTimesheet: function (event) {
    Router.transitionTo('timesheets.edit', {_id: this.props.timesheet._id});
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
      section: 'Timesheet Details',
      timesheet: {}
    };
  },

  componentDidMount: function () {
    this.get(this.props.params._id);
  },

  render: function () {
    return (
      <div className="tsz-timesheet-detail">
        <div>
          <div className="row">
            <div className="col-xs-12">
              <TimesheetForm timesheet={this.state.timesheet}
                saveText={this.state.saveText}
                onSave={this.editTimesheet}
                onCancel={this.onCancel} />
            </div>
          </div>

          <div className="row">
            <hr/>
          </div>

          <Timeunits timesheet={this.state.timesheet} />
        </div>
      </div>
    );
  }
});

module.exports = TimesheetDetail;
