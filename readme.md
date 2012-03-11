socket.osc
===

intention
---
socket.osc is a library and stand alone node.js utility to forward OSC messages to the browser via socket.io.

installation
---
install via npm. if you wish to use the standalone proxy, install with `-g`.

    $ npm install socket.osc

standalone
---
you can run socket.osc by itself to create a straight forward proxy. the following will forward all OSC messages sent to port 9999, to a websocket on port 9000.

    $ socket.osc 9000 9999

library
---
socket.osc can also be included in your node applications. simply provide your socket.io instance and a listening port.

    var io = require('socket.io').listen(9000),
        osc = require('socket.osc');
    osc.listen(io, 9999);

api
---
your client should listen to `osc` messages emitted from socket.io.

    var socket = io.connect('http://localhost');
    socket.on('osc', function(msg) {
        console.log(msg.path, msg.params);
    });