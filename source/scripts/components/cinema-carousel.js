var _             = require('./../../bower_components/underscore/underscore'),
    utils         = require('./utils'),
    APIHandler    = require('./api-handler'),
    transitionend = utils.getTransitionEnd();


/**
 *  Defines a single item within a carousel
 *
 *  @private
 *  @class _CarouselItem
 *  @param {DOMElement} el The DOM element
 *  @param {Carousel} carousel The parent carousel
 */
function _CarouselItem ( el, carousel ) {

  var self = this;

  self.el = el;
  self.carousel = carousel;
  self.apiHandler = APIHandler.getInstance();

  self._handleCtaClick = function ( ev ) {

    utils.preventDefault(ev);

    self._requestPost( self.ctaEl.getAttribute('data-post-id'), function ( post ) {

      if ( !post ) return;
      // -----------------

      self._renderVideoOverlay( post );
    });
  };

  self._handleOverlayCloseClick = function ( ev ) {

    utils.preventDefault(ev);

    self._stopEmbedVideo();
  };

  self._handleVideoClick = function ( ev ) {

    if ( ev ) ev.stopPropagation();
  };
}


_CarouselItem.prototype.init = function () {
  
  var self = this;

  self.videoEl = self.el.querySelector('.CarouselItem-video');
  
  if ( !window.isIE &&
      window.isDesktop && 
      Modernizr && 
      Modernizr['video'] && 
      Modernizr['video']['h264'] ) {
    
    
    self._startBgVideo();
  
  } else {
    
    self._swapVideo();
  }

  self._bindCta( true );
};

_CarouselItem.prototype._setWidth = function ( width ) {
  
  var self = this;

  self.el.style.width = width + '%';
};

_CarouselItem.prototype._renderVideoOverlay = function ( post ) {

  var self = this;

  self.videoOverlayEl = self.el.querySelector('.VideoOverlay');

  if ( !self.videoOverlayEl || !post ) return;
  // -----------------------------------------

  self.videoOverlayVideoEl = self.videoOverlayEl.querySelector('.VideoOverlay-video');
  self.videoCloseEl = self.videoOverlayEl.querySelector('.VideoOverlay-close');

  if ( !self.videoOverlayVideoEl ) return;
  // -------------------------------------

  self.videoOverlayVideoEl.innerHTML = post.player[0].embed_code;
  self.el.addClass('overlay-active');
  document.body.parentNode.addClass('videoOverlay-active');

  self.videoCloseEl.addEventListener( 'click', self._handleOverlayCloseClick );
  self.videoOverlayEl.addEventListener( 'click', self._handleOverlayCloseClick );
  self.videoOverlayVideoEl.addEventListener( 'click', self._handleVideoClick );
};


_CarouselItem.prototype._bindCta = function ( bind ) {

  var self = this;

  self.ctaEl = self.el.querySelector('.CarouselItem-cta');

  if ( !self.ctaEl ) return;
  // -----------------------

  if ( !self.ctaEl.getAttribute('data-post-id') ) return;
  // --------------------------------------

  if ( bind ) {

    self.ctaEl.addEventListener( 'click', self._handleCtaClick );
    self.ctaEl.addEventListener( 'touchstart', self._handleCtaClick );
  
  } else {

    self.ctaEl.removeEventListener( 'touchstart', self._handleCtaClick );
  }
};


_CarouselItem.prototype._requestPost = function ( postId, cb ) {

  var self = this;

  self.apiHandler.getPost( postId, function (resp) {

    if ( _.isFunction(cb) ) cb( resp );
  });

  
};


// Replace video with photo fallback
_CarouselItem.prototype._swapVideo = function () {

  var self = this,
      imgEl,
      containerEl;

  imgEl = self.el.querySelector('.CarouselItem-photo');

  if ( !self.videoEl ) return;
  // --------------------

  containerEl = self.videoEl.parentNode;

  if ( !containerEl || !containerEl.parentNode ) return;
  // ---------------------------------------------------

  containerEl.removeChild(self.videoEl);
  containerEl.appendChild(imgEl);
};


_CarouselItem.prototype.stopVideos = function () {

  var self = this;

  self._stopBgVideo();
  self._stopEmbedVideo();
};


_CarouselItem.prototype._startBgVideo = function () {

  var self = this;

  if ( !self.videoEl || !self.videoEl.play ) return;
  // -----------------------------------------------

  self.videoEl.play();
};


_CarouselItem.prototype._stopBgVideo = function () {

  var self = this;

  if ( !self.videoEl || !self.videoEl.pause ) return;
  // -----------------------------------------------

  self.videoEl.pause();
};

_CarouselItem.prototype._stopEmbedVideo = function () {

  var self = this;

  self.el.removeClass('overlay-active');
  document.body.parentNode.removeClass('videoOverlay-active');
  if ( self.videoOverlayVideoEl ) self.videoOverlayVideoEl.innerHTML = '';
};






/**
 *  Defines a carousel
 *
 *  @class CinemaCarousel
 */
function CinemaCarousel ( pluginHandler ) {

  var self = this;

  self.el;
  self.sliderEl;
  self.nextEl;
  self.prevEl;
  self.items = [];
  self.lock = false;
  self.pluginHandler = pluginHandler;

  self._handleClickNext = function ( ev ) {

    self.goLeft(ev);
  };

  self._handleClickPrev = function ( ev ) {

    self.goRight(ev);
  };

  self._handleMouseenterNext = function ( ev ) {

    self.peekLeft(ev);
  };

  self._handleMouseenterPrev = function ( ev ) {

    self.peekRight(ev);
  };

  self._handleMouseleaveNext = function ( ev ) {

    self.unPeek(ev);
  };

  self._handleMouseleavePrev = function ( ev ) {

    self.unPeek(ev);
  };
}


/**
 *  Kicks off the cinema carousel element
 * 
 *  @method init
 *  @param {String} [selector] DOM Element selector
 *  @return {Void}
 */
CinemaCarousel.prototype.init = function ( selector, containerEl ) {

  var self = this,
      selector = selector || '.Carousel',
      containerEl = containerEl && containerEl instanceof Element ? containerEl : document;

  console.log('> CinemaCarousel: init');

  self._tearDown();

  self.el = containerEl.querySelector( selector );

  if (!self.el) return;
  // ------------------

  self.sliderEl = self.el.querySelector('.Carousel-slider');

  if ( !self.sliderEl ) return;
  // --------------------------

  self.nextEl     = self.el.querySelector('.Carousel-nextLink');
  self.prevEl     = self.el.querySelector('.Carousel-prevLink');
  self._bindNext( true );
  self._bindPrev( true );

  self._bindItems();

  self._manageLength();

  if (!self.items.length || !self.sliderEl) return;

  self._setWidths();
};


CinemaCarousel.prototype._tearDown = function () {

  var self = this;

  self.items = [];

  self._bindNext( false );
  self._bindPrev( false );
};


CinemaCarousel.prototype._bindNext = function ( bind ) {

  var self = this,
      eventFn = bind ? 'addEventListener' : 'removeEventListener',
      classFn = bind ? 'addClass' : 'removeClass';

  if ( !self.nextEl ) return;
  // ------------------------

  self.nextEl[classFn]('is-active');

  self.nextEl[eventFn]('click',       self._handleClickNext );
  self.nextEl[eventFn]('touchstart',  self._handleClickNext );
  self.nextEl[eventFn]('mouseenter',  self._handleMouseenterNext );
  self.nextEl[eventFn]('mouseleave',  self._handleMouseleaveNext );
};

CinemaCarousel.prototype._bindPrev = function ( bind ) {

  var self = this,
      eventFn = bind ? 'addEventListener' : 'removeEventListener',
      classFn = bind ? 'addClass' : 'removeClass';

  if ( !self.prevEl ) return;
  // ------------------------

  self.prevEl[classFn]('is-active');

  self.prevEl[eventFn]('click',       self._handleClickPrev );
  self.prevEl[eventFn]('touchstart',  self._handleClickPrev );
  self.prevEl[eventFn]('mouseenter',  self._handleMouseenterPrev );
  self.prevEl[eventFn]('mouseleave',  self._handleMouseleavePrev );
};


CinemaCarousel.prototype._setWidths = function () {

  var self = this,
      count = self.items.length,
      containerWidth = self.items.length * 100,
      itemWidth = 100 / count;

  self.sliderEl.style.width = containerWidth + '%';

  while ( count-- ) {

    self.items[ count ]._setWidth( itemWidth );
  }
};


CinemaCarousel.prototype._manageLength = function () {

  var self = this,
      count = self.items.length,
      itemEls;

  if ( count === 1 ) {

    self._bindPrev(false);
    self._bindNext(false);

    self.nextEl.parentNode.removeChild( self.nextEl );
    self.prevEl.parentNode.removeChild( self.prevEl );

    self.sliderEl.addClass('is-single');
  
  } else if ( count === 2 ) {

    itemEls = self.sliderEl.children;

    self.sliderEl.appendChild( itemEls[0].cloneNode(true) );
    self.sliderEl.appendChild( itemEls[1].cloneNode(true) );

    self._bindItems();
  
  }
};

/**
 *  Populates the carousel items based on a selector query
 *
 *  @private
 *  @method _bindItems
 *  @param {String} [selector] DOM element selector for items
 *  @return {Void}
 */
CinemaCarousel.prototype._bindItems = function ( selector, bind ) {

  var self = this,
      els = self.sliderEl.querySelectorAll( selector || '.CarouselItem' ),
      count = els.length,
      tempItem;

  self.items = [];

  while ( count-- ) {

    tempItem = new _CarouselItem( els[count], self );
    self.items.push( tempItem );
    tempItem.init();
  }

  self._swapItems( true );
};



CinemaCarousel.prototype._swapItems = function ( offEnd ) {

  var self = this,
      oldItem,
      videoEl;

  if ( offEnd ) {

    // Grab last element and move it to the start
    oldItem = self.sliderEl.removeChild( self.sliderEl.children[ self.items.length - 1 ] );
    self.sliderEl.insertBefore( oldItem, self.sliderEl.firstChild );

  } else {

    // Grab the first element and move it to the end
    oldItem = self.sliderEl.removeChild( self.sliderEl.children[ 0 ] );
    self.sliderEl.appendChild( oldItem );
  }

  videoEl = oldItem.querySelector('.CarouselItem-video');
  if ( videoEl && videoEl.play ) videoEl.play();
};


/**
 *  Locks the controls while transitions are active to avoid
 *  unexpected behaviour
 *
 *  @private
 *  @method _lockControls
 *  @param {Boolean} lock Flag as whether to lock or unlock controls
 *  @return {Void}
 */
CinemaCarousel.prototype._lockControls = function ( lock ) {

  if ( lock ) {

    this.lock = true;
    this.nextEl.removeClass('is-active');
    this.prevEl.removeClass('is-active');

  } else {

    this.lock = false;
    this.nextEl.addClass('is-active');
    this.prevEl.addClass('is-active');
  }
}


/**
 *  Returns the carousel back from a left or right
 *  peek state
 *
 *  @method unPeek
 *  @param {Event} [ev] A hover event
 *  @return {Void}
 */
CinemaCarousel.prototype.unPeek = function ( ev ) {

  this._peek( ev, null );
};


/**
 *  Peeks the carousel to the left
 *
 *  @method peekLeft
 *  @param {Event} [ev] A hover event
 *  @return {Void}
 */
CinemaCarousel.prototype.peekLeft = function ( ev ) {

  this._peek( ev, 'left' );
};


/**
 *  Peeks the carousel to the right
 *
 *  @method peekRight
 *  @param {Event} [ev] A hover event
 *  @return {Void}
 */
CinemaCarousel.prototype.peekRight = function ( ev ) {

  this._peek( ev, 'right' );
};


/**
 *  Moves the carousel a small amount (based on css)
 *  in either direction, or closes it if no direction
 *  is provided
 *
 *  @private
 *  @method _peek
 *  @param {Event} [ev] A hover event
 *  @param {String} [direction] Direction to peek (or null to revert)
 *  @return {Void}
 */
CinemaCarousel.prototype._peek = function ( ev, direction ) {

  var self = this;

  utils.preventDefault(ev);

  function _handleTransition () {

    self.sliderEl.removeEventListener( transitionend, _handleTransition );
    self.sliderEl.removeClass('is-animating');
  }

  if ( ['left', 'right'].indexOf(direction) >= 0 ) {

    if ( !self.lock ) {

      self.sliderEl.addClass('is-animating peek-' + direction);
    }

  } else {

    self.sliderEl.addClass('is-animating');
    self.sliderEl.removeClass('peek-left peek-right');
  }

  self.sliderEl.addEventListener( transitionend, _handleTransition );
};


/**
 *  Moves the carousel to the left
 *
 *  @method goLeft
 *  @param {Event} [ev] The event from the triggering action
 *  @return {Void}
 */
CinemaCarousel.prototype.goLeft = function ( ev ) {

  this._go( ev, 'left' );
};


/**
 *  Moves the carousel to the right
 *
 *  @method goRight
 *  @param {Event} [ev] The event from the triggering action
 *  @return {Void}
 */
CinemaCarousel.prototype.goRight = function ( ev ) {

  this._go( ev, 'right' );
};


/**
 *  Handles the movement from one item to the next in either
 *  direction. The transition handler function is also contained.
 *
 *  @private
 *  @method _go
 *  @param {Event} ev An event triggering this action3
 *  @param {String} direction The carousel direction (left/right)
 *  @return {Void}
 */
CinemaCarousel.prototype._go = function ( ev, direction ) {

  var self = this,
      distance;

  utils.preventDefault(ev);

  if ( self.lock ) return;
  // ---------------------

  if ( ['left', 'right'].indexOf(direction) < 0 ) return;
  // ----------------------------------------------------

  self._lockControls(true);
  self.unPeek();
  distance = self.sliderEl.offsetWidth / self.items.length * (direction === 'left' ? -1 : 1);
  
  function _handleTransition ( ev ) {

    var oldItem,
        videoEl;

    // Remove event binding
    self.sliderEl.removeEventListener(transitionend, _handleTransition);

    // Adjust style properties
    self.sliderEl.removeClass('is-animating');
    self.sliderEl.setTransform();

    self._swapItems( direction !== 'left' );

    // Re-enable controls
    self._lockControls(false);
  }

  if ( Modernizr && Modernizr.csstransitions && Modernizr.csstransforms3d ) {

    self.sliderEl.addClass('is-animating');
    self.sliderEl.setTransform("translate3d(" + distance + "px, 0, 0)");
    self.sliderEl.addEventListener(transitionend, _handleTransition);
  
  } else {

    _handleTransition();
  }
  
};


CinemaCarousel.prototype.stopVideos = function () {

  var self = this,
      count = self.items.length;

  while ( count-- ) {

    self.items[count].stopVideos();
  }
};


CinemaCarousel.prototype.startVideos = function () {

  var self = this,
      count = self.items.length;

  while ( count-- ) {

    self.items[count]._startBgVideo();
  }
};


module.exports = CinemaCarousel;