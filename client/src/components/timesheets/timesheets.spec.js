var React = require('react/addons'),
  TestUtils = React.addons.TestUtils;

describe('Timesheets Component: ', function () {

  var Timesheets;

  beforeEach(function () {
    Timesheets = require('./timesheets');
  });

  it('should instantiate the Timesheets', function () {
    expect(Timesheets).to.be.defined;
  });
});
