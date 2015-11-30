class RoomsController < ApplicationController
  respond_to :html, :json

  before_filter :find_room, :except => [:new, :create, :index]

  def new
    @room = Room.new
  end

  def create
    Room.create room_params
    redirect_to :action => :index
  end

  def show
    WebsocketRails["room-#{params[:id]}"].trigger(:join)
  end

  def info
    respond_to do |format|
      format.json { render json: { room: @room.info, status: 200 } }
    end
  end

  def set_station_id
    @room.update_attributes({ :station_id => params[:station_id] })

    respond_to do |format|
      format.js
    end
  end

  private

  def find_room
    @room ||= Room.find(params[:id])
  end

  def room_params
    params.require(:room).permit(:username, :password, :name, :user_id)
  end
end
