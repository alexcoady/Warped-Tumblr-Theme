var utils         = require('./utils'),
    PjaxLink      = require('./pjax-link'),
    PageHandler   = require('./page-handler');


function CloseHandler ( pluginHandler ) {

  var self = this;

  self.pluginHandler = pluginHandler;
  self.pageHandler = PageHandler.getInstance();

  self._handleClick = function (ev) {

    var pjaxLink;

    utils.preventDefault( ev );

    if ( self.closeEl.href ) {

      pjaxLink = new PjaxLink( self.closeEl, self.pluginHandler.pjaxHijack );
      pjaxLink.init();
      pjaxLink.loadContent( true );
      pjaxLink._tearDown();

    } else {

      self.pageHandler.flipPages();
    }
  };
}

CloseHandler.prototype.init = function ( selector, containerEl, prevURL ) {

  var self = this,
      selector = selector || '.Close',
      containerEl = containerEl && containerEl instanceof Element ? containerEl : document;

  self.closeEl = containerEl.querySelector( selector );

  if ( !self.closeEl ) return;
  // -------------------------

  self._bind( true, prevURL );
};


CloseHandler.prototype._bind = function ( bind, prevURL ) {
  
  var self = this;

  if ( prevURL ) {

    self.closeEl.href = prevURL;
  }

  if ( bind ) {

    self.closeEl.addEventListener( 'click', self._handleClick );
    self.closeEl.addEventListener( 'touchenter', self._handleClick );
  
  } else {

    self.closeEl.removeEventListener( 'click', self._handleClick );
    self.closeEl.removeEventListener( 'touchenter', self._handleClick );
  } 
};


module.exports = CloseHandler;