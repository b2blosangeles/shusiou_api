var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var cfg0 = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);

var CP = new pkg.crowdProcess();
var _f = {};

_f['S1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);

	var str = 'SELECT A.*, B.id as video_id, ' +
	    ' B.title as video_title,  B.length as video_length, ' +
	    ' B.size as video_size ' +
	    ' FROM  `curriculums` A LEFT JOIN `videos` B ON A.vid = B.id AND A.id = "' + req.body.cid + '"; ';
	
	connection.query(str, function (error, results, fields) {
		
		if (error) {
			cbk(error.message);
			return true;
		} else {
			cbk(results);
		}
	});  
};
connection.connect();
CP.serial(
	_f,
	function(data) {
		connection.end();
		res.send({_spent_time:data._spent_time, status:data.status, data:data.results.S1});
	},
	3000
);
