osc.io
===
an osc library for the web browser built on nodejs.

installation
---

    $ npm install osc.io

[example app](https://github.com/catshirt/osc.io/tree/master/example) contained for reference.

use
---
osc.io is a connect middleware. it requires a socket.io instance as it's first argument.

    var connect = require('connect'),
        socketio = require('socket.io'),
        osc = require('osc.io');

    var server = connect.createServer(),
        io = socketio.listen(server);

    server.use(osc(io));
    server.listen(9000);

the server above will create the following resources:

`WS /osc/servers` - a channel to create and listen to osc servers
`WS /osc/clients` - a channel to create and broadcast as an osc client

client library
---
a backbone client library is also provided. it creates two classes:

`OscServer` - this is a backbone model which listens for incoming OSC messages
`OscClient` - this is a backbone model capable of sending outgoing OSC messages

    <script src="/js/lib/jquery-1.7.1.js"></script>
    <script src="/js/lib/underscore-1.3.3.js"></script>
    <script src="/js/lib/backbone-0.9.2.js"></script>

    <script src="/socket.io/socket.io.js"></script>
    <script src="/osc.io/osc.io.js"></script>
    
    <script>

        var client = new OscClient(),
          server = new OscServer();

        server.on('osc', function(msg) {
          console.log(msg.path, msg.params);
        });

        setInterval(function() {
          client.trigger('osc', '/io/test', 20);
        }, 1000);

    </script>