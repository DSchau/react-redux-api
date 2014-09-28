var store = require('../flux/flux.store');
var constants = require('../flux/flux.constants');
var merge = require('react/lib/merge');

var TimesheetStore = merge(store.prototype, {

  initialize: function () {
    this.timesheets = [];

    this.bindActions(
      constants.LIST_TIMESHEETS, this.list
    );
  },

  list: function () {

    this.emit('change');
  },

  getState: function () {
    return {
      timesheets: this.timesheets
    };
  }

});

module.exports = TimesheetStore;