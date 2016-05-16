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
    if room = Room.find_by(id: room_id)
      room.listeners |= [self]
    end
  end

  def leave(room_id)
    if room = Room.find_by(id: room_id)
      room.listeners.delete self
    end
  end



end
