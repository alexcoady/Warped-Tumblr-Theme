var utils             = require('./utils'),
    MenuToggle        = require('./menu-toggle'),
    ThumbHandler      = require('./thumb-handler'),
    PjaxHijack        = require('./pjax-hijack'),
    PageHandler       = require('./page-handler'),
    PostHandler       = require('./post-handler'),
    LoadingHandler    = require('./loading-handler'),
    ColorFun          = require('./color-fun');


function PluginHandler () {

  var self = this;

  self.isFirst = true;
}



PluginHandler.prototype.init = function () {
  
  var self = this;

  console.log( '> PluginHandler: init' );
  
  self.menuToggle     = new MenuToggle( self );
        
  self.pjaxHijack     = new PjaxHijack( self );
    
  self.postHandler    = new PostHandler( self );
  
  self.loadingHandler = new LoadingHandler( self );

  self.thumbHandler   = new ThumbHandler( self );

  self.colorFun       = new ColorFun( self );
};


PluginHandler.prototype.beforePageEnter = function ( page ) {
   
  var self = this;

  self.loadingHandler.init();
  
  self.loadingHandler.start();

  self.thumbHandler.init( null, page.el );

  // Bind a post
  self.postHandler.init( null, page.el );
}


PluginHandler.prototype.afterPageEnter = function ( page ) {
  
  var self = this;

  console.log( '> PluginHandler: afterPageEnter' );

  self.loadingHandler.finish();

  // initialise menu toggle
  self.menuToggle.init( '.Menu', '.Hamburger');

  // Intiialise pjax hijack
  self.pjaxHijack.init( null, page.el, self.isFirst );

  // Bind a post
  self.postHandler.init( null, page.el );

  // Bind colour nonsense
  self.colorFun.init( null, page.el );

  // Rebind 3rd party APIs
  self.bindAPIs();

  if ( self.isFirst ) self.isFirst = false;
};


PluginHandler.prototype.beforePageLeave = function () {
   
  var self = this;
}


PluginHandler.prototype.bindAPIs = function () {
  
  var self = this,
      postId;
  
  try {

    FB.XFBML.parse(); 
    twttr.widgets.load();

    postId = utils.getPostId( window.location.pathname );

    if ( postId ) {

      Tumblr.LikeButton.get_status_by_post_ids([postId]);
    }
  
  } catch (ex) {}
};



PluginHandler._instance = undefined;

PluginHandler.getInstance = function () {

  if ( !PluginHandler._instance ) PluginHandler._instance = new PluginHandler();

  return PluginHandler._instance;
};


module.exports = PluginHandler;
