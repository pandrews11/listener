module RoomsHelper
  def play_station_button(room, station)
    button_to station.station_name, {
      action: 'set_station_id', station_id: station.station_id
    },
    remote: true, class: 'list-group-item',
    form_class: play_class(room, station),
    'data-station-id' => station.station_id
  end

  def play_class(room, station)
    room.station.station_id == station.station_id ? 'active' : ''
  end
end
