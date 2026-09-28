// Stub for any old cached importScripts
if (typeof self !== 'undefined') {
  self.define = function(deps, factory) {
    if (typeof factory === 'function') {
      try {
        factory({
          precacheAndRoute: function() {},
          cleanupOutdatedCaches: function() {},
          registerRoute: function() {},
          NavigationRoute: function() {},
          createHandlerBoundToURL: function() {},
          clientsClaim: function() {},
        });
      } catch (e) {}
    }
  };
}
