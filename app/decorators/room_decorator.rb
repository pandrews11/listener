class RoomDecorator < Draper::Decorator
  def play_station(s)
    h.button_to s.station_name,
      { action: 'set_station_id', station_id: s.station_id },
      remote: true, 'data-station-id' => s.station_id, form_class: play_class(s)
  end

  private

  def play_class(station)
    model.station.station_id == station.station_id ? 'active' : ''
  end
end
