var osc = require('node-osc');

function parse_io_ns_option(ns) {
  return ns.match(/\/osc\/(.+)\/(.+)/)[2]
}

// create a new server by creating an io instance
// of namespace /osc/servers/:port
function server_channel_handler(socket) {
  var ns = socket.namespace.name,
    port = parse_io_ns_option(ns),
    osc_server = new osc.Server(port, '0.0.0.0');

  // proxy osc messages from udp to socket.io
  osc_server.on('message', function(msg) {
    socket.emit('message', msg);
  });
}

// create a new client by creating an io instance
// of namespace /osc/clients/:port
function client_channel_handler(socket) {
  var ns = socket.namespace.name,
    port = parse_io_ns_option(ns),
    osc_client = new osc.Client('127.0.0.1', port);

  // proxy osc messages from udp to socket.io
  // expects 'message' in form of [path, value]
  // ie. ['/osc/test', 200]
  socket.on('message', function(message) {
    osc_client.send(message[0], message[1]);
  });

  // expose a method to modify the client host. see readme.
  // at the moment, this just creates a whole new
  // client rather than configuring the host
  // of the existing client.
  socket.on('set-host', function(host) {
    osc_client = new osc.Client(host, port);
  });
}

// create socket.io namespaces
// to manage osc clients and servers
module.exports = function(io) {

  function ns(name, handler) {
    io.of(name).on('connection', handler);
  }

  for (var i = 6000; i < 12000; i++) {
    ns('/osc/servers/' + i, server_channel_handler);
    ns('/osc/clients/' + i, client_channel_handler);
  }

}