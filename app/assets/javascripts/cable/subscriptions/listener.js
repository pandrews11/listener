var Listener = function(element) {
  var $listener = this;

  // Audio player
  this.player = $('#audio-player').find('audio');

  this.roomId = $(location).attr('href').split('/').slice(-1)[0];

  // ActionCable connection
  this.server = App.cable.subscriptions.create({
    channel: 'ListenerChannel',
    room_id: $listener.roomId
  });

  this.server.connected = function() {
    console.log("Listener Connected");
  },

  this.server.received = function(data) {
    if ( data.user )
      var user = $.parseJSON(data.user);

    switch(data.action) {
      case 'user_sync':
        console.log("Received sync request... ")
        console.log(data);

        $listener._loadToAudioElement(data.song_data);
        break;
      case 'user_added':
        $listener.addToListenerList(user);
        break;
      case 'user_left':
        $listener.removeFromListenerList(user)
    }
  },

  this.addToListenerList = function(user) {
    if ( user.id == this.userId() )
      return;

    var newItem = $([
      "<li data-id='" + user.id + "' class='list-group-item'>",
      "<span>" + user.username + "</span>",
      "</li>"
    ].join("\n"));

    $('.listener-list').append(newItem);
  }

  this.removeFromListenerList = function(user) {
    $('.listener-list').find('li[data-id=' + user.id + ']')
      .fadeOut("fast", function() { $(this).remove() });
  }

  this.userId = function() {
    return $('#user-id').text();
  }

  this.addToListenerList = function(user) {
    console.log("Ask to add user to list");
    console.log(user);
  },

  this._loadToAudioElement = function(songData) {
    this._updateMetadata(songData);
    this.player.find('source')[0].src = songData.song_url;
    this.player[0].currentTime = songData.current_time;
    this.player[0].load();
  },

  this._updateMetadata = function(data) {
    $('#artist-name').text(data.artist);
    $('#song-name').text(data.song);
    $('#album-name').text(data.album);
    $('#album-art').find('img').attr('src', data.album_art_url);
  }
}
