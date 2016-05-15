var Manager = function() {
  var $manager = this;

  // Local playlist for storing queued songs.
  this.playlist = new Queue();

  // Audio player
  this.player = $('#audio-player').find('audio');

  // The next button to load next song
  this.nextButton = $('#next');

  this.roomId = $(location).attr('href').split('/').slice(-1)[0];

  this.current = {};

  // ActionCable connection.
  this.server = App.cable.subscriptions.create({
    channel: 'ManagerChannel',
    room_id: $manager.roomId
  });

  this.server.connected = function() {
    console.log("Manager Connected")
    $manager._setUp();
  },

  this.server.received = function(data) {
    switch(data.action) {
      case 'user_join':
        $manager.sync_user(data.user_id)
        break;
    }
  },

  this.sync_user = function(user_id) {
    console.log("Asked to sync user with id: " + user_id)
    console.log("Sending sync data...");
    console.log($.extend({user_id: user_id}, $manager._currentInfo()));

    this.server.perform( "sync_user",
      $.extend({user_id: user_id}, $manager.current)
    );
  }

  this.syncAll = function() {
    console.log("Syncing all users...")
    console.log($manager._currentInfo())

    $manager.server.perform( "sync_all", $manager._currentInfo() );
  },

  this.next = function() {
    this._loadNextSong( $manager.syncAll );
  },

  this.changeStation = function() {
    this._dumpPlaylist();
    this.next();
  },

  this._dumpPlaylist = function() {
    var playlistLength = this.playlist.getLength();

    for ( i = 0; i < playlistLength; i++ ) {
      this.playlist.dequeue();
    }
  },

  this._getNewData = function(dataHandler, resolve, reject) {
    $.ajax({
      url: $manager._infoUrl(),
      type: 'GET',
      dataType: 'json',
      success: function(data, status, xhr) {
        dataHandler(data.room);
        resolve(true);
      },
      error: function() {
        reject(false);
      }
    });
  },

  this._handleNewData = function( data ) {
    $.each(data.playlist, function(index, songData) {
      $manager.playlist.enqueue(songData);
    });
  },

  this._infoUrl = function() {
    return '/rooms/' + this.roomId + '/info';
  }

  this.nextUp = function() {
    return this.playlist.peek();
  },

  this._loadNextSong = function( callback ) {
    var promise = new Promise( function(resolve, reject) {
      $manager._reloadQueue(resolve, reject);
    });

    promise.then( function(result) {
      // Load new song into player
      $manager._loadToAudioElement($manager.playlist.dequeue())

      // Tell the server that a new song has been popped off queue
      $manager._alertSongStarted();

      // Run any callback that was passed in
      if ( callback ) { callback(); }
    });
  },

  this._startedUrl = function() {
    return '/rooms/' + this.roomId + '/song_started';
  },

  this._alertSongStarted = function() {
    $.ajax({
      url: $manager._startedUrl(),
      dataType: 'json'
    });
  },

  this._reloadQueue = function(resolve, reject) {
    if ( this.playlist.getLength() < 1 ) {
      $manager._getNewData(
        $.proxy($manager._handleNewData, $manager), resolve, reject
      );
    } else {
      resolve(true);
    }
  },

  this._currentTime = function() {
    return this.player[0].currentTime;
  },

  this._currentInfo = function() {
    return $.extend( $manager.current, {
      current_time: $manager._currentTime()
    });
  },

  this._updateMetadata = function() {
    $('#artist-name').text($manager.current.artist);
    $('#song-name').text($manager.current.song);
    $('#album-name').text($manager.current.album);
    $('#album-art').find('img').attr('src', $manager.current.album_art_url);
  },

  this._loadToAudioElement = function( songData ) {
    this.current = songData;

    this._updateMetadata();
    this.player.find('source')[0].src = this.current.song_url;
    this.player[0].load();
  },

  this.playing = function() {
    return this.player[0].duration > 0 && !this.player[0].paused
  }

  this._setUp = function() {
    if ( !$manager.playing() )
      this.next();

    this.player.on('ended', function(e) {
      console.log("Song ended, loading new song and syncing listeners...")
      $manager.next();
    });

    this.nextButton.on('click', function(e) {
      $manager.next();
    });

    this.player.data('manager', $manager);
  };
}
