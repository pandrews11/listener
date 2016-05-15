//= require_self

$( window ).load(function() {

  var audioPlayer = $('#audio-player')

  if ( audioPlayer.attr('data-status') === 'manager' ) {
    var $manager = new Manager({
      element: audioPlayer.find('audio')
    });
  } else {
    // $('#audio-player').find('audio').listener(metadata);
  }

})
