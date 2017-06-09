var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var folder_base = '/mnt/shusiou-video/youtube/';

var CP = new pkg.crowdProcess();
var _f = {};

var vid =  req.body.vid;
vid = 'emJlgM3DhnQ';

_f['D0'] = function(cbk) {
	cbk(111);
	return true;
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'DELETE FROM  `videos` WHERE `code` = "' + vid + '" ; ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			if (results.length) {
				cbk(results[0]);
			} else {
				cbk(false);
			}

		}
	});  
};

_f['D1'] = function(cbk) {
	cbk(2222);
	return true;	
	var cmd_str = 'rm -fr ' + folder_base + 'video/' +  vid + ' && rm -fr ' + folder_base + 'images/' +  vid;
	var ls = childProcess.exec(cmd_str, 		   
		function (error, stdout, stderr) {
			if (error) cbk(false);
			else cbk(true);
		});
};


CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
