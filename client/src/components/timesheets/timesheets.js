/** @jsx React.DOM */

var React = require('react/addons');
var Router = require('react-router');

var TimesheetTable = require('./timesheet.table');
var ChangeMixin = require('../../mixins/change.mixin');

var TimesheetActions = require('../../actions/timesheet.actions');
var TimesheetStore = require('../../stores/timesheet.store');

var Timesheets = React.createClass({

  mixins: [
    Router.Navigation,
    ChangeMixin
  ],

  store: TimesheetStore,

  requestTimesheets: TimesheetActions.list,

  getInitialState: function () {
    return this.store.getState();
  },

  createNew: function () {
    return this.transitionTo('timesheets.create', {user_id: '123'});
  },

  componentDidMount: function () {
    this.requestTimesheets();
  },

  render: function () {
    return (
      <div className="tsz-timesheet-list">
        <div>
          <div className="row tsz-form-row">
            <div className="col-sm-2 pull-right">
              <button className="ui right floated primary button" type="button" onClick={this.createNew}>
                <i className="icon-plus"/> New Timesheet
              </button>
            </div>
          </div>
          <div className="row">
            <div className="row">
              <TimesheetTable timesheets={this.state.timesheets} />
            </div>
          </div>

          <div className="text-center">
            <div pagination
              total-items="pageConfig.totalItems"
              ng-model="pageConfig.page"
              items-per-page="pageConfig.limit"
              boundary-links="true"
              rotate="true"
              ng-change="requestTimesheets(page)">
            </div>
          </div>

        </div>
      </div>
    );
  }
});

module.exports = Timesheets;
