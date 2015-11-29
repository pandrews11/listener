require 'box'

class Room < ActiveRecord::Base

  belongs_to :owner, :class_name => 'User'

  def box
    @box ||= Box::User.login username, password
  end

  def station
    @station ||= box.find_station(station_id) || box.stations.first
  end

  def stations
    box.stations
  end

  def album_name_list
    station.playlist.map &:album_name
  end

  def song_name_list
    station.playlist.map &:song_name
  end

  def song_url_list
    station.playlist.map &:high_quality_audio_url
  end

  def info
    station
  end
end
