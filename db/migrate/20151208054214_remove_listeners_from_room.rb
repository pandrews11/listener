class RemoveListenersFromRoom < ActiveRecord::Migration
  def change
    remove_column :rooms, :listeners
  end
end
