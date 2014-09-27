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
    // Create new record.
    var mid = Mid.insert({
      notes: [],
      createdAt: Date.now()
    });

    // Visually indicate recording.
    $('#record')
      .removeClass('red')
      .addClass('green');

    // Triggered for every midi input.
    Mideor.MIDI.onmidimessage = _.compose(Mideor.playNote, Mideor.saveNote(mid));
    Meteor.setTimeout(function() {
      var mid = null;
      Mideor.MIDI.onmidimessage = Mideor.playNote;
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
  if (!Mideor.MIDI) {
    $('#record')
      .attr('disabled', 'disabled')
      .addClass('disabled');
  }

};
