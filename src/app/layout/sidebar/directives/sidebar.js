/**
 * Sidebar controller.
 *
 * @param $rootScope
 * @param $scope
 * @param $element
 * @param MenuItems
 * @ngInject
 */
function SidebarCtrl($rootScope, $scope, $element, MenuItems) {
  var body;
  var CLASS_SIDEBAR_OPEN = "is-open";
  var CLASS_HAS_SIDEBAR_OPEN = "has-sidebarOpen";

  var vm = this;
  vm.menuItems = MenuItems.getItems();

  //////////////////////////////

  activate();

  //////////////////////////////

  /**
   * Activate.
   */
  function activate() {
    body = angular.element("body");
    $element.on("mouseenter", onMouseEnter);
    $element.on("mouseleave", onMouseLeave);

    $scope.$on("$destroy", destroy);
  }

  /**
   * Event handler for mouse enter.
   */
  function onMouseEnter() {
    $element.addClass(CLASS_SIDEBAR_OPEN);
    body.addClass(CLASS_HAS_SIDEBAR_OPEN);
  }

  /**
   * Event handler for mouse leave.
   */
  function onMouseLeave() {
    $element.removeClass(CLASS_SIDEBAR_OPEN);
    body.removeClass(CLASS_HAS_SIDEBAR_OPEN);
  }

  /**
   * Destroy.
   */
  function destroy() {
    body.removeClass(CLASS_HAS_SIDEBAR_OPEN);
  }
}

/**
 * Sidebar.
 *
 * @returns {{templateUrl: string, replace: boolean, bindToController: boolean, controller: SidebarCtrl, controllerAs: string}}
 */
function sidebar() {
  return {
    templateUrl: "app/layout/sidebar/templates/sidebar.html",
    replace: true,
    bindToController: true,
    controller: SidebarCtrl,
    controllerAs: "sidebar"
  };
}

angular
  .module("layout")
  .directive("sidebar", sidebar);
