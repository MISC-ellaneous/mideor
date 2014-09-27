Meteor.startup(function () {

  Mideor        = {};
  Mideor.MIDI   = false;
  Mideor.debug  = true;

  /**
   * Like console.log but it preppends "Mideor: "
   */
  Mideor.log = function() {
    if (!Mideor.debug) { return; }
    var args = Array.prototype.slice.call(arguments);
    args.unshift("Mideor" + ': ')
    // Console.log.apply has to be in the context of console.
    console.log.apply(console, args);
  }

  /**
   * Save incoming notes to the database.
   * @param  mid      the id of the Mid record to be updated.
   * @return function this matches the function sign of MIDI.onmidimessage
   *                  so that it is composable.
   */
  Mideor.saveNote = function(mid) {
    return function(message) {
      // Push events to database.
      var note = {
        keys: message.data,
        time: message.timeStamp
      }
      Mid.update(mid, {$push: {'notes': note}});

      // Make it composable with other midi message handlers.
      return message;
    }
  }

  /**
   * Plays a note from a MIDI event.
   * @return message so that this is composable.
   */
  Mideor.playNote = function(message) {
    var note = {
      keys: message.data,
      time: message.timeStamp
    }
    var letter = Mideor.keycodeToNoteLetter[note.keys[1]];
    Mideor.log(letter, note);


    // Make it composable with other midi message handlers.
    return message;
  }

  /**
   * Plays an Mid record.
   * @param record an Mid record.
   */
  Mideor.playMid = function(mid) {
    var sequence = new Sequence();
    sequence.loop = false;
    sequence.push(letter + ' q');
    sequence.play();
  }

  /**
   * Do a thing as many times as specified.
   * @param number   the number of times to do the thing.
   * @param Function the thing to do. Gets passed the nth time called.
   */
  Mideor.loop = function (times, fn) {
    var t = times;
    while (t) {
      fn((times - t) + 1);
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
