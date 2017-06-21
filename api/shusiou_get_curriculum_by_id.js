var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var cfg0 = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);

var CP = new pkg.crowdProcess();
var _f = {};

_f['S1'] = function(cbk) {
	var str = 'SELECT * FROM  `curriculums` WHERE id = "' + req.body.cid + '"; ';
	connection.query(str, function (error, results, fields) {
		if (error) {
			cbk(error.message);
			return true;
		} else {
			cbk(results[0]);
		}
	});  
};
_f['S2'] = function(cbk) {
	if (!CP.data.S1.vid) {
		cbk({});
		return true;
	}
	var str = 'SELECT *  FROM  `videos` WHERE id = "' + CP.data.S1.vid + '"; ';
	cbk(str); return true;
	connection.query(str, function (error, results, fields) {
		
		if (error) {
			cbk(error.message);
			return true;
		} else {
			cbk(results[0]);
		}
	});  
};
connection.connect();
CP.serial(
	_f,
	function(data) {
		connection.end();
		res.send({_spent_time:data._spent_time, status:data.status, curriculum: data.results.S1, video:data.results.S2});
	},
	3000
);
