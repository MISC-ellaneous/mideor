## MVP

* When I arrive at the site, and I do not have a midi device connected, I should get video instructions.
* When I return with a midi device, I should see a record button, followed by a stream of recent recordings.
* When I click record, and it records my midi input.
* When recording completes, it should be added to the stream.
* For each item in the stream, I should have a play button.

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

## Research

Can we uniquely fingerprint a midi device?
