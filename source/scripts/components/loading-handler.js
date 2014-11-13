function LoadingHandler ( pluginHandler ) {

  var self = this;

  self.pluginHandler = pluginHandler;
}

LoadingHandler.prototype.init = function () {

  var self = this;

  self._render();
};


LoadingHandler.prototype.start = function () {

  var self = this;

  self.el.addClass('is-active');
  console.log('> LoadingHandler: start');
};

LoadingHandler.prototype.finish = function () {

  var self = this;

  
  setTimeout(function () {

    self.el.removeClass('is-active');
    console.log('> LoadingHandler: finish');
  }, 2000);

};


LoadingHandler.prototype._render = function () {

  var self = this,
      innerEl;

  if ( !self.el ) {

    self.el = document.createElement('div');
    innerEl = document.createElement('div');

    self.el.addClass('Loading');
    innerEl.addClass('Loading-inner');

    self.el.appendChild( innerEl );

    document.body.appendChild( self.el );
  }
};


module.exports = LoadingHandler;