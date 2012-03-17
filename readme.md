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
you can run socket.osc by itself to create a straight forward proxy. the argument order is `websocket port`, `inbound osc port, `outbound osc port`, `outbound osc host`.
	
    # forward all OSC messages sent to port 8000, to a websocket on port 8080
    $ socket.osc 8080 8000
    
    # do that, and also forward any OSC messages from the web client to another host on port 9000
    $ socket.osc 8080 8000 9000 '192.168.0.0'

library
---
socket.osc can also be included in your node applications. simply provide your socket.io instance and a listening port.

    var io = require('socket.io').listen(9000),
        osc = require('socket.osc');

    osc.listen(io, {
    	inbound_port: 8000
    });

api
---
your client should listen to `osc` messages emitted from socket.io.

    var socket = io.connect('http://localhost');
    socket.on('osc', function(msg) {
        console.log(msg.path, msg.params);
    });