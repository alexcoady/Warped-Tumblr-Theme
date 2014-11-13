var _             = require('./../../bower_components/underscore/underscore'),
    utils 	      = require('./utils');


function InfiniteScroll ( pluginHandler ) {

	var self = this;

  self.pluginHandler = pluginHandler;
  self.callbacks = [];

	self._handleMoreClick = function ( ev ) {

		utils.preventDefault( ev );
		self.loadMore();
	};

  function _handleScroll ( ev ) {

    self._scrollPage( ev );
  };

  self._handleScroll = _.throttle( _handleScroll, 500 );
}


InfiniteScroll.prototype.init = function ( selector, containerEl ) {
	
	var self = this,
      selector = selector || '.Page-listing',
      containerEl = containerEl && containerEl instanceof Element ? containerEl : document;;

  console.log( '> InfiniteScroll: init' );

  self._tearDown();

  self.allLoaded = false;
  self.bottomOffset = 400;

  self.el = containerEl.querySelector( selector );
  self.docEl = window.document.documentElement;
  self.pageEl = containerEl.querySelector( '.Page-inner' );

  if ( self.el ) {

    // If plugin required on page, kick off
    self._bindLink( null, true );
    self._bindScroll( true ); // temp hack
  }

  return self;
};



InfiniteScroll.prototype._tearDown = function () {

  var self = this;

  self._bindLink( null, false );
  self._bindScroll( false );
};


/**
 *  Binds the load more link
 *
 *  @method _bindLink
 */
InfiniteScroll.prototype._bindLink = function ( selector, bind ) {
	
	var self = this,
			selector = selector || '.Pagination-more';

	self.moreEl = self.el && self.el.querySelector( selector );

	if ( !self.moreEl ) return self;
	// ------------------------------
  
	self.containerSelector = '.' + ( self.moreEl.getAttribute('data-item-container') || 'ThumbCollection' );
	self.containerEl = self.el.querySelector( self.containerSelector );
  self.isFixed = self.containerEl.hasClass('ThumbCollection--fixed');

	if ( bind ) {

		self.moreEl.addEventListener( 'click', self._handleMoreClick );

	} else {

		self.moreEl.removeEventListener( 'click', self._handleMoreClick );
	}
};



/**
 *  Binds scrolling to bottom of page
 *
 *  @method _bindLink
 */
InfiniteScroll.prototype._bindScroll = function ( bind ) {
  
  var self = this;

  if ( bind && self.pageEl ) {

    window.addEventListener( 'scroll', self._handleScroll );

  } else {

    window.removeEventListener( 'scroll', self._handleScroll );
  }
};


InfiniteScroll.prototype.scrollY = function () {

  return window.pageYOffset || this.docEl.scrollTop;
}



/**
 *  Handles the scrolling of the page
 *
 *  @private
 *  @method _scrollPage
 *  @param {Event} ev The window.scroll event
 *  @return {Void}
 */
InfiniteScroll.prototype._scrollPage = function ( ev ) {

  var self = this,
      scrollVal = self.scrollY(),
      offsetHeight = self.pageEl.offsetHeight;

  if ( (window.innerHeight + scrollVal + self.bottomOffset) >= offsetHeight && offsetHeight > 0 ) {

    self.loadMore();
  }
};


InfiniteScroll.prototype.getBetweenTags = function ( value, startTag, endTag ) {
  var startIndex = value.indexOf( startTag ) + startTag.length;
  var endIndex = value.indexOf( endTag );
  return value.substr( startIndex, endIndex - startIndex );
};


InfiniteScroll.prototype.loadMore = function () {
	
	var self = this,
      tempMoreEl,
      buttonText;


	if ( self.lockControls || self.allLoaded || !self.moreEl ) return;
	// ---------------------------------------------------------------

  console.log('Load more');

	self.lockControls = true;

  buttonText = self.moreEl.innerHTML;
  self.moreEl.innerHTML = 'Loading';

	self._getHTML(function ( response ) {

    var collectionHtml = self.getBetweenTags( response, '<!--start-collection-->', '<!--end-collection-->' );
    var moreHtml = self.getBetweenTags( response, '<!--start-more-->', '<!--end-more-->' );
    tempMoreEl = document.createElement('tempEl');
    tempMoreEl.innerHTML = moreHtml;
    tempMoreEl = tempMoreEl.querySelector( '.Pagination-more' );

    if ( self.isFixed ) {

      self.containerEl.innerHTML += collectionHtml;
      if ( self.pluginHandler ) self.pluginHandler.afterInfiniteScroll( collectionHtml, true );

    } else {

      self.afterCallback( collectionHtml );
      
    }

    // Swap out button href
    if ( tempMoreEl &&  tempMoreEl.href ) {

      self.moreEl.href = tempMoreEl.href;
      self.moreEl.innerHTML = buttonText;
    
    } else {

      console.log('> InfiniteScroll: loadMore - No more results');

      self._tearDown();
      self.allLoaded = true;
      self.moreEl.addClass('is-disabled');
      self.moreEl.innerHTML = 'All posts loaded';
    }

		self.lockControls = false;
	});
};


// Goes to that page
InfiniteScroll.prototype._getHTML = function ( cb ) {

  var self = this,
      request;

  if ( !self.moreEl.href || !cb || typeof cb != 'function' ) return;
  // ---------------------------------------------------------------

  request = new XMLHttpRequest();
  request.open('GET', self.moreEl.href, true);

  // Error handler
  _handleError = function () {
    window.location.href = self.moreEl.href;
  };

  // Response handler
  _handleResponse = function () {

    if (request.status >= 200 && request.status < 400){
    
      cb( request.responseText );
    
    } else {
      
      _handleError();
    }
  };

  // Bind error response
  request.onerror = _handleError;

  // Bind request response
  request.onload = _handleResponse;

  // Make request
  request.send();
};


InfiniteScroll.prototype.after = function ( fn ) {

  if ( _.isFunction(fn) ) this.callbacks.push( fn );
};


InfiniteScroll.prototype.afterCallback = function ( html ) {

  var self = this;

  if ( self.pluginHandler ) self.pluginHandler.afterInfiniteScroll( html );

  self.callbacks.forEach(function (fn) {
    fn(self);
  });
};


// Gets the elements from the specified wrapper in the response
// Appends them to the specified wrapper in the DOM
// Updates page number or something


module.exports = InfiniteScroll;