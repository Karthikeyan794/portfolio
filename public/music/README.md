# Playlist assets

## Tracks
Add an MP3 here, then set `src` for that track in `src/data.ts`:

    { title: 'The One', artist: 'Anirudh Ravichander', src: '/music/the-one.mp3', art: '...' }

While `src` is empty the play button stays disabled and the card links out to
Spotify instead. I can't ship the tracks themselves — they're copyrighted and
not mine to distribute. Same for cover art: set `cover` on a track to point at
an image file and it replaces the drawn gradient.

## Background
`playlist-bg.mp4` plays muted behind the crate. Change or clear it with
`playlist.video` in `src/data.ts` — an empty string hides it.

NOTE: this clip came from a Pinterest scraper, so its licence is unknown.
Check you're allowed to use it before the site goes public, or swap it.
