class ListenerChannel < ApplicationCable::Channel
  def subscribed
    # User for accessing all listeners in a room
    stream_from "room_#{params[:room_id]}:listener"

    # Used to access this individual in a room
    stream_from "user_#{current_user.id}"

    # Used for accessing all people in room
    stream_from "room_#{params[:room_id]}"

    current_user.join params[:room_id]
  end

  def unsubscribed
    current_user.leave params[:room_id]
  end
end
