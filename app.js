require('dotenv').config()
let httpport = process.env.PORT || 8080;
const wsport = process.env.WSPORT || httpport;

let usingPassenger = false;
if (typeof(PhusionPassenger) != 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
    usingPassenger = true;
    httpport = 'passenger';
}

let express = require('express');
let app = express();

const fs = require('fs');
const certificate = fs.readFileSync('./cert/cert.pem');
const privateKey  = fs.readFileSync('./cert/key.pem');
const https = require('https');

let expressServer = app;
if (!usingPassenger) {
    expressServer = https.createServer({
        cert: certificate,
        key: privateKey
    }, app);
}

const WebSocket = require("ws");
let wss;
let websocketServer;
if (httpport == wsport) {
    let expressWs = require('express-ws')(app, expressServer);
    wss = expressWs.getWss();
    app.ws('/', connection);
} else {
    websocketServer = https.createServer({
        cert: certificate,
        key: privateKey
    });

    wss = new WebSocket.Server({ server: websocketServer });
    wss.on('connection', connection);
}

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
    }
  });
}

function connection(ws) {
  ws.on("message", json => {
      var messageIn = JSON.parse(json);
      var messageOut;
      if (messageIn.username) {
          ws.username = messageIn.username;
          messageOut = {
              is_online: '🔵 <i>' + ws.username + ' join the chat..</i>'
          };
      }
      if (messageIn.chat_message) {
          messageOut = {
              chat_message: '<strong>' + ws.username + '</strong>: ' + messageIn.chat_message
          };
      }
      broadcast(messageOut)
  });

  ws.on("close", (code, reason) => {
      messageOut = {
          is_online: '🔴 <i>' + ws.username + ' left the chat..</i>'
      };
      broadcast(messageOut)
  });
}

app.get('/', function(req, res) {
    res.render('index.ejs', { protocol: 'wss', hostname: req.hostname, port: wsport });
});


expressServer.listen(httpport, () => {
    console.log('listening on (https) *:' + httpport);
});

if (websocketServer) {
    websocketServer.listen(wsport, () => {
        console.log('listening on (ws) *:' + wsport);
    });
}
