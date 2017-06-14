var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var cfg0 = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);

var CP = new pkg.crowdProcess();
var _f = {};

_f['S1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	

	var str = 'SELECT * FROM  `curriculums` WHERE 1; ';
	
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
		res.send(data);
	},
	3000
);
