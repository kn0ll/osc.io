# osc.io

osc.io proxies osc messages from standard sockets to the browser using socket.io.

## installation

```
$ npm install osc.io
```

## configuration

to expose the proper endpoints from the server, you must pass your socket.io instance to osc.io.

```
var http = require('http'),
  socketio = require('socket.io'),
  osc = require('osc.io'),
  server = http.createServer(),
  io = socketio.listen(server);

osc(io);
server.listen(80);
```

this will create two socket.io namespaces, `/osc/servers/:port` and `/osc/clients/:port`, to manage osc servers and osc clients respectively. possible port values are restricted to `6000` to `12000`. each namespace can listen or emit `message` events to receive and send osc messages.

in the example below, we create an osc client/server in the browser and send messages from one to the other. of course, the client or server could be any osc device.

```
var server = io.connect('http://localhost/osc/servers/8000'),
  client = io.connect('http://localhost/osc/clients/8000');

server.on('message', function(message) {
  console.log(message);
});

setInterval(function() {
  client.emit('message', ['/osc/test', 200]);
}, 500);
```

by default, client devices broadcast to 127.0.0.1. to modify the host value of a client, your client must emit a message containing the host.

```
client.emit('set-host', DEVICE_IP);
```

## todo

- to enable multiple clients and servers, port must be passed in through the socket namespace to ensure each device has a unique client socket (socket.io creates only one socket per namespace). host cannot be passed in like port, since socket.io does not allow for variable namespace names. this makes creating a graceful connection api difficult. a proper api for managing device hosts and ports would be nice.

- with socket.io lacking variable namespaces, i decided to create hannel name handlers only for ports 6000 - 12000 because i am afraid to see what happens if i create 6*x,xxx* channels. ideally, i'd like to handle truly variable port values.