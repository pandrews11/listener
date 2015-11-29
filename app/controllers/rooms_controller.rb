class RoomsController < ApplicationController
  respond_to :html, :json

  def new
    @room = Room.new
  end

  def create
    Room.create room_params
    redirect_to :action => :index
  end

  def show
    @room = Room.find(params[:id])
  end

  def set_station_id
    @room = Room.find(params[:id])

    @room.station_id = params[:station_id]

    respond_to do |format|
      format.js
    end
  end

  def next
    url = Room.find(params[:id]).song_url_list.first

    respond_to do |format|
      format.json { render json: { url: url, status: 200 } }
    end
  end

  private

  def room_params
    params.require(:room).permit(:username, :password, :name)
  end
end
