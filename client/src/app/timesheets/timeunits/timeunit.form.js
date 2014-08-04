/** @jsx React.DOM */

var React = require('React');

var TimeunitForm = React.createClass({
  
  render : function () {
    return (

      <div class="tsz-timeunit-form" ng-cloak>
        <div class="row">
          <div class="col-xs-12">
            <form class="form-horizontal" novalidate name="timeunitForm">

              <div class="form-group">
                <div tsz-field-wrap input-id="timeunit-project" label="Project">
                  <select ui-select2="projectSelect"
                    name="timeunit-project"
                    ng-model="timeunit.project" 
                    data-placeholder="Select Project..." required>
                    <option value=""></option>
                    <option ng-repeat="project in projects" value="{{project.name}}">{{project.name}}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <div tsz-field-wrap input-id="timeunit-dateWorked" label="Date">
                  <div class="input-group">
                    <input type="text" class="form-control" 
                      datepicker-popup="MM/dd/yyyy"
                      ng-model="timeunit.dateWorked"  
                      show-weeks="false"
                      show-button-bar="false"
                      min="timesheet.beginDate"
                      max="timesheet.endDate"
                      ng-required="true" 
                      close-text="Close" />
                    <span class="input-group-btn">
                      <button class="btn btn-default">
                        <i class="fa fa-fw fa-calendar"></i>
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div tsz-field-wrap input-id="timeunit-hoursWorked" label="Hours">
                  <input type="number" class="form-control" 
                    name="timeunit-hoursWorked" placeholder="Hours Worked"
                    ng-model="timeunit.hoursWorked" 
                    required>
                </div>
              </div>

              <div class="row">
                <hr/>
              </div>

              <div class="row">
                <div class="col-sm-2 col-sm-offset-8">
                  <button class="btn btn-primary btn-block" 
                    ng-click="save()"
                    ng-disabled="timeunitForm.$invalid">Save</button>
                </div>
                <div class="col-sm-2">
                  <button class="btn btn-danger btn-block" ng-click="cancel()">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    );
  }
});

module.exports = TimeunitForm;
