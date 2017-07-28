var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

var code = req.query['vid'];

_f['Q0'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT A.*, B.* FROM  `videos` A, `video_node` B WHERE A.id = B.video_id AND A.`code` = "' + code + '"';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			cbk(results);
		}
	});  
};

CP.serial(
	_f,
	function(data) {	
		res.send({_spent_time:data._spent_time, status:data.status, data:data.results.Q0});
	},
	30000
);
video_node
