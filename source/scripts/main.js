var PageHandler       = require('./components/page-handler'),
    PluginHandler     = require('./components/plugin-handler');

require('./components/console-log');

var pluginHandler = new PluginHandler();
var pageHandler   = PageHandler.getInstance();

pluginHandler.init();

pageHandler.init( '#Chrome-page', {
  pluginHandler: pluginHandler
});
