class ManagerChannel < ApplicationCable::Channel
  def subscribed
    # Used for accessing the manager in a room
    stream_from "room_#{params[:room_id]}:manager"

    # Used for accessing all people in room
    stream_from "room_#{params[:room_id]}"
  end

  def sync_user(data)
    ActionCable.server.broadcast "user_#{data['user_id']}",
      { action: 'user_sync', song_data: data }
  end

  def sync_all(data)
    ActionCable.server.broadcast "room_#{params[:room_id]}:listener",
      { action: 'user_sync', song_data: data }
  end

  def unsubscribed
    p 'unsubscribed'
  end
end
