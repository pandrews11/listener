class RoomsManagerController < WebsocketRails::BaseController
  def join
    @room = Room.find(message[:room_id])

    @room.listeners << current_user
    managing_user = @room.owner

    WebsocketRails.users[managing_user.id] \
      .send_message(:join_request, {user_id: current_user.id} )
  end

  def sync
    WebsocketRails.users[message[:user_id]] \
      .send_message(:sync, message)
  end

  def group_sync
    WebsocketRails[message[:channel_name]] \
      .trigger(:group_sync, message)
  end

  def leave
    @room = Room.find(message[:room_id])

    @room.listeners.delete(current_user)
  end
end
