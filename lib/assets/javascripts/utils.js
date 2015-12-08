function hostname() {
  return window.location.hostname
}

function port() {
  if (window.location.port.length > 0) {
    return ':' + window.location.port;
  } else {
    return '';
  }
}

function websocketURI() {
  return hostname() + port() + '/websocket';
}
