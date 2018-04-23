/**
 * Config.
 *
 * @param $stateProvider
 * @ngInject
 */
function config($stateProvider) {

  // Register abstract states
  $stateProvider

    // App state
    .state({
      name: "app",
      abstract: true,
      templateUrl: "app/layout/common/templates/app.html"
    });

}

angular
  .module("layout", [])
  .config(config);
