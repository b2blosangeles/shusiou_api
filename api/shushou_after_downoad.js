var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var folder_base = '/mnt/shusiou-video/youtube/';

var CP = new pkg.crowdProcess();
var _f = {};


_f['Q1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `video_queue` WHERE `source` = "youtube" AND `status` = 0 ORDER BY `created` ASC LIMIT 1; ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			if (results.length) {
				cbk(results[0]);
				CP.skip = true;
			} else {
				cbk(false);
			}

		}
	});  
};

_f['Q2'] = function(cbk) {
	if (!CP.data.Q1 || !CP.data.Q1.source_code) {
		cbk(false);
		CP.exit = true;
	} else {
		var m = JSON.parse(CP.data.Q1.matrix);
		for (var i = 0; i < m.length; i++) {
			if (m[i] == 0) {
				cbk(false);
				break;
			}
		}
		cbk(CP.data.Q1.source_code);
	}
};
_f['Q3'] = function(cbk) {
	if (CP.data.Q2 === false) {
	 	cbk(false);
	} else {
		cbk(CP.data.Q2);
	}
	
};

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
