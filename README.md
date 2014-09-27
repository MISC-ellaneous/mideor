## MVP

* When I arrive at the site, and I do not have a midi device connected, I should get video instructions.
* When I return with a midi device, I should see a record button, followed by a stream of recent recordings.
* When I click record, and it records my midi input.
* When recording completes, it should be added to the stream.
* For each item in the stream, I should have a play button.

## Meteor-Boilerplate

http://matteodem.github.io/meteor-boilerplate/

## Tech Plan

* meteor.js for server
* Mongo for storage

## DB

* account
  * id
  * midi fingerprint
* sounds
  * id
  * account id
  * sound data

## Virtual MIDI device

* http://sourceforge.net/projects/vmpk/ works as a midi input device on OSX

## Testing MIDI input

* http://webaudiodemos.appspot.com/midi-synth/index.html

## Browser Support

This project is supported by Google Chrome, using its experimental Midi API.

* Enter "chrome://flags/" in URL bar in the browser window, find 
* "Enable Web MIDI API" 
* Select "Enable"

## Research

Can we uniquely fingerprint a midi device?

## Various

MIDI Key Codes and Notes
http://computermusicresource.com/midikeys.html

Frequencies and Notes
http://www.phy.mtu.edu/~suits/notefreqs.html

Catching Midi input in JS:
http://jsbin.com/wururi/1/

Midi input:
https://github.com/cwilso/WebMIDIAPIShim

Synthesizer:
https://github.com/clutterjoe/midi-synth

Midi Keyboard:
http://www.manyetas.com/creed/midikeys.html

Meteor scaffold and tutorials:
http://meteortips.com/book/
https://github.com/matteodem/meteor-boilerplate

MongoDB tutorials:
http://docs.mongodb.org/manual/core/crud-introduction/
