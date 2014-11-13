var _ToggleMenuButton = require('./toggle-menu-button'),
    utils = require('./utils'),
    transitionend = utils.getTransitionEnd();


/**
 *  Defines a togglable menu object
 *
 *  @class MenuToggle
 */
function MenuToggle () {

  var self = this;

  self._toggleItems = [];

  self._handleBodyClick = function ( ev ) {

    self.close();
  }

  self._handleSocialClick = function ( ev ) {

    ev.stopPropagation();
  };

  self._handleSelfClick = function ( ev ) {

    ev.stopPropagation();
    self.close();
  }
}


/**
 *  Kicks off the togglable menu object
 *
 *  @method init
 *  @param {String} [selector] DOM element selector
 *  @param {String} [toggleSelector] DOM element selector for toggle buttons
 */
MenuToggle.prototype.init = function ( selector, toggleSelector ) {

  var self = this,
      selector = selector || '#NavMenu',
      containerEl = document;

  if ( self.el ) self._tearDown();

  self.el = containerEl.querySelector( selector );
  self.socialEl = self.el.querySelector( '.Menu-list--social' );
  
  self.bodyEl = document.body;
  self.htmlEl = document.querySelector( 'html' );
  
  if ( !self.el ) return;
  // --------------------

  self._setToggles( toggleSelector );

  if ( self.socialEl ) self.socialEl.addEventListener( 'click',  self._handleSocialClick );
  self.bodyEl.addEventListener( 'click',  self._handleBodyClick );
  self.el.addEventListener( 'click', self._handleSelfClick );
};


MenuToggle.prototype._tearDown = function () {

  var self = this,
      toggleCount = self._toggleItems.length;

  if ( self.socialEl ) self.socialEl.removeEventListener( 'click',  self._handleSocialClick );
  self.bodyEl.removeEventListener( 'click',  self._handleBodyClick );
  self.el.removeEventListener( 'click', self._handleSelfClick );

  while ( toggleCount-- ) {

    self._toggleItems[toggleCount]._tearDown();
  }

  self._toggleItems = [];
};


/**
 *  Finds all the toggle buttons that will bind to this
 *  nav element and initialises them
 *
 *  @private
 *  @method _setToggles
 *  @param {String} [selector] DOM element selector
 */
MenuToggle.prototype._setToggles = function ( selector ) {

  var self = this,
      els = document.querySelectorAll( selector || '.MenuToggle' ),
      count = els.length,
      tempItem;



  while ( count-- ) {

    tempItem = new _ToggleMenuButton( els[count], self );
    tempItem.init();
    this._toggleItems.push( tempItem );
  }
};


/**
 *  Toggles the state of the menu (active/inactive)
 *
 *  @method toggle
 *  @param {Event} [ev] Event from handler
 */
MenuToggle.prototype.toggle = function (ev) {

  var self = this;

  if (ev) ev.stopPropagation();
  utils.preventDefault(ev);

  self.el.hasClass('is-active') ? self.close() : self.open();
};


/**
 *  Opens the menu
 *
 *  @method open
 */
MenuToggle.prototype.open = function () {

  var self = this;
    
  _ToggleMenuButton.makeActive( self._toggleItems );
    
  function _handleTransitionEnd ( ev ) {

    if ( ev.propertyname === 'visibility' ) return;
    self.el.removeEventListener( transitionend, _handleTransitionEnd );
  }
  
  self.el.addEventListener( transitionend, _handleTransitionEnd );
  
  self.el.addClass( 'is-active' );
  self.htmlEl.addClass( 'menu-active' );
};


/**
 *  Closes the menu
 *
 *  @method close
 */
MenuToggle.prototype.close = function () {

  var self = this;
    
  _ToggleMenuButton.makeInactive( self._toggleItems );
  
  function _handleTransitionEnd ( ev ) {
    if ( ev.propertyname === 'visibility' ) return;
    self.el.removeEventListener( transitionend, _handleTransitionEnd );
  }
  
  self.el.addEventListener( transitionend, _handleTransitionEnd );

  self.el.removeClass( 'is-active' );
  self.htmlEl.removeClass( 'menu-active' );
};


module.exports = MenuToggle;
