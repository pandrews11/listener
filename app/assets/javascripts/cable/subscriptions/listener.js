var Listener = function(element) {
  var $listener = this;
  this.element = element;
  this.roomId = $(location).attr('href').split('/').slice(-1)[0];

  this.server = App.cable.subscriptions.create({
    channel: 'ListenerChannel',
    room_id: $listener.roomId
  });

  this.server.connected = function() {
    console.log("Listener Connected");
  },

  this.server.received = function(data) {
    console.log("Received sync request... ")
    console.log(data);
    $listener._loadToAudioElement(data);
  },

  this._loadToAudioElement = function(songData) {
    this._updateMetadata(songData);
    this.element.find('source')[0].src = songData.song_url;
    this.element[0].currentTime = songData.current_time;
    this.element[0].load();
  },

  this._updateMetadata = function(data) {
    $('#artist-name').text(data.artist);
    $('#song-name').text(data.song);
    $('#album-name').text(data.album);
    $('#album-art').find('img').attr('src', data.album_art_url);
  }
}
