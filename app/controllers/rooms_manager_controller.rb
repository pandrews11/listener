class RoomsManagerController < WebsocketRails::BaseController
  def join
    Room.find(message[:room_id]).increment!(:listeners, 1)

    managing_user = Room.find(message[:room_id]).user
    WebsocketRails.users[managing_user.id] \
      .send_message('join_request', {user_id: current_user.id} )
  end

  def sync
    WebsocketRails.users[message[:user_id]] \
      .send_message(:sync, message)
  end

  def group_sync
    WebsocketRails[message[:channel_name]] \
      .trigger('group_sync', message)
  end

  def leave
    Room.find(message[:room_id]).decrement!(:listeners, 1)
  end
end
