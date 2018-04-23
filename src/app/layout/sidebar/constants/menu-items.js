var SIDEBAR_MENU_ITEMS = [
  {
    title: "Title",
    icon: "icon1",
    subitems: [
      {
        id: 1,
        title: "Subitem1",
        state: "subitem1"
      },
      {
        id: 2,
        title: "Subitem2",
        state: "subitem2"
      },
      {
        id: 3,
        title: "Subitem3",
        state: "subitem3"
      },
      {
        id: 4,
        title: "Subitem4",
        state: "subitem4"
      },
      
    ],
    ui: {
      expanded: false
    }
  },
  {
    title: "Title1",
    icon: "icon1",
    subitems: [
      {
        id: 2,
        title: "Subitem1",
        state: "subitem1"
      },
      {
        id: 1,
        title: "Subitem2",
        state: "subitem2"
      },
      {
        id: 1,
        title: "Subitem3",
        state: "subitem1"
      },
    ],
    ui: {
      expanded: false
    }
  },
  {
    title: "Title2",
    icon: "icon1",
    subitems: [
      {
        id: 3,
        title: "Subitem1",
        state: "subitem1"
      }
    ],
    ui: {
      expanded: false
    }
  }
];

angular
  .module("layout")
  .constant("SIDEBAR_MENU_ITEMS", SIDEBAR_MENU_ITEMS);
