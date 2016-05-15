class RoomsController < ApplicationController
  respond_to :html, :json

  before_action :find_room, :except => [:new, :create, :index]

  def new
    @room = Room.new
  end

  def create
    Room.create(room_params.merge(:owner => current_user))
    redirect_to :action => :index
  end

  def show
    @listener_status = get_listener_status
  end

  def song_started
    @room.song_started
    head :ok
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

  def get_listener_status
    current_user.owns?(@room) ? 'manager' : 'listener'
  end
end
