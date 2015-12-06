require 'rails_helper'

describe Room do
  let(:room) {
    FactoryGirl.build(:room,
      :playlist => songs,
      :station_id => 'abc123',
      :password => 'hello'
    )
  }

  context 'associations' do
    it { should belong_to(:user) }
  end

  context '#info' do
    it 'responds with correct info' do
      expect(room.info).to eq({:station_id => 'abc123', :playlist => songs})
    end
  end

  context '#song_started' do
    it 'shifts the current playlist' do
      allow(room).to receive(:station_id_changed?).and_return false
      room.song_started
      room.reload
      expect(room.playlist).to eq(songs[1..2])
    end
  end

  context '#bust_playlist' do
    it 'updates playlist when station id changes' do
      allow(room).to receive(:song_map).and_return new_songs
      room.update_attributes(:station_id => 'abc1234')
      room.reload
      expect(room.playlist).to eq(new_songs)
    end

    it 'updates playlist when the playlist becomes empty' do
      allow(room).to receive(:song_map).and_return new_songs
      room.update_attributes(:playlist => [])
      room.reload
      expect(room.playlist).to eq(new_songs)
    end
  end
end

def songs
   [
    {
      song: "Viva La Vida",
      album: "Viva La Vida",
      album_art_url: "http://coldplay_image.jpg",
      artist: "Coldplay",
      song_url: "http://coldplay_song,mp3"
    },
    {
      song: "Whereabouts Unknown",
      album: "Appeal To Reason",
      album_art_url: "http://rise_against_image.jpg",
      artist: "Rise Against",
      song_url: "http://rise_against_song.mp3"
    },
    {
      song: "Where'd You Go",
      album: "The Rising Tied (Explicit)",
      album_art_url: "http://fort_minor_image.jpg",
      artist: "Fort Minor",
      song_url: "http://fort_minor_song.mp3"
    }
  ]
end

def new_songs
  songs.map do |s|
    s.values.map { |v| v << '1' }
  end
end

