var _     = require('./../../bower_components/underscore/underscore'),
    Page  = require('./page');

/**
 *
 *
 *
 */
function PageHandler ( ) {

  var self = this;

  self.el;
  self.currentPage;
  self.lastNonModal;

  return self;
}



PageHandler.prototype.init = function ( selector, options ) {

  var self = this,
      currentEl;

  console.log('> PageHandler: init');

  if ( options ) _.extend( self, options );

  self.el = document.querySelector( selector );

  if ( !self.el ) return;
  // --------------------

  if ( self.el.firstElementChild ) {
    self.flipPages( new Page( self.el.firstElementChild, document.URL ) );
  }
  
};


PageHandler.prototype.flipPages = function ( newPage, cb ) {

  var self = this,
      enterOptions = {},
      leaveOptions = {},
      newPage = newPage || self.lastNonModal;

  enterOptions.noTransition = false;
  leaveOptions.noTransition = false;

  if ( !newPage || !newPage.el ) {

    window.location.replace('/');
  }

  if ( self.currentPage && self.currentPage.el.hasClass('Page--post') ) {

    if ( newPage.el.hasClass('Page--post') ) {

      leaveOptions.directionClass = 'off-top';
      enterOptions.directionClass = 'off-bottom';

    } else {

      leaveOptions.directionClass = 'off-right';
      enterOptions.directionClass = 'off-left';
    }
  
  } else if ( self.currentPage && newPage.el.hasClass('Page--post') ) {

    leaveOptions.directionClass = 'off-left';
    enterOptions.directionClass = 'off-right';
  
  } else if ( !self.currentPage ) {

    enterOptions.noTransition = true;
  
  } else {

    leaveOptions.directionClass = 'off-right';
    enterOptions.directionClass = 'off-left';
  }

  // Remove current page
  if ( self.currentPage ) {

    self.pluginHandler.beforePageLeave();
    self.currentPage.leave( leaveOptions );
  }

  self.lastNonModal = newPage;

  newPage.prevURL = self.lastNonModal ? self.lastNonModal.URL : '/';

  self.currentPage = newPage;

  // Enter new page
  newPage.pageHandler = self;
  
  // Add new page to DOM
  self.el.appendChild( newPage.el );
  
  self.pluginHandler.beforePageEnter( newPage );
  newPage.enter( enterOptions, function () {

    self.pluginHandler.afterPageEnter( newPage );

    if ( _.isFunction(cb) ) cb();
  });
};


PageHandler._instance = undefined;


PageHandler.getInstance = function () {

  if ( !PageHandler._instance ) PageHandler._instance = new PageHandler();

  return PageHandler._instance;
};


module.exports = PageHandler;
