var _     = require('./../../bower_components/underscore/underscore'),
    utils = require('./utils');

/**
 *  Defines a thumb object
 *
 *  @private
 *  @class _Thumb
 *  @param {DOMElement} el The DOM element
 */
function _Thumb ( el ) {

  var self = this;

  self.el = el;
  self.isActive = false;
}


// Static property others defines all the other thumb items
_Thumb.others = [];


/**
 *  Kicks off the thumb element
 * 
 *  @method init
 *  @return {Void}
 */
_Thumb.prototype.init = function () {

  var self = this;

  self._parseTitle();
  // self._bind( true );

};


_Thumb.prototype._parseTitle = function () {

  var self = this,
      titleEl,
      tempTitle;

  titleEl = self.el.querySelector('.Preview-title');

  if ( !titleEl || !titleEl.innerHTML ) return;
  // ------------------------------------------

  titleEl.innerHTML = utils.getFirstLine( titleEl );
};












/**
 *  Defines a thumb hover object
 *
 *  @class ThumbHandler
 */
function ThumbHandler ( pluginHandler ) {

  var self = this;

  self.pluginHandler = pluginHandler;
  self.items = [];
  self.bottomOffset = -200; // 0

  function _handleScroll ( ev ) {

    self._scrollPage( ev );
  }

  self._handleScroll = _.throttle( _handleScroll, 500 );
  // self._handleScroll = _handleScroll;
}


/**
 *  Kicks off the thumb hover object
 * 
 *  @method init
 *  @return {Void}
 */
ThumbHandler.prototype.init = function ( selector, containerEl ) {

  var self = this;

  console.log('> ThumbHandler: init');

  self._tearDown();

  self.pageEl = document.querySelector( '.Page-inner' );
  self.el = containerEl && containerEl instanceof Element ? containerEl : document;

  self._setItems( selector );
};


ThumbHandler.prototype._tearDown = function () {

  var self = this;

  self.items = [];
};


ThumbHandler.prototype.addItems = function ( wrappedItems ) {

  var self = this,
      count = wrappedItems.length,
      tempEl,
      tempThumb;

  while ( count-- ) {

    tempEl = wrappedItems[count].querySelector('.Preview');

    if ( !tempEl ) continue;
    // ---------------------

    tempThumb = new _Thumb( tempEl );
    tempThumb.init();
    self.items.push( tempThumb );
  }

  _Thumb.others = self.items;
};


/**
 *  Populates the thumb items based on a selector query
 *
 *  @private
 *  @method _setItems
 *  @param {String} [selector] DOM element selector for items
 *  @return {Void}
 */
ThumbHandler.prototype._setItems = function ( selector ) {

  var self = this,
      els = self.el.querySelectorAll( selector || '.Preview' ),
      count = els.length,
      tempThumb;

  while ( count-- ) {

    tempThumb = new _Thumb( els[count] );
    tempThumb.init();
    self.items.push( tempThumb );
  }

  _Thumb.others = self.items;
};


module.exports = ThumbHandler;
