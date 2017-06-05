var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

_f['Q0'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `video_queue` WHERE `source` = "youtube" AND `status` = 1 ORDER BY `created` ASC; ';

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
};


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
	if (!CP.data.Q1 || CP.data.Q1.source_code) {
		cbk(CP.data.Q1.source_code);
	} else {
		cbk(false);
	}
};
/*
	if (!sid && sid !==0) {
		cbk(false);
		CP.exit = 1;
	}
	var vid = CP.data.S0;
	if (!vid) {
		cbk(false);
		CP.exit = 1;
		return true;
	}
	var step = 50000000;
	var start = sid * step;
	var end = (sid + 1) * step -1;
	
 	var video = ytdl(vurl, {range: {start:start, end:end}, quality:'18'});	
	video.pipe(pkg.fs.createWriteStream(folder_base + vid + '/' + sid+'.mp4'));

	video.on('data', function(info) {}); 

	video.on('end', function(info) {
		cbk({sid:sid, value:1});
	});	

	video.on('error', function() {
		cbk({sid:sid, value:9});
	});

*/

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
