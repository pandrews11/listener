class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_one :room
  belongs_to :room

  def owns?(room)
    room.owner == self
  end

  def join(room_id)
    ActionCable.server.broadcast "room_#{room_id}:manager",
      { action: 'user_join', user_id: id }
  end



end
