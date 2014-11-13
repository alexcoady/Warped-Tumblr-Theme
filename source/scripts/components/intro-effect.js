var _                       = require('./../../bower_components/underscore/underscore'), 
    utils                   = require('./utils'),
    transitionend           = utils.getTransitionEnd();






/**
 *
 *  @class IntroEffect
 */
function IntroEffect ( pluginHandler ) {

  var self = this;

  self.headerElheight = 117;
  self.pluginHandler = pluginHandler;

  self._handleHideClick = function ( ev ) {

    self.hide();
  }

  self._handleShowClick = function ( ev ) {

    self.show();
  } 

  self._handleScroll = function ( ev ) {

    self._scrollPage( ev );
  };
}




/**
 *
 *  @class IntroEffect
 */
IntroEffect.prototype.init = function ( selector, containerEl, show ) {

  var self = this,
      selector = selector || '.Header',
      containerEl = containerEl && containerEl instanceof Element ? containerEl : document;

  console.log('> IntroEffect: init - show: ', show);

  self._tearDown();

  self.headerEl   = containerEl.querySelector( selector );
  self.pageEl     = containerEl.querySelector( '.Page-inner' );
  self.docEl      = window.document.documentElement;

  if ( !self.headerEl ) return;
  // --------------------------

  self.keycodes = [32, 37, 38, 39, 40];
  self.noScroll = self.scrollY() === 0;
  self.isHidden = true;

  self._bindScroll( true );
  self._bindShowTrigger( null, true );
  self._bindHideTrigger( null, true );

  
  if ( show ) {

    // Show by default
    self.show( true );

  } else {

    // Be hidden by default
    self.hide( true );
  }

  if ( self.scrollY() ) {
    self.isHidden = true;
    self.headerEl.addClass('no-trans is-hidden');
  }
};


IntroEffect.prototype._tearDown = function () {

  var self = this;

  self._bindScroll( false );
  self._bindShowTrigger( false );
  self._bindHideTrigger( false );

  self._enableInteraction();
};


IntroEffect.prototype.scrollY = function () {

  return window.pageYOffset || this.docEl.scrollTop;
}


IntroEffect.prototype._bindScroll = function ( bind ) {

  var self = this;

  if ( bind ) {

    window.addEventListener( 'scroll', self._handleScroll );

  } else {

    window.removeEventListener( 'scroll', self._handleScroll );
  }
};


/**
 *  Handles the scrolling of the page
 *
 *  @private
 *  @method _scrollPage
 *  @param {Event} ev The window.scroll event
 *  @return {Void}
 */
IntroEffect.prototype._scrollPage = function ( ev ) {

  var self = this,
      scrollVal = self.scrollY();

  // console.log('scrolling (noscroll: %s) (scrollVal: %s)', self.noScroll, scrollVal);

  if ( self.noScroll ) {
    
    if ( scrollVal < 0 ) return false;
    // -------------------------------
    
    // window.scrollTo( 0, self.headerElheight);
    window.scrollTo( 0, self.headerElheight);
  }

  // Remove no-transform setting if present
  self.headerEl.removeClass('no-trans');
    
  if ( self.isAnimating ) return false;
  // ----------------------------------
    
  if ( scrollVal <= 0 && self.isHidden ) {
    
    self.show();
  
  } else if ( scrollVal > 0 && !self.isHidden ) {
    
    self.hide();
  }
};


/**
 *  Binds a single button to close the header
 *
 *  @private
 *  @method _bindHideTrigger
 *  @param {String} [selector] DOM selector
 *  @param {Boolean} bind To bind or unbind this event
 *  @return {Void}
 */
IntroEffect.prototype._bindHideTrigger = function ( selector, bind) {

  var self = this,
      selector = selector || '.Header-close';

  self.closeTriggerEl = document.querySelector( selector );

  if ( !self.closeTriggerEl ) return self;
  // -------------------------------------

  if ( bind ) {

    self.closeTriggerEl.addEventListener( 'click', self._handleHideClick );

  } else {

    self.closeTriggerEl.removeEventListener( 'click', self._handleHideClick );
  } 

  return self;
};


/**
 *  Bind a single button to open the header
 *
 *  @private
 *  @method _bindShowTrigger
 *  @param {String} [selector] DOM selector
 *  @param {Boolean} bind To bind or unbind this event
 *  @return {Void}
 */
IntroEffect.prototype._bindShowTrigger = function ( selector, bind ) {

  var self = this,
      selector = selector || '.HeaderOpen';

  self.openTriggerEl = document.querySelector( selector );

  if ( !self.openTriggerEl ) return self;
  // ------------------------------------

  if ( bind ) {

    self.openTriggerEl.addEventListener( 'click', self._handleShowClick );
    self.openTriggerEl.addEventListener( 'touchstart', self._handleShowClick );

  } else {

    self.openTriggerEl.removeEventListener( 'click', self._handleShowClick );
    self.openTriggerEl.removeEventListener( 'touchstart', self._handleShowClick );
  } 

  return self;
};


/**
 *  Shows the header
 *
 *  @method show
 *  @return {Void}
 */
IntroEffect.prototype.show = function ( noTrans ) {
  
  this.pluginHandler.cinemaCarousel.startVideos();
  return this._hide( false, noTrans );
};


/**
 *  Hides the header
 *
 *  @method hide
 *  @return {Void}
 */
IntroEffect.prototype.hide = function ( noTrans ) {

  this.pluginHandler.cinemaCarousel.stopVideos();
  return  this._hide( true, noTrans );
};



/**
 *  Shows or hides the header
 *
 *  @private
 *  @method _hide
 *  @param {Boolean} hide Flag to hide or not
 *  @return {Void}
 */
IntroEffect.prototype._hide = function ( hide, noTrans ) {

  var self = this,
      timer = 1200,
      y = hide ? self.headerElheight : 0;

  self.isAnimating = true;

  if ( noTrans ) {
    self.headerEl.addClass('no-trans');
    timer = 0;
  }

  if( !Modernizr.csstransitions ){
    timer = 0;
  }

  if ( hide ) {

    // Close
    self.headerEl.addClass( 'is-hidden' );
    if ( self.pageEl ) self.pageEl.removeClass( 'is-pushed' );
    
  
  } else {
    
    // Open
    self.headerEl.removeClass( 'is-hidden' );
    if ( self.pageEl ) self.pageEl.addClass( 'is-pushed' );
    self._bindScroll( true );
    self.noScroll = true;
    self._disableInteraction();
  }

  setTimeout( function() {
    
    if ( self.headerEl ) self.headerEl.removeClass('no-trans');
    
    self.isAnimating = false;
    
    if ( hide ) {

      self.noScroll = false;
      self._enableInteraction();
      self._bindScroll( false );
      self.isHidden = true;

    } 
    else {
      self.isHidden = false;
      self.openTriggerEl.removeClass('is-active');
    }

  }, timer );


  if ( hide ) {

    window.scrollTo( 0, y);
    self.openTriggerEl.addClass('is-active');
  }

  return self;
};


/**
 *  Disables keyboard/touch scroll navigation
 *
 *  @private
 *  @method _disableInteraction
 *  @return {Void}
 */
IntroEffect.prototype._disableInteraction = function () {

  var self = this;

  document.onkeydown = function ( ev ) { self._disableKeydown(ev) };
  document.body.ontouchmove = function ( ev ) { self._disableTouchmove(ev) };
};


/**
 *  Enables keyboard/touch scroll navigation
 *
 *  @private
 *  @method _disableInteraction
 *  @return {Void}
 */
IntroEffect.prototype._enableInteraction = function () {

  // console.log('> IntroEffect: _enableInteraction (Can scroll)');

  document.onkeydown = null;
  document.body.ontouchmove = null;
};


/**
 *  Disables keydown event for specified key codes
 *
 *  @private
 *  @method _disableKeydown
 *  @param {Event} ev The keydown event
 *  @return {Void}
 */
IntroEffect.prototype._disableKeydown = function ( ev ) {

  var self = this;

  if ( ev.keyCode && self.keycodes.indexOf( ev.keyCode ) !== -1 ) {

    utils.preventDefault( ev );
  }
};


/**
 *  Disables touchmove event
 *
 *  @private
 *  @method _disableTouchmove
 *  @param {Event} ev The touchmove event
 *  @return {Void}
 */
IntroEffect.prototype._disableTouchmove = function ( ev ) {

  utils.preventDefault( ev );
};


IntroEffect.prototype.destroy = function ( ev ) {

  var self = this;

  if ( self.headerEl ) {

    self.headerEl.parentNode.removeChild( self.headerEl );
  }
};


module.exports = IntroEffect;