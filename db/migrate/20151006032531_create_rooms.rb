class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.text :name
      t.text :username
      t.text :password
      t.text :station_id
      t.text :box
      t.belongs_to :user
      t.timestamps null: false
    end
  end
end
