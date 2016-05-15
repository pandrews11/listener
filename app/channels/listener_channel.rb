class ListenerChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_#{params[:room_id]}:listener"
    stream_from "user_#{current_user.id}"

    current_user.join params[:room_id]
  end

  def unsubscribed
    p 'unsubscribed'
  end
end
