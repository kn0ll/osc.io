# osc.io

an osc library that allows reception and transmission of osc messages from the browser. it is a nodejs middleware which listens for midi input on and forwards the midi message to the client via socket.io.

## installation

    $ npm install osc.io  

## use

osc.io is responsible creatting http and websocket routes your client can use to send and receive osc messages from. a full [client and server example](https://github.com/catshirt/midi.io/tree/master/example) is contained in the repository for reference.

a basic osc.io server creates the following resources:

`WS /osc/servers` - a socket.io namespace to create and listen to osc servers
`WS /osc/clients` - a socket.io namespace to create and broadcast as an osc client

## getting started (server)

to enable osc.io, simply pass it into your http server as a middleware, with your socket.io instance as it's first argument. the following example is the complete code for a simple osc.io server:

```
var connect = require('connect'),
  socketio = require('socket.io'),
  osc = require('osc.io');

var server = connect.createServer(),
  io = socketio.listen(server);

server.use(osc(io));
server.listen(9000);
```

## getting started (client)

the osc.io client library is served via `/osc.io/osc.io.js` and requires backbone. it creates two backbone models- one used to send, and one used to receive osc messages.

- `OscServer` - a backbone model which listens for incoming OSC messages
- `OscClient` - a backbone model capable of sending outgoing OSC messages

the following code shows the client library in action. it creates an osc client, an osc server, and has them communicate directly. it's important to note in this example, the client and server connect to eachother. you can override the host and port, however.

```
var client = new OscClient(),
  server = new OscServer();

server.on('osc', function(msg) {
  console.log(msg.path, msg.params);
});

setInterval(function() {
  client.trigger('osc', '/io/test', 20);
}, 1000);
```

## building documentation

[formatted documentation](http://catshirt.github.com/osc.io) is available and can be built using groc:

    npm install -g groc
    groc lib/**/*.js src/**/*.js readme.md