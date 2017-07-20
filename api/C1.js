var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

_f['Q0'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `videos` WHERE 1 ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			var data = [];
			for (var i = 0;i < results.length; i++) {
				data[data.length] = results[i].code;
			}
			cbk(data);
		}
	});  
};
_f['Q1'] = function(cbk) {
	var _f1 = {};
	var CP1 = new pkg.crowdProcess();
	for (var i=0; i< CP.data.Q0.length; i++) {
		_f1[i] = (function(i) { 
				return function(cbk) {
					var R = new FOLDER_SCAN();
					R.scan('/mnt/shusiou-video/youtube/' + CP.data.Q0[i]+ '/',  CP.data.Q0[i], 
					function(data) {
					    cbk(data);
					});
				}	
			})(i);	
	}
	CP1.serial(
		_f1,
		function(data1) {
			var v = {};
			for (o in data1.results) v[data1.results[o].master.code] = data1.results[o];
			cbk(v);
		},
		30000
	);	
};

CP.serial(
	_f,
	function(data) {
		res.send('v');	
	},
	60000
);

var FOLDER_SCAN = function () {
	var me = this;
	this.total_size = 0;
	this.master_video = {};
	this._result = {};
	this.lastupdate = 0;
	
	this.scan = function(dir, code, cbk) {
	    var finder = require(env.space_path + '/api/inc/findit/findit.js')(dir);
	    var path = require('path');

	    finder.on('directory', function (dir, stat, stop) {
		var base = path.basename(dir);
		me.total_size += stat.size;
	    });
	    finder.on('file', function (file, stat) {
	       var filter_master = /\/video\/video\.mp4$/;
		var patt = new RegExp('^'+ dir);
		var tm = new Date(stat.mtime).getTime();

	       if (filter_master.test(file)) {
		  me.master_video = {folder:dir, code: code, master_video:file.replace(patt,''), size:stat.size};
		  if (tm > me.lastupdate)  me.lastupdate = tm;
	       }  else {
		   me.total_size += stat.size;
		   me._result[file.replace(patt,'')] = stat.size;
		   if (tm > me.lastupdate)  me.lastupdate = tm;
	       }
	    });
	    finder.on('link', function (link, stat) { });

	    finder.on('end', function (link, stat) {

		if (typeof cbk == 'function') {
			me.master_video['totalsize'] = me.total_size;
			me.master_video['ip'] = req.body.ip;
			me.master_video['lastupdate'] = me.master_video.code + '##' + me.lastupdate;
			cbk({master:me.master_video, list:me._result});
		}
	    });


	};
};
