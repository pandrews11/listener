require 'box'
require 'base64'

class Room < ActiveRecord::Base
  has_secure_password

  serialize :playlist, Array

  belongs_to :user

  before_save :bust_playlist!, :if => :bust_playlist?

  def box
    marshal_box if read_attribute(:box).blank?
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

  def song_started
    self.playlist = playlist.drop(1)
    save
  end

  def playlist
    read_attribute :playlist
  end

  def song_map
    station.playlist.map { |s| song_data s }
  end

  def info
    { :station_id => station_id, :playlist => playlist }
  end

  def marshal_box
    update_attributes({ :box => Base64.encode64(Marshal.dump(box_api)) })
  end

  private

  def song_data(song)
    {
      :song => song.song_name,
      :album => song.album_name,
      :album_art_url => song.album_art_url,
      :artist => song.artist_name,
      :song_url => song.high_quality_audio_url
    }
  end

  def bust_playlist!
    self.playlist = song_map
  end

  def bust_playlist?
    playlist_empty? || station_id_changed?
  end

  def playlist_empty?
    read_attribute(:playlist).empty?
  end
end
