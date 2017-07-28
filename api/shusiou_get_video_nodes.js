/* This API get video cache server */

var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

var code = req.body.code;

_f['Q0'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT A.*, B.* FROM  `videos` A, `video_node` B WHERE A.id = B.video_id AND A.`code` = "' + code + '"';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			// cbk(error.message);
			cbk(['api.shusiou.com']);
			return true;
		} else {
			var v = [];
			if ((results) && (results.length)) {
				v = results[0].nodes.split(',');  
			} 
			if (!v || !v.length) {
				v = ['api.shusiou.com'];
			}	
			cbk(v);
		}
	});  
};

CP.serial(
	_f,
	function(data) {	
		res.send(data.results.Q0);
	},
	30000
);
