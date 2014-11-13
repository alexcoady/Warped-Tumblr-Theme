var utils = require('./utils');

function ColorFun ( pluginHandler ) {

  var self = this;

  self.pluginHandler = pluginHandler;
  self.ongoingTouches = [];

  self._handleMouseover = function ( ev ) {

    self.updateColor( ev.x, ev.y );
  };

  self._handleTouchMove = function ( ev ) {

    // ev.preventDefault();

    var touches = ev.changedTouches,
        touchCount = touches.length,
        i = 0;

    for ( i; i < touchCount; i += 1 ) {

      self.ongoingTouches.push( touches[i] );
      
      self.updateColor( touches[i].pageX, touches[i].pageY );
    }
  };

  self._handleTouchStart = function (ev) {

    var regionWidth;

    // ev.preventDefault();

    regionWidth = window.innerWidth / brandsEl.length;

    var touches = ev.changedTouches,
        touchCount = touches.length,
        i = 0;

    for ( i; i < touchCount; i += 1 ) {

      self.ongoingTouches.push( touches[i] );

      self.updateColor( touches[i].pageX, touches[i].pageY );
    }
  };
}

ColorFun.prototype.init = function ( selector, container ) {

  var self        = this,
      container   = container && container instanceof Element ? container : document.body,
      selector    = selector || '.ColorFun',
      bgSelector  = '.ColorFun-background',
      width, height;

  console.log('> ColorFun: init');

  self.el   = container.querySelector( selector );
  self.bgEl = container.querySelector( bgSelector );

  if ( !self.el || !self.bgEl ) return;
  // ----------------------------------

  self._bindMouseover( true );

  width = self.el.offsetWidth;
  height = self.el.offsetHeight;

  self.rangeR = utils.rangeFunc( 0, width, 0, 230 );
  self.rangeG = utils.rangeFunc( 0, width, 100, 0 );
  self.rangeB = utils.rangeFunc( 0, height, 0, 230 );
};

ColorFun.prototype._bindMouseover = function ( bind ) {

  var self = this;

  if ( bind ) {
    
    self.el.addEventListener( 'mousemove', self._handleMouseover );
    self.el.addEventListener( 'touchmove', self._handleTouchMove, false );
    self.el.addEventListener( 'touchstart', self._handleTouchStart, false );
  
  } else {

    self.el.removeEventListener( 'mousemove', self._handleMouseover );
    self.el.removeEventListener( 'touchmove', self._handleTouchMove, false );
    self.el.removeEventListener( 'touchstart', self._handleTouchStart, false );
  }
}

ColorFun.prototype.updateColor = function ( x, y ) {

  var self = this,
      r,g,b,offset;

  offset = utils.getOffset( self.el );

  r = self.rangeR( x - offset.left ).toFixed(0);
  g = self.rangeG( x - offset.left ).toFixed(0);
  b = self.rangeB( y - offset.top ).toFixed(0);

  self.bgEl.style.backgroundColor = 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
}


module.exports = ColorFun;
