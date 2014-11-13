var utils       = require('./utils'),
    APIHandler  = require('./api-handler');


function PostHandler ( pluginHandler ) {

  var self = this;

  self.pluginHandler = pluginHandler;
  self.apiHandler = APIHandler.getInstance();
}


PostHandler.prototype.init = function ( selector, containerEl ) {
  
  var self = this,
      selector = selector || '.Post',
      containerEl = containerEl && containerEl instanceof Element ? containerEl : document;

  if ( self.el ) self._tearDown();

  self.el = containerEl.querySelector( selector );

  if ( !self.el ) return;
  // --------------------

  self._parseSummary();
  self._getNextPost();
};



PostHandler.prototype._parseSummary = function () {

  var self = this,
      titleEl;

  titleEl = self.el.querySelector('.Post-summary');

  if ( !titleEl ) return;
  // --------------------

  titleEl.innerHTML = utils.getFirstLine( titleEl );
};



PostHandler.prototype._getNextPost = function () {

  var self = this,
      postLinkEl,
      postId;

  postLinkEl = self.el.querySelector('.PostPagination--prev');

  if ( !postLinkEl ) return;
  // -----------------------

  postLinkTextEl = postLinkEl.querySelector('.PostPagination-postTitle');

  if ( !postLinkEl || !postLinkTextEl || !postLinkEl.href ) return;
  // --------------------------------------------------------------

  postId = utils.getPostId( postLinkEl.href );

  if ( !postId ) return;
  // -------------------

  function _handlePost ( post ) {

    var newLineIndex,
        tempTitle;

    if ( post ) {

      tempTitle = post.caption;
      newLineIndex = tempTitle.indexOf('\n');

      if ( newLineIndex > -1 ) {

        postLinkTextEl.innerHTML = tempTitle.substring(0, newLineIndex);
      
      } else {

        postLinkTextEl.innerHTML = tempTitle;
      }
    } else {

      postLinkTextEl.innerHTML = 'Next post';
    }
  }

  self.apiHandler.getPost( postId, _handlePost );
};



PostHandler.prototype._tearDown = function () {

};


module.exports = PostHandler;
