var utils = require('./utils');


/**
 *  Defines a toggle button object
 *
 *  @private
 *  @class _ToggleMenuButton
 *  @param {DOMElement} el The DOM element
 *  @param {Object} menu The menu object
 */
function _ToggleMenuButton ( el, menu ) {

  var self = this;

  self.el = el;
  self.menu = menu;

  self._handleClick = function ( ev ) {

    utils.preventDefault(ev);
    if (ev) ev.stopPropagation();
    self.menu.toggle();
  };
}


/**
 *  Kicks off the toggle button element by binding
 *  its click event to the related menu object
 *
 *  @method init
 */
_ToggleMenuButton.prototype.init = function () {

  var self = this;

  self.el.addEventListener( 'click', self._handleClick );
  self.el.addEventListener( 'touchstart', self._handleClick );
};


/**
 *
 *  @private
 *  @method _tearDown
 */
_ToggleMenuButton.prototype._tearDown = function () {

  var self = this;

  self.el.removeEventListener( 'click', self._handleClick );
  self.el.removeEventListener( 'touchstart', self._handleClick );
  self.menu = null;
};


/**
 *  Applies an active or inactive class to this object's element
 *
 *  @private
 *  @method _updateState
 *  @param {Boolean} active New active state of this element
 */
_ToggleMenuButton.prototype._updateState = function ( active ) {

  active ? this.el.addClass('is-active') : this.el.removeClass('is-active');
};


/**
 *  Applies active or inactive state to a number of passed objects
 *
 *  @static
 *  @private
 *  @method _updateState
 *  @param {Array} items Array of toggle buttons to update state
 *  @param {Boolean} active New active state of these element
 */
_ToggleMenuButton._updateState = function ( items, active ) {

  var count = items.length;
  while ( count-- ) {

    items[count]._updateState( active );
  }
};


/**
 *  Applies active state to a number of passed objects
 *
 *  @static 
 *  @method makeActive
 *  @param {Array} items Array of toggle buttons to activate
 */
_ToggleMenuButton.makeActive = function ( items ) {

  _ToggleMenuButton._updateState( items, true );
};


/**
 *  Applies inactive state to a number of passed objects
 *
 *  @static
 *  @method makeInactive
 *  @param {Array} items Array of toggle buttons to deactivate
 */
_ToggleMenuButton.makeInactive = function ( items ) {

  _ToggleMenuButton._updateState( items, false );
};


module.exports = _ToggleMenuButton;