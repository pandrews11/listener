$( window ).load(function() {

  var metadata = {
    elSongName: $('#song-name'),
    elArtistName: $('#artist-name'),
    elAlbumName: $('#album-name'),
    elAlbumArt: $('#album-art').find('img'),
    nextButton: $('#next')
  }

  var audioPlayer = $('#audio-player')

  if ( audioPlayer.attr('data-status') === 'manager' ) {
    $('#audio-player').find('audio').manager(metadata);
  } else {
    $('#audio-player').find('audio').listener(metadata);
  }

})
