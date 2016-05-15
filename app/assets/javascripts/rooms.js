//= require_self

$( document ).ready( function() {
  if ( $('#audio-player').attr('data-status') === 'manager' ) {
    var manager = new Manager();
  } else {
    var listener = new Listener();
  }
});
