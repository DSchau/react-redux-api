describe('Wrapping Superagent: ', function () {
  var superagent;

  beforeEach(function () {
    superagent = require('./agent.promise');
  });

  it('should wrap superagent', function () {
    expect(superagent).to.be.defined;
  });
});
