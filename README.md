# sympchair-js
A simple timer tool for the session chair

## Installation
* clone this repository
* run `npm install`
* start with `npm start`

## Usage
1. Prepare the display intended for the speaker (client):
 open the URL of the running app, then create a new session and open the client by clicking on the session id.

2. The session chair (admin) can administer the timer from the admin panel. It is reachable by clicking on the "admin" button of the corresponding session.

**NOTE**: this tool was designed to be run on an internal network during a symposium, therefore it does not have any authentication/authorization mechanisms. This means that anybody who knows the URL can use the admin panels!

(If You must run this on the same network as other people, use simple http auth to restrict access to the panels.)

## Development
* use `npm run dev`
