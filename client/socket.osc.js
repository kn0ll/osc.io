var osc = (function() {

	function osc() {
		this.debug = true;
	};

	osc.prototype.connect = function(io) {
		this.io = io;
	};

	osc.prototype.emit = function(path, typetag, params) {
		this.io.emit('osc', {
			path: path,
			typetag: typetag,
			params: params
		});
	};

	return new osc();

})();