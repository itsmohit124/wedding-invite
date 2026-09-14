/* ============================================================================
   WEDDING INVITATION — CONTENT & THEME
   ----------------------------------------------------------------------------
   Everything on the invitation is generated from this one file.
   Edit the values below; you never need to touch the HTML.
   ========================================================================== */

window.INVITE = {

  /* ---- Page / browser tab ------------------------------------------------ */
  meta: {
    title: 'Anmol & Maneesha — Wedding Invitation',
    description: 'Together with our families, we invite you to celebrate our wedding on 19th January 2027 at The Grand Shipra, Gorakhpur.'
  },

  /* ---- Colours & sizing. Change one value to re-skin the whole invite. --- */
  theme: {
    paper:     '#fbf7ea',   // main ivory paper (matches the painted artwork)
    paperSoft: '#fffdf8',
    blush:     '#fbe9ef',   // soft pink washes
    rose:      '#d2205a',   // the pink used for names & scripts
    roseSoft:  '#e88ca6',
    wine:      '#7d1a3a',   // footer band
    ink:       '#6d5c50',   // body text
    inkSoft:   '#a08d7e',
    gold:      '#c2a161',
    green:     '#7f9a6d',
    pageWidth: '40rem'      // max width of the invite column on large screens
  },

  /* ---- Background music. Leave src empty to hide the music button. ------- */
  music: {
    src: 'assets/gopi-sundar-sid-sriram-inkem-inkem-inkem-kaavaale-from-geetha-govindam-from-ge_IzQxjLuB.mp3',
    playOnOpen: true,
    volume: 0.7,                    // 70% of the device / system volume
    label: 'Background music'
  },

  /* ---- The envelope / opening screen ------------------------------------ */
  opening: {
    eyebrow: 'With love & blessings',
    title: "You're Invited",
    hint: 'Tap the envelope to open your invitation',
    monogram: null                  // null = auto-built from the two names
  },

  /* ---- The couple. `order` decides who is named first. ------------------ */
  couple: {
    order: ['groom', 'bride'],
    joiner: 'with',
    groom: {
      name: 'Anmol',
      parents: []                   // e.g. ['S/O Shri … & Smt. …']
    },
    bride: {
      name: 'Maneesha',
      parents: []                   // e.g. ['D/O Shri … & Smt. …']
    }
  },

  /* ---- Invocation above the names --------------------------------------- */
  blessing: {
    deities: ['Shri Ganeshay Namah', 'Shri Krishnaya Namah'],
    lines: [
      'By the grace of god and with the blessings of our elders,',
      'together with our families,',
      'we joyfully request your gracious presence',
      'at the celebration of our wedding'
    ]
  },

  /* ---- Scratch card + countdown ----------------------------------------- */
  saveTheDate: {
    eyebrow: 'A little surprise',
    title: 'Save the Date',
    // The moment the countdown counts down to (ISO 8601 — keep the timezone).
    target: '2027-01-19T10:00:00+05:30',
    // Revealed once the card is scratched.
    revealLabel: 'The Wedding Day',
    revealText: '19th January 2027',
    revealNote: 'Mark your calendars & come celebrate with us',
    scratchHint: 'Scratch to reveal',
    countdownTitle: 'Counting down to forever',
    marriedTitle: 'Happily married',
    labels: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' }
  },

  /* ---- Events. Add or remove entries freely — the page adapts. ----------
     Spare artwork you can swap in: assets/event-1.jpg (temple courtyard),
     assets/event-5.jpg (evening reception).                                 */
  eventsHeading: {
    eyebrow: 'Save the moments',
    title: 'Events Schedule'
  },
  events: [
    {
      title: 'Mehendi & Sangeet',
      tagline: 'An evening of song, dance and laughter',
      image: 'assets/event-2.jpg',
      scrim: '#6b2a10',                        // overlay tint that keeps text readable
      details: [
        { label: 'Date',  value: 'Monday · 18th January 2027' },
        { label: 'Time',  value: 'Evening' },
        { label: 'Venue', value: 'The Grand Shipra, Gorakhpur' }
      ]
    },
    {
      title: 'The Wedding',
      tagline: 'With blessings, rituals and a promise of forever',
      image: 'assets/event-4.jpg',
      scrim: '#3d0f14',
      details: [
        { label: 'Date',  value: 'Tuesday · 19th January 2027' },
        { label: 'Time',  value: 'Through the day' },
        { label: 'Venue', value: 'The Grand Shipra, Gorakhpur' }
      ]
    },
    {
      title: 'Jaimala',
      tagline: 'A beautiful evening as two hearts become one',
      image: 'assets/event-3.jpg',
      scrim: '#4a1c08',
      details: [
        { label: 'Date',  value: 'Tuesday · 19th January 2027' },
        { label: 'Time',  value: 'Evening' },
        { label: 'Venue', value: 'The Grand Shipra, Gorakhpur' }
      ]
    }
  ],

  /* ---- A warm note before the family section ---------------------------- */
  presence: {
    title: 'Awaiting Your Noble Presence',
    lines: ['Because celebrating with the people we love', 'is what makes it all worth it.']
  },

  /* ---- Families. Add groups when you have the names. -------------------- */
  families: {
    eyebrow: 'With the blessings of',
    title: 'The Families',
    note: 'Eagerly waiting for your presence',
    groups: []                      // e.g. [{ name: "The Sharma's", members: ['…'] }]
  },

  /* ---- Venue + map ------------------------------------------------------ */
  venue: {
    eyebrow: 'The venue',
    title: 'Where We Celebrate',
    name: 'The Grand Shipra',
    address: 'Near Bobina Hotel, Gorakhpur, Uttar Pradesh',
    mapQuery: 'The Grand Shipra, Near Bobina Hotel, Gorakhpur, Uttar Pradesh',
    mapEmbed: '',                   // optional: paste a full Google Maps embed URL
    buttonText: 'Get Directions'
  },

  /* ---- Footer ----------------------------------------------------------- */
  footer: {
    eyebrow: 'With love',
    date: '19 · 01 · 2027',
    note: 'Made with love for our favourite people'
  }
};
