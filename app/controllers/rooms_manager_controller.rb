class RoomsManagerController < WebsocketRails::BaseController
  def client_connected
    p "client connected"
  end

  def client_disconnected
    p "client_connected"
  end

  def join
    p "recieved join...sending sync message: "
    WebsocketRails["room-4"].trigger(:sync, message)
  end
end
