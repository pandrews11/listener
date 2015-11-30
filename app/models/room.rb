require 'box'
require 'base64'

class Room < ActiveRecord::Base

  belongs_to :owner, :class_name => 'User'

  def box
    marshal_box if read_attribute(:box).nil?
    Marshal.load(Base64.decode64(read_attribute :box))
  end

  def box_api
    @box ||= Box::User.login username, password
  end

  def station
    @station ||= box.find_station(station_id) || box.stations.first
  end

  def stations
    box.stations
  end

  def playlist
    station.playlist
  end

  def song_map
    playlist.map do |p|
      {
        :song => p.song_name,
        :album => p.album_name,
        :artist => p.artist_name,
        :song_url => p.high_quality_audio_url
      }
    end
  end

  def info
    { :station_id => station.station_id, :playlist => song_map }
  end

  def marshal_box
    write_attribute :box, Base64.encode64(Marshal.dump(box_api))
    save
  end
end
