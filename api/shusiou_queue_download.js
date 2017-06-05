var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var folder_base = '/mnt/shusiou-video/youtube/';

var CP = new pkg.crowdProcess();
var _f = {};

_f['Q1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `video_queue` WHERE `source` = "youtube" AND `status` = 0 ORDER BY `created` ASC LIMIT 100; ';

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
		cbk(CP.data.Q1.source_code);
	}
};



_f['Q3'] = function(cbk) {
	var url = CP.data.Q2, vid = CP.data.Q1.code, m = JSON.parse(CP.data.Q1.matrix), c_m = null;
	var step = 50000000;
	for (var i = 0; i < m.length; i++) {
		if (m[i] == 0) {
			c_m = i;
			break;
		}
	}
	var start = c_m * step;
	var end = (c_m + 1) * step - 1;	
	if (c_m !== null) {
		var folderP = require(env.space_path + '/api/inc/folderP/folderP');
		var fp = new folderP();
		fp.build(folder_base  + vid, function() {
			ytdl.getInfo(url, function(err) {
				if (err) {
					cbk({idx:c_m, status:9});
					return true;
				}
				var video = ytdl(url, {range: {start:start, end:end}, quality:'18'});


				video.pipe(pkg.fs.createWriteStream(folder_base + vid + '/' + c_m +'.mp4'));	
				video.on('data', function(info) {}); 

				video.on('end', function(info) {
					// cbk(url + '-**-' + folder_base  + vid + '/' + c_m + '.mp4');
					cbk({idx:c_m, status:1});
				});	

				video.on('error', function() {
					cbk({idx:c_m, status:9});
				});			
			});
		});
		
	} else {
		cbk(false);
	}
};

_f['Q4'] = function(cbk) {
	var m = JSON.parse(CP.data.Q1.matrix), vid = CP.data.Q1.code;
	m[CP.data.Q3.idx] = CP.data.Q3.status;
	
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'UPDATE `video_queue` SET `matrix` = "' + JSON.stringify(m) + '" '+
	    'WHERE `source` = "youtube" AND `status` = 0 AND code = "' + vid + '"; ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			cbk(m);
		}
	}); 	
	
};

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);