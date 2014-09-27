Meteor.startup(function () {

  // Trying to perserve the global namespace.
  Mideor = {};
  Mideor.MIDI = false;

  Mideor.debug = true;
  Mideor.log = function() {
    if (!Mideor.debug) { return; }
    var args = Array.prototype.slice.call(arguments);
    args.unshift("Mideor" + ': ')
    // Console.log.apply has to be in the context of console.
    console.log.apply(console, args);
  }

  // Get the midi device if we can.
  navigator.requestMIDIAccess()
    .then(function (m) {
      // Web MIDI API changed in Chrome 29 here's a catchall.
      // Chrome < 29:
      if (typeof m.inputs === 'function') {
        Mideor.MIDI = m.inputs()[0];
      } else {
        // Chrome > 29:
        Mideor.MIDI = m.inputs.values().next().value;
      }
      if (Mideor.MIDI) {
        Mideor.log(Mideor.MIDI);
        Mideor.MIDI.onmidimessage = Mideor.playNote;
      } else {
        Mideor.log('no midi device.');
      }
    });
    //.fail(function(err) {
    //  Mideor.log("MIDI Access Failure. Error code: " + err.code );
    //});


  // Save the MIDI notes to the database.
  Mideor.saveNote = function(message) {
    // Push events to database.
    var note = {
      keys: message.data,
      time: message.timestamp
    }
    Mid.update(mid, {$push: {'notes': note}});

    // Make it composable with other midi message handlers.
    return message;
  }

  // Save the MIDI notes to the database.
  Mideor.playNote = function(message) {
    var note = message.data;
    var letter = Mideor.keycodeToNoteLetter[note[1]];
    Mideor.log(letter, note);


    // Make it composable with other midi message handlers.
    return message;
  }

  Mideor.playMid = function(mid) {
    var sequence = new Sequence();
    sequence.loop = false;
    sequence.push(letter + ' q');
    sequence.play();
  }

  /**
   * Do a thing as many times as specified.
   */
  Mideor.loop = function (times, fn) {
    var t = times;
    while (t) {
      fn(times - t);
      t--;
    }
  }

  /**
   * Programatically reconstruct this table:
   * http://computermusicresource.com/midikeys.html
   *
   * @return Object Dictionary of keycodes and letter notes.
   */
  Mideor.keycodeToNoteLetter = (function() {
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
    Mideor.loop(11, function(i) {
      var octave = (-2) + i; // this gives us octaves -2 ... 8
      enharmonics.forEach(function (note) {
        var lastKeycode = Number(_.last(_.keys(map)))
        if (!lastKeycode && !(lastKeycode > -1)) { lastKeycode = -1; }
      map[lastKeycode + 1] = note + octave;
      });
    });
    return map;
  }());
});
