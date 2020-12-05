# Simple Chat using Node.js, Express, and WebSockets on Phusion Passenger
## Motivation
This is a simple chat app written to demonstrate using vanilla WebSockets in a Node.js app hosted by [Phusion Passenger](https://www.phusionpassenger.com/) (specifically on [DreamHost](https://www.dreamhost.com/)).

## Background
The code is heavily modified from an [example app](https://itnext.io/build-a-group-chat-app-in-30-lines-using-node-js-15bfe7a2417b) showing how to write a chat app using socket.io. The original code is available on [GitHub](https://github.com/dkhd/node-group-chat).

I wrote this to test using WebSockets hosted by [DreamHost Shared Hosting](https://www.dreamhost.com/hosting/shared/).

## Setup
This app should work when run either locally or when hosted by Phusion Passenger.

### Running Locally
#### Download and install NPM modules
```
git clone git@github.com:benjaminkraus/testPassengerWebSockets.git
cd testPassengerWebSockets
npm install
```
#### Create SSL certificates. Run the last three commands separately.
```
mkdir cert
cd cert
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
openssl rsa -in keytmp.pem -out key.pem
cd ..
```
#### Start the server
```
node app.js
```
#### Load the app
Load the app from [https://localhost:8080/](https://localhost:8080/).

### Hosting on DreamHost
#### Set-up Node.js on DreamHost
For instructions on configuring Node.js on DreamHost, you can visit these guides:
- [Node.js overview](https://help.dreamhost.com/hc/en-us/articles/217185397-Node-js-overview)
- [Enabling Passenger for Node.js](https://help.dreamhost.com/hc/en-us/articles/216635318-Enabling-Passenger-for-Node-js)
- [Troubleshooting Node.js](https://help.dreamhost.com/hc/en-us/articles/360043107192-Troubleshooting-Node-js)

#### Download and install NPM modules
Once Node.js is working, download and install the code.
```
git clone git@github.com:benjaminkraus/testPassengerWebSockets.git
cd testPassengerWebSockets
npm install
```
Move the code into the directory created by DreamHost for your app.

#### Copy SSL certificates
1. Visit the [DreamHost Panel SSL/TLS Certificates](https://panel.dreamhost.com/index.cgi?tree=domain.secure) page.
2. Select the domain you are using for WebSockets.
3. Copy the text from `Certificate` into a file named `cert.pem`.
4. Copy the text from `RSA Private Key` into a file named `key.pem`.
5. Place `cert.pem` and `key.pem` into a directory named `cert`.

#### Restart the server
```
touch tmp/restart.txt
```

### Optional Configuration
There are two configuration options that can be changed using a `.env` file. For example:
```
PORT=8080
WSPORT=8081
```
- `PORT` controls the port used for the HTTPS server. Default value `8080`, unless hosted by Phusion Passenger.
- `WSPORT` controls the port number used for the WebSockets server. Default value when hosted locally is the same as the `PORT` number. The default value when hosted by Phusion Passenger is `8080`.
- If hosted on Phusion Passenger, `PORT` is ignored and controlled by Phusion Passenger, and the WebSockets server is always hosted on a different port.
