// Set a global MIDI variable
var MIDI = false;
var tinymusic = Npm.require('tinymusic');

// Save the MIDI notes to the database.
var saveNote = function(message) {
  // Push events to database.
  var note = {
    keys: message.data,
    time: message.timestamp
  }
  Mid.update(mid, {$push: {'notes': note}});

  // Make it composable with other midi message handlers.
  return message;
}

/**
 * Do a thing as many times as specified.
 */
function loop(times, fn) {
  var t = times;
  while (t) {
    fn(times - t);
    t--;
  }

}

/**
 * Programatically reconstruct this table
 * http://computermusicresource.com/midikeys.html
 *
 * @return Object Dictionary of keycodes and letter notes.
 */
keycodeNoteMap = function() {
  var enharmonics = [
    'C',
    'Db',
    'D',
    'Eb',
    'Fb',
    'F',
    'Gb',
    'G',
    'Ab',
    'A',
    'Bb',
    'Cb'
  ];
  var map = {};
  loop(11, function(i) {
    var octave = (-2) + i; // this gives us octaves -2 ... 8
    enharmonics.forEach(function (note) {
      var lastKeycode = Number(_.last(_.keys(map)))
      if (!lastKeycode && !(lastKeycode > -1)) { lastKeycode = -1; }
      map[lastKeycode + 1] = note + octave;
    });
  });
  return map;
}

var playNote = function(message) {
  var note = message.data;
  console.log(note);

  // Make it composable with other midi message handlers.
  return message;
}

/**
 * Template events should be defined here.
 *
 * Docs: http://docs.meteor.com/#template_events
 */
Template.home.events({

  /**
   * Recording
   *   * Determine end time.
   *   * Push midi events to a db record until end time condition is met.
   */
  'click #record': function(event) {
    var mid = Mid.insert({
      notes: [],
      createdAt: Date.now()
    });

    // Visually indicate recording.
    $('#record')
      .removeClass('red')
      .addClass('green');

    // Triggered for every midi input.

    MIDI.onmidimessage = _.compose(playNote, saveNote);
    Meteor.setTimeout(function() {
      var mid = null;
      MIDI.onmidimessage = playNote;
      $('#record')
        .removeClass('green')
        .addClass('red');
    }, 8000);


  }
});

/**
 * Initialize the template here.
 *
 * Docs: http://docs.meteor.com/#template_rendered
 */
Template.home.rendered = function() {
  navigator.requestMIDIAccess().then(function (m) {
    // Web MIDI API changed in Chrome 29 here's a catchall.
    // Chrome < 29:
    if (typeof m.inputs === 'function') {
      MIDI = m.inputs()[0];
    } else {
      // Chrome > 29:
      MIDI = m.inputs.values().next().value;
    }
    if (MIDI) {
      console.log(MIDI);

      MIDI.onmidimessage = playNote;

    } else {
      console.log('no midi device.');
      // so disable recording.
      $('#record')
        .attr('disabled', 'disabled')
        .addClass('disabled');
    }
  }, function(err) {
    // Log access failures
    console.log("MIDI Access Failure. Error code: " + err.code );
    // and disable recording.
    $('#record')
      .attr('disabled', 'disabled')
      .addClass('disabled');
  });

};
