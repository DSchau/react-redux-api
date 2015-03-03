var _ = require('lodash');
var Store = require('../flux/flux.store');
var actions = require('../actions/employee.actions');
var NotificationsAction = require('../actions/notifications.actions');
var agent = require('../services/agent.promise');

var EmployeeStore = _.extend(_.clone(Store), {

  initialize: function () {
    var events = {};
    events[actions.LIST]    = this.list;
    events[actions.GET]     = this.get;
    events[actions.UPDATE]  = this.update;
    events[actions.DELETE]  = this.remove;
    events[actions.RESTORE] = this.restore;
    events[actions.CREATE]  = this.create;
    this.register(events);

    this.setState({
      employee: {},
      pageConfig: {
        data: [],
        totalItems: 0,
        limit: 5,
        page: 1
      }
    });

    return this;
  },

  url: function (employeeId) {
    var url = '/users';
    if (employeeId) {
      url += '/' + employeeId;
    }

    return url;
  },

  list: function (payload) {
    var self = this;

    return agent.get(this.url())
      .query(payload.action.query)
      .end()
      .then(function (res) {
        self.setState({pageConfig: res.body});
      })
      .catch(function (x) {
        NotificationsAction.error('Error attempting to retrieve employees.');
      });
  },

  get: function (payload) {
    var self = this;

    return agent.get(this.url(payload.action.employee._id))
      .end()
      .then(function (res) {
        self.setState({employee: res.body});
        return true;
      })
      .catch(function (data) {
        NotificationsAction.error('There was an error getting the employee');
      });
  },

  update: function (payload) {
    var self = this;
    var employee = payload.action.employee;

    return agent.put(this.url(employee._id))
      .send(employee)
      .end()
      .then(function (res) {
        self.setState({employee: res.body});
        NotificationsAction.success('Employee : ' + employee.username + ', updated.');
      })
      .catch(function (x) {
        NotificationsAction.error('There was an error updating employee.');
      });
  },

  remove: function (payload) {
    var self = this;
    var employee = payload.action.employee;
    employee.deleted = true;

    return agent.put(this.url(employee._id))
      .send(employee)
      .end()
      .then(function (res) {
        self.setState({employee: res.body});
        NotificationsAction.success('Employee : ' + res.body.username + ', was deleted.');
        return true;
      })
      .catch(function (x) {
        NotificationsAction.error('Error attempting to delete employee.');
      });
  },

  restore: function (payload) {
    var self = this;
    var employee = payload.action.employee;
    employee.deleted = false;

    return agent.put(this.url(employee._id))
      .send(employee)
      .end()
      .then(function (res) {
        self.setState({employee: res.body});
        NotificationsAction.success('Employee : ' + res.body.username + ', was restored.');
        return true;
      })
      .catch(function (x) {
        NotificationsAction.error('Error attempting to restore employee.');
      });
  },

  create: function (payload) {
    var self = this;

    return agent.post(this.url())
      .send(payload.action.employee)
      .end()
      .then(function (res) {
        self.setState({employee: res.body});
        NotificationsAction.success('Employee : ' + res.body.username + ', created.');
      })
      .catch(function (x) {
        NotificationsAction.error('There was an error creating employee.');
      });
  }
});

module.exports = EmployeeStore.initialize();
