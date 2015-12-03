class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.text :name
      t.text :username
      t.text :password
      t.text :station_id
      t.text :playlist
      t.text :box
      t.datetime :playlist_expiration, :default => 30.minutes.from_now
      t.integer :listeners, :default => 0
      t.belongs_to :user
      t.timestamps null: false
    end
  end
end
