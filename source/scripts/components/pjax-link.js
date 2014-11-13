var utils       = require('./utils'),
    Page        = require('./page');

/**
 *  Defines a PJAX Link object
 *
 *  @class PjaxLink
 *  @param {DOMElement} el DOM Element for this link
 *  @return {PjaxLink} self
 */
function PjaxLink ( el, pjaxHijack ) {

  var self = this;

  self.pjaxHijack = pjaxHijack;
  self.el = el;
  self.href = el.href || '';
  self.containerEl;
  self.currentPage;

  self._handleClick = function ( ev ) {

    utils.preventDefault(ev);
    self.loadContent();
  };

  return self;
}


/**
 *  Kicks off this PjaxLink instance
 *
 *  @method init
 *  @return {PjaxLink} self
 */
PjaxLink.prototype.init = function () {

  var self = this;

  self._setContainer();

  self.el.addEventListener( 'click', self._handleClick );
  self.el.addEventListener( 'touchdown', self._handleClick );

  self.el.addClass('pjax-bound');

  return self;
};

PjaxLink.prototype._tearDown = function () {

  var self = this;

  self.el.removeEventListener( 'click', self._handleClick );
  self.el.removeEventListener( 'touchdown', self._handleClick );

  self.el.removeClass('pjax-bound');

  return self;
};


/**
 *  Selects the correct destination container for
 *  this link
 *
 *  @method _setContainer
 *  @return {PjaxLink} self
 */
PjaxLink.prototype._setContainer = function () {

  var self = this;

  self.containerSelector = '#Chrome-page';

  self.containerEl = document.querySelector( self.containerSelector );
  
  if ( !self.containerEl ) {
    
    self.containerEl = document.querySelector( '#Chrome-page' );
  }

  return self;
}


PjaxLink.prototype.loadContent = function ( force ) {

  var self = this;

  function _handleHTML ( html ) {

    var tempEl,
        tempContainer,
        tempContent,
        newPage;

    self.updateUrl();
    
    tempEl = document.createElement( 'tempEl' );
    tempEl.innerHTML = html;

    // Find correlating container in new content
    tempContainer = tempEl.querySelector( self.containerSelector );

    if ( !tempContainer || !tempContainer.innerHTML ) return;
    // ------------------------------------------------------

    newPage = new Page( tempContainer.firstElementChild, self.href );

    self.pjaxHijack.pageHandler.flipPages( newPage, function () {

      self.pjaxHijack.afterCallback();
    });
  }

  if( !Modernizr.csstransitions ){
    window.location.href = self.href;
    return;
    // ----
  }

  if ( force || document.location.href !== self.href ) {
    
    self._getHTML( _handleHTML );
  }
}


PjaxLink.prototype.updateUrl = function () {

  var self = this;

  if( document.location.href !== self.href ){
    window.history.pushState(null, "Urrrr", self.href);
    
    // tracking
    if ( window.ga ) ga( 'send', 'pageview', document.location.pathname );
  }
};


PjaxLink.prototype._getHTML = function ( cb ) {

  var self = this,
      request;

  if ( !self.href || !cb || typeof cb != 'function' ) return;
  // --------------------------------------------------------

  request = new XMLHttpRequest();
  request.open('GET', self.href, true);

  // Error handler
  _handleError = function () {

    self.pjaxHijack.pluginHandler.loadingHandler.finish();
    window.location.href = self.href;
  };

  // Response handler
  _handleResponse = function () {
    
    self.pjaxHijack.pluginHandler.loadingHandler.finish();

    if (request.status >= 200 && request.status < 400){
    
      cb( request.responseText );
    
    } else {
      
      _handleError();
    }
  };

  self.pjaxHijack.pluginHandler.loadingHandler.start();

  // Bind error response
  request.onerror = _handleError;

  // Bind request response
  request.onload = _handleResponse;

  // Make request
  request.send();
};


module.exports = PjaxLink;
