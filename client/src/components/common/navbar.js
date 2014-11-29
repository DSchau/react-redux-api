/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('lodash');
var Router = require('react-router');
var Link = Router.Link;
var ActiveState = Router.State;

var LoginStore = require('../../stores/login.store');
var LoginActions = require('../../actions/login.actions');

var NavBar = React.createClass({
  mixins: [
    Router.State
  ],

  getInitialState: function () {
    return {
      title: 'Timesheetz',
      user: {
        _id: LoginStore.getState().user._id || 'all'
      }
    };
  },

  updateActiveState: function () {
    var activeRoutes = this.getRoutes();
    this.setState({
      projectsActive: _.contains(activeRoutes, 'projects'),
      employeesActive: _.contains(activeRoutes, 'employees'),
      timesheetsActive: _.contains(activeRoutes, 'timesheets')
    });
  },

  logout: function () {
    LoginActions.logout();
  },

  onLoginChange: function () {
    this.setState({
      user: LoginStore.getState().user
    });
  },

  componentWillMount: function () {
    LoginStore.addChangeListener(this.onLoginChange);
  },

  componentWillUnmount: function () {
    LoginStore.removeChangeListener(this.onLoginChange);
  },

  render : function () {
    var cx = React.addons.classSet;

    var projectsClasses = cx({
      active: this.state.projectsActive
    });

    var employeesClasses = cx({
      active: this.state.employeesActive
    });

    var timesheetsClasses = cx({
      active: this.state.timesheetsActive
    });

    return (
      <div className="navbar navbar-default navbar-static-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              <i className="fa fa-clock-o fa-lg"/> {this.state.title}
            </a>
          </div>
          <ul if="authenticated" className="nav navbar-nav navbar-left">
            <li className={projectsClasses}>
              <Link to="projects">Projects</Link>
            </li>
            <li className={employeesClasses}>
              <Link to="employees">Employees</Link>
            </li>
            <li className={timesheetsClasses}>
              <Link to="timesheets" params={{user_id: this.state.user._id}}>Timesheets</Link>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a className="navbar-brand logout" onClick={this.logout}>
                <i className="fa fa-power-off"/> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = NavBar;
