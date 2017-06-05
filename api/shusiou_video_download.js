var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

var vurl = req.body.vurl || 'https://www.youtube.com/watch?v=IvbGKnYAxiE';
var vid = req.body.vid;

_f['Q'] = function(cbk) {
	if (!vid && !vurl) {
		cbk(false);
	} else {	
		var cfg0 = require(env.space_path + '/api/cfg/db.json');
		var connection = mysql.createConnection(cfg0);
		connection.connect();

		var str = "SELECT * FROM  `videos` WHERE `source` = 'youtube' AND  `code` = '" +  vid + "'; ";

		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error) {
				cbk(error.message);
				return true;
			} else {
				if (results[0]) {
					cbk(results[0]);
					CP.skip = true;
				} else {
					cbk(false);
				}

			}
		});  
	}
};

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
