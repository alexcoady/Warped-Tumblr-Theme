var utils       = require('./utils'),
    Page        = require('./page'),
    PjaxLink    = require('./pjax-link'),
    _           = require('./../../bower_components/underscore/underscore'),
    PageHandler = require('./page-handler');


function PjaxHijack ( pluginHandler ) {

  var self = this;

  self.pluginHandler = pluginHandler;
  self.items = [];
  self.callbacks = [];

  self.ignoreClasses = [
    'more_notes_link',
    'tumblelog',
    'no-pjax'
  ];

  self.pageHandler = PageHandler.getInstance();
}

PjaxHijack.prototype.init = function ( selector, containerEl, isFirst ) {
    
  var self = this,
      containerEl;

  console.log('> PjaxHijack: init');

  self._tearDown();

  if ( isFirst ) containerEl = document;

  self._setItems( selector, containerEl );
  self.callbacks = [];
  self.currentHref = document.location.href;

  // listen to onpopstate
  _.bindAll( self, '_onPopState' );
  window.onpopstate = self._onPopState;
}


PjaxHijack.prototype._tearDown = function () {

  var self = this,
      count = self.items.length;

  while ( count-- ) {

    if ( document.body.contains(self.items[count].el) ) continue;
    self.items[count]._tearDown();
  }

  window.onpopstate = null;
};


PjaxHijack.prototype._onPopState = function ( event ) {

  var self = this,
      tempEl,
      tempItem;

  if( self.currentHref === document.location.href ) return;
  // ------------------------------------------------------

  self.currentHref = document.location.href;

  // create ghost link element with current href
  tempEl = document.createElement( 'a' );
  tempEl.setAttribute( 'href', self.currentHref );

  // create, initialize, force click and dispose
  tempItem = new PjaxLink( tempEl, self );
  tempItem.init();
  tempItem.loadContent( true );
  tempItem._tearDown();
};



PjaxHijack.prototype.addItems = function ( items ) {

  var self = this
      count = items.length;

  while ( count-- ) {

    self._setItems( null, items[count] );
  }

  return self;
};


PjaxHijack.prototype._setItems = function ( selector, containerEl ) {

  var self = this,
      selector = selector || 'a',
      containerEl = containerEl && containerEl instanceof Element ? containerEl : document,
      els = containerEl.querySelectorAll( selector ),
      count = els.length,
      tempItem;

  while ( count-- ) {

    if ( !els[count].href || els[count].href === '#' || els[count].target === '_blank' ) continue;
    // -------------------------------------------------------------------------------------------

    if ( els[count].hasClass( self.ignoreClasses ) ) continue;
    // -------------------------------------------------------

    tempItem = new PjaxLink( els[count], self );
    tempItem.init();
    self.items.push( tempItem );
  }
};

PjaxHijack.prototype.after = function ( fn ) {

  if ( _.isFunction(fn) ) this.callbacks.push( fn );
};


PjaxHijack.prototype.afterCallback = function () {

  var self = this;

  self.callbacks.forEach(function (fn) {
    fn(self);
  });
};



module.exports = PjaxHijack;






