//= require_self

var Manager = function( options ) {
  var $_manager = this;
  this.options = options;
  this.element = this.options.element;
  this.playlist = new Queue();
  this.nextButton = $('#next')
  this.roomId = $(location).attr('href').split('/').slice(-1)[0];

  this.server = App.cable.subscriptions.create({
    channel: 'ManagerChannel',
    room_id: $_manager.roomId
  });

  this.server.connected = function() {
    console.log("Manager Connected")
    $_manager._setUp();
  },

  this.server.received = function(data) {
    console.log("Received: ")
    console.log(data);
    switch(data.action) {
      case 'user_join':
        $_manager.sync_user(data.user_id)
        break;
      default:
        console.log("Received broadcast request with undefined action");
        console.log(data);
    }
  },

  this.sync_user = function(user_id) {
    console.log("Asked to sync user with id:" + user_id)
    console.log("Sending sync data");
    console.log($.extend({user_id: user_id}, $_manager._currentInfo()));

    this.server.perform( "sync_user",
      $.extend({user_id: user_id}, $_manager._currentInfo())
    );
  }

  this.syncAll = function() {
    console.log("Syncing all users...")
    console.log($_manager._currentInfo())
    this.server.perform( "sync_all", $_manager._currentInfo() );
  },

  this.next = function() {
    this._loadNextSong();

    // Sync all listeners
    this.syncAll();
  },

  this.changeStation = function() {
    this._dumpPlaylist();
    this._loadNextSong();
  },

  this._dumpPlaylist = function() {
    var playlistLength = this.playlist.getLength();

    for ( i = 0; i < playlistLength; i++ ) {
      this.playlist.dequeue();
    }
  },

  this._getNewData = function(dataHandler, cb) {
    $.ajax({
      url: $_manager._infoUrl(),
      type: 'GET',
      dataType: 'json',
      success: function(data, status, xhr) {
        dataHandler(data.room);
        if ( !(cb === undefined) ) { cb(); }
      }
    });
  },

  this._handleNewData = function(data) {
    $.each(data.playlist, function(index, songData) {
      $_manager.playlist.enqueue(songData);
    });
  },

  this._infoUrl = function() {
    return '/rooms/' + this.roomId + '/info';
  }

  this._loadNextSong = function() {
    this._reloadQueue(function() {
      $_manager._loadToAudioElement($_manager.playlist.dequeue())
      $_manager._alertSongStarted();
    });
  },

  this._startedUrl = function() {
    return '/rooms/' + this.roomId + '/song_started';
  },

  this._alertSongStarted = function() {
    $.ajax({
      url: $_manager._startedUrl(),
      dataType: 'json'
    });
  },

  this._reloadQueue = function(cb) {
    if ( this.playlist.getLength() < 1 ) {
      $_manager._getNewData($.proxy($_manager._handleNewData, $_manager), cb);
    } else {
      cb();
    }
  },

  this._currentTime = function() {
    return this.element[0].currentTime;
  },

  this._songData = function() {
    return {
      song: $('#song-name').text(),
      artist: $('#artist-name').text(),
      album: $('#album-name').text(),
      song_url: this.element.find('source')[0].src,
      album_art_url: $('#album-art').find('img').attr('src')
    };
  },

  this._currentInfo = function() {
    return $.extend( $_manager._songData(), {
      current_time: $_manager._currentTime()
    });
  },

  this._updateMetadata = function(data) {
    $('#artist-name').text(data.artist);
    $('#song-name').text(data.song);
    $('#album-name').text(data.album);
    $('#album-art').find('img').attr('src', data.album_art_url);
  },

  this._loadToAudioElement = function(songData) {
    $_manager._updateMetadata(songData);
    $_manager.element.find('source')[0].src = songData.song_url;
    $_manager.element[0].load();
  },

  this.playing = function() {
    return this.element[0].duration > 0 && !this.element[0].paused
  }

  this._setUp = function() {
    if ( !$_manager.playing() )
      this.next();

    this.element.on('ended', function(e) {
      $_manager.next();
    });

    this.nextButton.on('click', function(e) {
      $_manager.next();
    });

    this.element.data('manager', $_manager);
  };
}
