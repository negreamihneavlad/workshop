/**
 * Config.
 *
 * @param $urlRouterProvider
 * @param $locationProvider
 * @ngInject
 */
function config($urlRouterProvider, $locationProvider) {

  // If no url matched redirect to home
  $urlRouterProvider.otherwise("/");
  $locationProvider.html5Mode(true);
}

angular
  .module("app", [
    "workshop",
    "layout"
  ])
  .config(config);
