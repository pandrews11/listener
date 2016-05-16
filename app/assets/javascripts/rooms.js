//= require_self

$( document ).ready( function() {

  // Only build manager/listener object once room is joined
  if ( window.location.pathname.match(/\/rooms\/\d+/) ) {

    if ( $('#audio-player').attr('data-status') === 'manager' ) {
      var manager = new Manager();
    } else {
      var listener = new Listener();
    }
  }
});
