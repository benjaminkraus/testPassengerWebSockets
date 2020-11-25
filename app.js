require('dotenv').config()
const httpport = process.env.PORT || 8080;
const wsport = process.env.WSPORT || httpport;
let express = require('express');
let app = express();

const WebSocket = require("ws");
let wss;
if (httpport == wsport) {
    let expressWs = require('express-ws')(app);
    wss = expressWs.getWss();
    app.ws('/', connection);
} else {
    wss = new WebSocket.Server({ port: wsport });
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
    res.render('index.ejs', { hostname: req.hostname, port: wsport });
});

app.listen(httpport, function() {
    console.log('listening on (http) *:' + httpport);
    console.log('listening on (ws) *:' + wsport);
});
