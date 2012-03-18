var osc = (function() {

	var osc;

	var MicroEvent = function(){

	};

	MicroEvent.prototype = {
		on: function(event, fct) {
			this._events = this._events || {};
			this._events[event] = this._events[event] || [];
			this._events[event].push(fct);
		},
		removeListener: function(event, fct) {
			this._events = this._events || {};
			if(event in this._events === false) return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		emit: function(event){
			this._events = this._events || {};
			if(event in this._events === false) return;
			for(var i = 0; i < this._events[event].length; i++) {
				this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	};

	MicroEvent.mixin = function(destObject){
		var props = ['on', 'removeListener', 'emit'];
		for(var i = 0; i < props.length; i ++) {
			destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
		}
	}

	var UdpReceiver = function(port) {
		var _this = this,
			event_name = 'osc:inbound:' + port;
		osc.io.emit('osc:UdpReceiver', {
			port: port,
			event_name: event_name
		});
		osc.io.on(event_name, function(msg) {
			_this.emit(msg.path, msg);
		});
	};
	
	MicroEvent.mixin(UdpReceiver);

	var UdpSender = function(host, port) {
		var _this = this,
			event_name = 'osc:inbound:' + host + ':' + port;
		osc.io.emit('osc:UdpSender', {
			host: host,
			port: port,
			event_name: event_name
		});
		_this.emit = function(msg) {
			osc.io.emit(event_name, msg);
		};
	};

	UdpSender.prototype.send = function(path, typetag, params) {
		this.emit({
			path: path,
			typetag: typetag,
			params: params
		});
	};

	var Osc = function() {

	};

	Osc.prototype.connect = function(io) {
		this.io = io;
	};

	Osc.prototype.UdpReceiver = UdpReceiver;

	Osc.prototype.UdpSender = UdpSender;

	osc = new Osc();
	return osc;

})();