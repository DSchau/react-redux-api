describe('Auth Error Component: ', function () {

  var AuthError;

  beforeEach(function () {
    AuthError = require('./auth.error');
  });

  it('should instantiate the AuthError', function () {
    expect(AuthError).toBeDefined();
  });
});
