var _     = require('./../../bower_components/underscore/underscore');

function APIHandler ( consumerKey ) {

  var self = this;

  self.consumerKey = consumerKey;
}


APIHandler.prototype.getPost = function ( id, cb ) {

  var self = this,
      options = [];

  if ( !_.isFunction(cb) || id === undefined ) return;
  // -------------------------------------------------

  options.push( 'id='+id );
  options.push( 'filter=text' );

  self._sendRequest( options, function (resp) {

    if ( resp && resp.response && resp.response.posts && resp.response.posts.length === 1 ) {

      cb(resp.response.posts[0]);
    
    } else {
      
      cb(null);
    }
  });
};


APIHandler.prototype._sendRequest = function ( options, cb ) {

  var self = this,
      requestURL,
      tempScript;

  var tumblrId = document.location.href.substring( document.location.href.indexOf( '//' ) + 2 ).split( '.' )[ 0 ];
  requestURL = "http://api.tumblr.com/v2/blog/" + tumblrId + ".tumblr.com/posts/?api_key=" + self.consumerKey + "&jsonp=callback&" + options.join('&');

  tempScript = document.createElement('script');
  tempScript.src = requestURL;

  document.head.appendChild(tempScript);

  window.callback = function (data) {
  
    if ( _.isFunction(cb) ) cb( data );
  }
};




APIHandler._instance = undefined;

APIHandler.getInstance = function () {

  if ( !APIHandler._instance ) APIHandler._instance = new APIHandler('PHXRte2GRhTEQbk4UEaPUtnEQE0bYUUwFZu1Xre6mMxL0gsMKw');

  return APIHandler._instance;
};


module.exports = APIHandler;
