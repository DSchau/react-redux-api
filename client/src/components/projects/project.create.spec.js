var React = require('react/addons'),
  TestUtils = React.addons.TestUtils;

describe('Project Create Component: ', function () {

  var ProjectCreate;

  beforeEach(function () {
    ProjectCreate = require('./project.create');
  });

  it('should instantiate the ProjectCreate', function () {
    expect(ProjectCreate).to.be.defined;
  });
});
