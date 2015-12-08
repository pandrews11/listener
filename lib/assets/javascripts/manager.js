$.widget( "lis.manager", {
  options: {

    // Queue to store future song data
    playlist: new Queue(),

    dispatcher: new WebSocketRails('pandora-listener.herokuapp.com/websocket'),

    // Current ID of the station /rooms/<ID>
    stationId: null,

    elSongName: null,

    elAlbumName: null,

    elArtistName: null,

    elAlbumArt: null,

    nextButton: null
  },

  next: function() {
    this._loadNextSong();
  },

  stationChange: function() {
    this._dumpPlaylist();
    this._loadNextSong();
  },

  _userID: function() {
    return $('#user-id').text();
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

  _dispatcher: function() {
    return this.options.dispatcher;
  },

  _channel: function() {
    return this._dispatcher().subscribe('room-' + this._roomId());
  },

  _channelName: function() {
    return "room-" + this._roomId();
  },

  _listenerIsNew: function(listener) {
    return $('.listener-list')
      .find('li[data-id=' + listener.id + ']').length === 0;
  },

  _newListenerListItem: function(listener) {
    var username = listener.username,
              id = listener.id;

    return $([
      "<li data-id='" + id + "' class='list-group-item'>",
      "<span>" + username + "</span>",
      "</li>"
    ].join("\n"));
  },

  _loadNextSong: function() {
    var plugin = this;

    this._reloadQueue(function() {
      plugin._loadToAudioElement(plugin.options.playlist.dequeue())
      plugin._alertSongStarted();
    });
  },

  _reloadQueue: function(cb) {
    var plugin = this;

    if ( this.options.playlist.getLength() < 1 ) {
      plugin._getNewData($.proxy(plugin._handleNewData, plugin), cb);
    } else {
      cb();
    }
  },

  _loadToAudioElement: function(songData) {
    plugin._updateMetadata(songData);
    plugin.element.find('source')[0].src = songData.song_url;
    plugin.element[0].load();
    plugin.element[0].play();

    this._groupSync();
  },

  _updateMetadata: function(data) {
    this.options.elSongName.text(data.song);
    this.options.elArtistName.text(data.artist);
    this.options.elAlbumName.text(data.album);
    this.options.elAlbumArt.attr('src', data.album_art_url)
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
      song_url: this.element.find('source')[0].src,
      album_art_url: this.options.elAlbumArt.attr('src')
    }
  },

  _currentInfo: function() {
    var plugin = this;

    return $.extend(plugin._songData(), {
      current_time: plugin._currentTime(),
      channel_name: plugin._channelName(),
      station_id: plugin.options.stationId
    });
  },

  _groupSync: function() {
    this._dispatcher().trigger('group_sync', this._currentInfo());
  },

  _setUp: function() {
    var plugin = this;

    this.next();

    this.element.on('ended', function(e) {
      plugin.next();
    });

    this.options.nextButton.on('click', function(e) {
      plugin.next();
    });

    this._dispatcher().bind('join_request', function(data) {
      plugin._dispatcher()
        .trigger('sync',
          $.extend(plugin._currentInfo(), { user_id: data.user_id} ) );
    });

    this._dispatcher().bind('listener_added', function(data) {
      var listenerData = $.parseJSON(data);

      if ( plugin._listenerIsNew(data) ) {
        var newListenerHtml = plugin._newListenerListItem(listenerData);
        $('.listener-list').append(newListenerHtml);
      }
    });

    this._dispatcher().bind('listener_left', function(data) {
      var listenerData = $.parseJSON(data);

      $('.listener-list').find('li[data-id=' + listenerData.id + ']').remove();
    });
  },

  _startedUrl: function() {
    return '/rooms/' + this._roomId() + '/song_started';
  },

  _alertSongStarted: function() {
    plugin = this;

    $.ajax({
      url: plugin._startedUrl(),
      dataType: 'json'
    });
  },

  _getNewData: function(dataHandler, cb) {
    plugin = this;

    $.ajax({
      url: plugin._infoUrl(),
      type: 'GET',
      dataType: 'json',
      success: function(data, status, xhr) {
        dataHandler(data.room);
        if ( !(cb === undefined) ) { cb(); }
      }
    });
  }
});
