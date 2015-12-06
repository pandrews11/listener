class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.text :name
      t.text :username
      t.text :password_digest
      t.text :station_id
      t.text :playlist
      t.text :box
      t.integer :listeners, :default => 0
      t.belongs_to :user
      t.timestamps null: false
    end
  end
end
