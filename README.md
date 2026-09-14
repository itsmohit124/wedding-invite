# Anmol & Maneesha — Wedding Invitation

A digital wedding invitation in the style of the reference video: a floral envelope you
tap to open, a watercolour garden invite, a scratch card that reveals the wedding date,
event cards, families, the venue map, and a closing note.

Open `index.html` in a browser, or serve the folder (`python3 -m http.server`) if you
want the map iframe to behave exactly as it will in production.

## Editing the invitation

**Everything lives in `config.js`.** You never need to touch the HTML. Change a value
there and reload — the page rebuilds itself from that file.

| What you want to change | Where in `config.js` |
| --- | --- |
| Names, who is named first | `couple` (`order` sets the sequence) |
| Parents' / grandparents' names | `couple.groom.parents`, `couple.bride.parents` |
| Invocation lines above the names | `blessing` |
| Wedding date + countdown target | `saveTheDate.target` and `saveTheDate.revealText` |
| Events (add, remove, reorder) | `events` — it's a plain array |
| Family names | `families.groups` |
| Venue, address, map | `venue` |
| Colours, fonts scale, column width | `theme` |
| Background music | `music.src` |

A few notes:

- **Parents and families are currently empty**, so those lines simply don't render.
  Fill in `couple.*.parents` and `families.groups` when you have the names.
- **Events** are fully dynamic. Add a fourth entry and it appears; delete one and the
  layout closes up. `scrim` is the tint laid over the photo so the text stays readable.
  Two unused illustrations are included: `assets/event-1.jpg` (temple courtyard) and
  `assets/event-5.jpg` (evening reception).
- **The map** works from `venue.mapQuery` alone — no API key needed. If you want a
  specific pinned location, paste a full Google Maps embed URL into `venue.mapEmbed`.
- **Music** is hidden until you add a file. Drop an MP3 into `assets/` and set
  `music.src: 'assets/wedding-song.mp3'`; the floating button then appears.

## The scratch card

`scratch.js` draws a pink foil coating on a canvas and erases it under the pointer.
It works with mouse, finger and stylus, and the card reveals itself once about 45% has
been cleared (`saveTheDate` text appears, followed by the live countdown).

Strokes are stored as normalised coordinates rather than pixels, so rotating the phone
or resizing the window repaints the coating at the new size **without losing progress**.
There is also a keyboard path: focus the card and press Enter to reveal it.

## Screen sizes

The invite is one centred paper column, capped at `theme.pageWidth` (40rem). Display
type scales with the column and then freezes, so a small phone, a tablet and a 4K
monitor all show the same proportions rather than absurdly large text. Also handled:
safe-area insets for notched phones, a compact layout for phones held in landscape,
and `prefers-reduced-motion` for anyone who has animations turned off.

## Files

```
index.html    thin shell — no content lives here
config.js     all content and theme values  ← edit this
app.js        builds the page from config, countdown, petals, music, reveals
scratch.js    the scratch-card canvas
style.css     design system and layout
assets/       watercolour garden, envelope print, event artwork
```
