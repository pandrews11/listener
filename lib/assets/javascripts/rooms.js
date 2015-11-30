$(document).ready(function() {
  var audioPlayer = $('#audio-player').find('audio').radio({
    elSongName: $('#song-name'),
    elArtistName: $('#artist-name'),
    elAlbumName: $('#album-name'),
    nextButton: $('#next')
  });
});

$.widget( "lis.radio", {
  options: {
    stationId: null,
    playlist: new Queue(),
    elSongName: null,
    elAlbumName: null,
    elArtistName: null,
    nextButton: null,
  },

  next: function() {
    this._loadNextSong();
  },

  stationChange: function() {
    var plugin = this;

    this._dumpPlaylist();
    this._loadNextSong();
  },

  _dumpPlaylist: function() {
    var playlistLength = this.options.playlist.getLength();

    for ( i = 0; i < playlistLength; i++ ) {
      this.options.playlist.dequeue();
    }
  },

  _create: function() {
    this.element.addClass('radio-lis');
    this._setUp();
  },

  _roomId: function() {
    var hrefArr = $(location).attr('href').split('/');
    return hrefArr[hrefArr.length - 1];
  },

  _infoUrl: function() {
    return '/rooms/' + this._roomId() + '/info';
  },

  _reloadQueue: function(cb) {
    var plugin = this;

    if ( this.options.playlist.getLength() <= 1 ) {
      plugin._getNewData($.proxy(plugin._handleNewData, plugin), cb);
    } else {
      cb();
    }
  },

  _loadNextSong: function() {
    var plugin = this;

    this._reloadQueue(function() {
      plugin._loadToAudioElement(plugin.options.playlist.dequeue())
    });
  },

  _loadToAudioElement: function(songData) {
    this._updateMetadata(songData);
    this.element.find('source')[0].src = songData.song_url;
    this.element[0].load();
    this.element[0].play();
  },

  _updateMetadata: function(data) {
    this.options.elSongName.text(data.song);
    this.options.elArtistName.text(data.artist);
    this.options.elAlbumName.text(data.album);
  },

  _handleNewData: function(data) {
    var plugin = this;

    plugin.options.stationId = data.station_id;
    $.each(data.playlist, function(index, songData) {
      plugin.options.playlist.enqueue(songData);
    });
  },

  _setUp: function() {
    var plugin = this;

    this._getNewData($.proxy(this._handleNewData, plugin));
    this.element.on('ended', function(e) {
      plugin._loadNextSong();
    });

    this.options.nextButton.on('click', function(e) {
      plugin.next();
    });
  },

  _getNewData: function(dataHandler, cb) {
    $.ajax({
      url: this._infoUrl(),
      dataType: 'json',
      success: function(data, status, xhr) {
        dataHandler(data.room);
        if ( !(cb === undefined) )
          cb();
      }
    });
  }
});
