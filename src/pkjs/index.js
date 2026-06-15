const moddableProxy = require("@moddable/pebbleproxy");
const auth = require("./auth");

Pebble.addEventListener("ready", function () {
  moddableProxy.readyReceived();
  auth.onReady();
});

Pebble.addEventListener("appmessage", function (e) {
  if (moddableProxy.appMessageReceived(e)) {
    return;
  }
  auth.handleMessage(e.payload);
});
