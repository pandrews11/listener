class StationsController < ApplicationController
  respond_to :html

  def new
    @station = Station.new
  end

  def create
  end
end
