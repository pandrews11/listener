$.widget( "lis.listener", {
  options: {

    dispatcher: new WebSocketRails(websocketURI()),

    // Current ID of the station /rooms/<ID>
    stationId: null,

    elSongName: null,

    elAlbumName: null,

    elArtistName: null,

    elAlbumArt: null,

    nextButton: null
  },

  _userID: function() {
    return $('#user-id').text();
  },

  _channelId: function() {
    return 'room-' + this._roomId()
  },

  _create: function() {
    this.element.addClass('radio-lis');
    this._setUp();
  },

  _roomId: function() {
    var hrefArr = $(location).attr('href').split('/');
    return hrefArr[hrefArr.length - 1];
  },

  _loadToAudioElement: function(songData) {
    this._updateMetadata(songData);
    this.element.find('source')[0].src = songData.song_url;
    this.element[0].currentTime = songData.current_time;
    this.element[0].load();
    this.element[0].play();
  },

  _updateMetadata: function(data) {
    this.options.elSongName.text(data.song);
    this.options.elArtistName.text(data.artist);
    this.options.elAlbumName.text(data.album);
    this.options.elAlbumArt.attr('src', data.album_art_url)

    this._updateStationSelection(data.station_id)
  },

  _updateStationSelection: function(stationId) {
    this.options.stationId = stationId;

    $('.room-list').find('form').removeClass('active');
    $('.room-list').find('form input[data-station-id="' + stationId + '"]')
      .parent('form').addClass('active');
  },

  _dispatcher: function() {
    return this.options.dispatcher;
  },

  _channel: function() {
    return this._dispatcher().subscribe('room-' + this._roomId());
  },

  _trigger: function(dest, message) {
    this._dispatcher().trigger(dest, message);
  },

  _joinInfo: function() {
    return { room_id: this._roomId() };
  },

  _join: function() {
    console.log("Triggering join with")
    console.log(this._joinInfo());
    this._trigger('join', this._joinInfo());
  },

  _setUp: function() {
    var plugin = this;

    this._join();

    this._dispatcher().bind('sync', function(data) {
      plugin._loadToAudioElement(data);
    });

    this._channel().bind('group_sync', function(data) {
      plugin._loadToAudioElement(data);
    });

    $(window).on('beforeunload', function(e) {
      plugin._trigger('leave', plugin._joinInfo());
    })
  },
});
