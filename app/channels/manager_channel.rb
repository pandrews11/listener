class ManagerChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_#{params[:room_id]}:manager"
  end

  def sync_user(data)
    ActionCable.server.broadcast "user_#{data['user_id']}", data
  end

  def sync_all(data)
    ActionCable.server.broadcast "room_#{params[:room_id]}:listener", data
  end

  def unsubscribed
    p 'unsubscribed'
  end
end
