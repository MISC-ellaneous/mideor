Meteor.startup(function() {
  /**
   * Sets Mideor.MIDI to the Web MIDI API object if there is a MIDI device
   * detected otherwise false.
   *
   * Handles API change in Chrome 29.
   */
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
    }, function(err) {
      Mideor.log("MIDI Access Failure. Error code: " + err.code );
    });
});
