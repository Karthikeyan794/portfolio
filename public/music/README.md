# Playlist assets

## Tracks
The six songs here are the files as downloaded, byte for byte (not
re-encoded), each wired up in `playlist.tracks` in `src/data.ts`:

    { title: 'Hangova', artist: 'Anirudh Ravichander, Heisenberg', src: '/music/hangova.mp3', art: '...' }

They are commercial film songs, published here by the site owner's choice.
The rights are the labels'; a takedown notice to GitHub could block the repo.
To pull them, empty each `src` (the play button then disables itself) and
delete the MP3s.

The files' own tags and cover art carry a download site's name and
watermark, which is why the records use drawn gradients (`art`) and not the
embedded covers.

## Background
`playlist-bg.mp4` sits behind the crate: still on its first frame until a song
plays, running only while one does. Change or clear it with `playlist.video`
in `src/data.ts` — an empty string hides it.

NOTE: this clip came from a Pinterest scraper, so its licence is unknown.
Check you're allowed to use it before the site goes public, or swap it.
