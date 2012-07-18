var client = new OscClient(),
  server = new OscServer();

server.on('osc', function(msg) {
  console.log(msg.path, msg.params);
});

setInterval(function() {
  client.trigger('osc', '/io/test', 20);
}, 1000);