var _             = require('./../../bower_components/underscore/underscore'),
    imagesLoaded  = require('imagesloaded');


function MasonryHandler ( pluginHandler ) {

  var self = this;

  self.pluginHandler = pluginHandler;
  self.msnry;

  self._imagesLoaded = function () {

    // console.log('> MasonryHandler: _imagesLoaded');
  }

  self._onLayout = function () {

    // console.log('> MasonryHandler: _onLayout');

    var isSingleCol = ( self.msnry.cols === 1 );
    var items = self.masonryEl.children;

    for ( var i = 0, l = items.length; i < l; i += 1 ) {
      var item = items[ i ];

      if( isSingleCol ){
        // when single column..

        // update
        item.style.setProperty( 'position', 'relative' );

        // remove
        item.style.removeProperty( 'left' );
        item.style.removeProperty( 'top' );
        item.setTransform( null );
      }else{
        // when multiple columns..

        // update
        item.style.setProperty( 'position', 'absolute' );

        // if( Modernizr.csstransforms3d ){
        //   // get position
        //   var itemX = parseInt( item.style.getPropertyValue( 'left' ).replace( 'px', '' ) );
        //   var itemY = parseInt( item.style.getPropertyValue( 'top' ).replace( 'px', '' ) );

        //   // remove
        //   item.style.removeProperty( 'left' );
        //   item.style.removeProperty( 'top' );

        //   // add
        //   item.setTransform( 'translate3d('+itemX+'px, '+itemY+'px, 0px) scale3d(1, 1, 1)' );
        // }
      }
    }

    self.pluginHandler.thumbHandler.onGridUpdated();

  }

}


MasonryHandler.prototype.init = function ( selector, containerEl ) {
  
  var self = this,
      selector = selector || '.ThumbCollection',
      containerEl = containerEl && containerEl instanceof Element ? containerEl : document;

  console.log('> MasonryHandler: init');

  self._tearDown();
  self.active = false;

  self.masonryEl = containerEl.querySelector( selector );

  if ( !Masonry || !self.masonryEl ) return;
  // ---------------------------------------

  // Don't want this on modal windows (fixed height elements)
  if ( self.masonryEl.hasClass('ThumbCollection--fixed') ) return;
  // -------------------------------------------------------------

  imagesLoaded( self.masonryEl, function () {

    self._imagesLoaded();

    self.active = true;

    self.msnry = new Masonry( self.masonryEl, {
      "gutter": 8,
      "itemSelector": ".ThumbCollection-item",
      "transitionDuration": 0
    });

    self._bindEvents( true );

    self._onLayout();
  });
};


MasonryHandler.prototype._tearDown = function () {

  var self = this;

  self._bindEvents( false );

  if ( self.msnry && self.msnry.destory ) self.msnry.destory();
};



MasonryHandler.prototype._bindEvents = function ( bind ) {
  
  var self = this;

  if ( !self.msnry ) return;
  // -----------------------

  if ( bind ) {

    self.msnry.on( 'layoutComplete', self._onLayout );

  } else {

    self.msnry.off( 'layoutComplete', self._onLayout );
  }
}



MasonryHandler.prototype.addMore = function ( html, cb ) {
  
  var self = this,
      tempContainer,
      fragment,
      items;

  // console.log('> MasonryHandler: addMore', self);

  if ( !self.msnry || !self.masonryEl ) return;
  // ------------------------------------------

  // Get elements from HTML string
  tempContainer = document.createElement('tempEl');
  fragment = document.createDocumentFragment();

  tempContainer.innerHTML = html;
  items = Array.prototype.slice.call( tempContainer.children );

  for ( var i = 0, l = items.length; i < l; i += 1 ) {
    fragment.appendChild( items[i] );
  }

  self.masonryEl.appendChild( fragment );
  self.msnry.addItems( items );

  imagesLoaded( self.masonryEl, function () {

    self._imagesLoaded();
    self.msnry.layout();

    if ( _.isFunction(cb) ) cb( items );
  });
}


module.exports = MasonryHandler;