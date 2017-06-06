var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

_f['Q1'] = function(cbk) {
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
			if (results.length) {
				cbk(results);
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

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
