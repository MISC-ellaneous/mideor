// Set a global MIDI variable
var MIDI = false;

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

    $('#record')
      .removeClass('red')
      .addClass('green');

    // Triggered for every midi input.
    MIDI.onmidimessage = function(message) {
      Mid.update(mid, {$push: {'notes': message}});
    }

    Meteor.setTimeout(function() {
      var mid = null;
      MIDI.onmidimessage = null;
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
      console.log(MIDI);
    }
    // If no device
    if (!MIDI) {
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
