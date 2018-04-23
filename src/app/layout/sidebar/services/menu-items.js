/**
 * Menu items.
 *
 * @param SIDEBAR_MENU_ITEMS
 * @returns {{getItems: getItems}}
 * @constructor
 * @ngInject
 */
function MenuItems(SIDEBAR_MENU_ITEMS) {
  return {
    getItems: getItems
  };

  //////////////////////////////

  /**
   * Get menu items.
   *
   * @returns {Array}
   */
  function getItems() {
    return _.map(SIDEBAR_MENU_ITEMS, function (item) {
      item.params = {};
      item.options = {
        inherit: false
      };

      return item;
    });
  }
}

angular
  .module("layout")
  .service("MenuItems", MenuItems);
