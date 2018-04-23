/**
 * App controller.
 *
 * @constructor
 */
function AppCtrl() {
  Array.prototype.having = function( property, value ) {
    return this.filter( function( el ) {
      if ( el[ property ] && value && typeof( el[ property ] ) === "string" ) {
        return el[ property ].toLowerCase( ) === value.toLowerCase( );
      }
      
      return el[ property ] === value;
    } );
  };
}

angular
  .module("app")
  .controller("AppCtrl", AppCtrl);
