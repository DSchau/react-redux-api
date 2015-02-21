var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var LoginStore = require('../stores/login.store');

var Index = React.createClass({
  mixins: [
    Router.State,
    Router.Navigation
  ],

  render : function () {
    return (<RouteHandler />);
  }
});

module.exports = Index;
