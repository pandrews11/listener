(function($) {
  $.player = function(audioPlayer, options) {
    var defaults = {};

    var plugin = this;

    plugin.player = $(audioPlayer);

    plugin.settings = {}
    plugin.settings = $.extend({}, defaults, options);

    plugin.player.on('ended', function(e) {
      plugin.setNextSong();
    });

    plugin.setNextSong = function() {
      $.ajax({
        url: plugin.nextUrl(),
        dataType: 'json',
        success: function(data, status, xhr) {
          plugin.load(data.url);
          plugin.play();
        }
      });
    }

    plugin.currentTime = function() {
      return plugin.player[0].currentTime;
    }

    plugin.roomId = function() {
      var hrefArr = $(location).attr('href').split('/');
      return hrefArr[hrefArr.length - 1];
    }

    plugin.nextUrl = function() {
      return '/rooms/' + plugin.roomId() + '/next';
    }

    plugin.load = function(url) {
      plugin.player.find('source')[0].src = url;
      plugin.player[0].load();
    }

    plugin.play = function() {
      plugin.player[0].play();
    }
  }

  $.fn.player = function(options) {
    return this.each(function() {
      if (undefined == $(this).data('player')) {
        var player = new $.player(this, options);
        $(this).data('player', player);
      }
    });
  }
})( jQuery );

$(document).ready(function() {
  $('#audio-player').find('audio').player();
});
