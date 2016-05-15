class ListenerChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_#{params[:room_id]}"
  end

  def unsubscribed
    puts 'unsubscribed'
  end
end
