function hostname() {
  return window.location.hostname
}

function port() {
  return window.location.port
}

function websocketURI() {
  return hostname() + ':' + port() + '/websocket';
}
