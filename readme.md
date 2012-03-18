socket.osc
===

intention
---
socket.osc allows you to communicate with other osc devices a server or client, from inside the browser via nodejs.

installation
---
install via npm. if you wish to use the standalone proxy, install with `-g`.

    $ npm install socket.osc

implementation
---
start by including the client library in your page, which will create a global `osc` object.

    <script src="/socket.io/socket.osc.js"></script>

connect your socket.io instance:

    var socket = io.connect('http://localhost'),
        osc_socket = osc.connect(io);

and create some sockets:

    // create a client which broadcasts osc messages
    var osc_client = new osc.UdpSender('192.168.10.10', 9999);
    osc_client.send('/key4', 'f', [2.0]);

    // create a server which listens for inbound messages
    var osc_server = new osc.UdpReceiver(8888);
    osc.on('/key2', function(msg) {
        console.log(msg);
    });

library
---
socket.osc can be included in your node applications. simply provide your socket.io instance.

    var io = require('socket.io').listen(9000),
        osc = require('socket.osc');
    osc.listen(io);

standalone
---
you can run socket.osc by itself to create a simple server proxy. for instance, to set up an osc websocket proxy on port 8080:

    $ socket.osc 8080