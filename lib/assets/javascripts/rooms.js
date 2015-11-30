$(function() {
  $('#audio-player').find('audio').radio({
    elSongName: $('#song-name'),
    elArtistName: $('#artist-name'),
    elAlbumName: $('#album-name'),
    nextButton: $('#next')
  });
});

$.widget( "lis.radio", {
  options: {
    playlist: new Queue(),
    dispatcher: new WebSocketRails(window.location.hostname + ':' + window.location.port + '/websocket'),
    songData: null,
    stationId: null,
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

  songData: function() {
    return this.options.songData;
  },

  _channel: function() {
    return this.options.dispatcher.subscribe(this._channelId());
  },

  _channelId: function() {
    return 'room-' + this._roomId()
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

  _currentTime: function() {
    return this.element[0].currentTime;
  },

  _songData: function() {
    return {
      song: this.options.elSongName.text(),
      artist: this.options.elArtistName.text(),
      album: this.options.elAlbumName.text(),
      song_url: this.element.find('source')[0].src
    }
  },

  _currentInfo: function() {
    var plugin = this;
    return $.extend(plugin._songData(), {current_time: plugin._currentTime()});
  },

  _sync: function(data) {
    console.log(data);
    this._loadToAudioElement(data);
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

    this._channel().bind('join', function() {
      plugin.options.dispatcher.trigger('room_join', plugin._currentInfo() );
    })

    this._channel().bind('sync', function(data) {
      console.log("received sync");
      plugin._sync(data);
    })
  },

  _getNewData: function(dataHandler, cb) {
    plugin = this;

    $.ajax({
      url: plugin._infoUrl(),
      dataType: 'json',
      success: function(data, status, xhr) {
        dataHandler(data.room);
        plugin.songData = data.room;
        if ( !(cb === undefined) )
          cb();
      }
    });
  }
});
