var _               = require('./../../bower_components/underscore/underscore'),
    utils           = require('./utils');


/**
 *
 *
 *  @class page
 */
function Page ( el, URL ) {

  var self = this;

  self.el   = el;
  self.URL  = URL;
  self.prevURL;
}


Page.prototype.scrollY = function () {

  return window.pageYOffset;
}



Page.prototype.enter = function ( options, cb ) {

  var self = this,
      windowWidth = undefined,
      windowHeight = undefined,
      scale,
      transX = {},
      transY = {};

  _.extend( self, options );

  if ( !self.directionClass ) self.directionClass = 'off-right';

  function _handleTransitionEnd ( ev ) {

    if ( ev && ev.target !== self.el ) return;
    // ---------------------------------------

    self.el.removeEventListener( utils.getTransitionEnd(), _handleTransitionEnd );
    self.el.removeClass('is-animating is-fixed is-entering');

    self.el.setTransform('');

    self.el.addClass('is-entered');

    if ( self.directionClass ) self.el.removeClass( self.directionClass );
    self._enterCallback(cb);
  }

  if ( self.noTransition ) {

    self.el.addClass('is-active');
    _handleTransitionEnd();

  } else {

    if ( self.directionClass === 'off-back' ) {

      scale = '0.8';
      
      transX.distance = 0;
      transY.distance = 0;
      transX.multiplier = 1;
      transY.multiplier = 1;

    } else {

      scale = '1';

      windowWidth = utils.getWindowWidth();
      windowHeight = utils.getWindowHeight();

      transX.distance = ['off-right', 'off-left'].indexOf( self.directionClass ) >= 0 ? windowWidth : 0;
      transY.distance = ['off-top', 'off-bottom'].indexOf( self.directionClass ) >= 0 ? windowHeight : 0;

      transX.multiplier = self.directionClass === 'off-right' ? 1 : -1;
      transY.multiplier = self.directionClass === 'off-bottom' ? 1 : -1;
    }

    if ( self.directionClass ) {

      self.el.addClass( self.directionClass );
    }

    self.el.setTransform('translate3d( ' + transX.distance * transX.multiplier + 'px, ' + transY.distance * transY.multiplier + 'px, 0px ) scale('+scale+')');
    self.el.addClass('is-entering is-fixed');
    self.el.addEventListener( utils.getTransitionEnd(), _handleTransitionEnd );

    setTimeout(function () {
      self.el.addClass('is-animating is-active');
      self.el.setTransform('translate3d(0, 0, 0) scale(1)');
      
    }, 20);
  }  
};


/**
 *
 *
 *  @method leave
 */
Page.prototype.leave = function ( options, cb ) {

  var self = this,
      windowWidth = undefined,
      windowHeight = undefined,
      scale,
      transX = {},
      transY = {},
      scrollVal = self.scrollY();

  _.extend( self, options );

  if ( !self.directionClass ) self.directionClass = 'off-left';

  function _handleTransitionEnd ( ev ) {

    if ( ev && ev.target !== self.el ) return;
    // ---------------------------------------

    self.el.removeEventListener( utils.getTransitionEnd(), _handleTransitionEnd );
    self.el.removeClass('is-animating is-fixed is-leaving');

    self.el.setTransform('');
    
    if ( self.directionClass ) self.el.removeClass( self.directionClass );
    self._leaveCallback(cb);
  }

  if ( self.noTransition ) {

    self.el.removeClass('is-active');
    _handleTransitionEnd();

  } else {

    if ( self.directionClass === 'off-back' ) {

      scale = '0.8';
      
      transX.distance = 0;
      transY.distance = 0;
      transX.multiplier = 1;
      transY.multiplier = 1;

    } else {

      scale = '1';

      windowWidth = utils.getWindowWidth();
      windowHeight = utils.getWindowHeight();

      transX.distance = ['off-right', 'off-left'].indexOf( self.directionClass ) >= 0 ? windowWidth : 0;
      transY.distance = ['off-top', 'off-bottom'].indexOf( self.directionClass ) >= 0 ? windowHeight : 0;

      transX.multiplier = self.directionClass === 'off-right' ? 1 : -1;
      transY.multiplier = self.directionClass === 'off-bottom' ? 1 : -1;
    }

    if ( scrollVal > 0 ) {

      if ( self.el.querySelector('.Page-inner') ) {
        self.el.querySelector('.Page-inner').style.top = (scrollVal * -1) + 'px';
      }
    }

    if ( self.directionClass ) {
      self.el.addClass( self.directionClass );
    }

    self.el.addClass('is-animating is-leaving is-fixed');
    self.el.addEventListener( utils.getTransitionEnd(), _handleTransitionEnd );

    setTimeout(function () {
      self.el.removeClass('is-active');
      self.el.setTransform('translate3d( ' + transX.distance * transX.multiplier + 'px, ' + transY.distance * transY.multiplier + 'px, 0px ) scale('+scale+')');
    }, 20);
  }  
};



/**
 *
 *
 *  @method _enterCallback
 */
Page.prototype._enterCallback = function ( cb ) {

  var self = this;

  if ( _.isFunction(cb) ) cb();
};



/**
 *
 *
 *  @method _leaveCallback
 */
Page.prototype._leaveCallback = function ( cb ) {

  var self = this;

  self._destroy();

  if ( _.isFunction(cb) ) cb();
};



/**
 *
 *
 *  @method name
 */
Page.prototype._destroy = function () {

  var self = this;

  if ( self.el && self.el.parentNode ) {

    self.el.parentNode.removeChild( self.el );
  }
};


module.exports = Page;
