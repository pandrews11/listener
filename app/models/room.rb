require 'box'

class Room < ActiveRecord::Base

  belongs_to :owner, :class_name => 'User'

  def box
    @box ||= Box::User.login username, password
  end

  def station_id
    @station_id ||= box.stations.first.station_id
  end

  def current_station
    box.find_station station_id
  end

  def stations
    box.stations
  end

  def song_url_list
    box.find_station(station_id).playlist.map &:high_quality_audio_url
  end
end
