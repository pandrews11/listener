module RoomsHelper
  def play_station_button(station)
    button_to station.station_name, {
      action: 'set_station_id', station_id: station.station_id
    }, remote: true, 'data-station-id' => station.station_id,
    class: 'list-group-item'
  end
end
