/**
 * Config.
 *
 * @param $stateProvider
 * @ngInject
 */
function config($stateProvider) {
  // Register states
  $stateProvider

    // Welcome
    .state({
      name: "home",
      parent: "app",
      url: "/",
      templateUrl: "app/workshop/templates/home.html"
    })
    .state({
      name: "subitem1",
      parent: "app",
      url: "/subitem1",
      templateUrl: "app/workshop/templates/subitem1.html"
    });
}

angular
  .module("workshop", ["ui.router", "templates", "ui.bootstrap.collapse"])
  .config(config);
