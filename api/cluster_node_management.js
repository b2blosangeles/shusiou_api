var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};
_f['Q0'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `cloud_node` WHERE  1; ';
	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			CP.exit = 1;
		} else {
			cbk(results);
		}
	});  
};
_f['Q1'] = function(cbk) {
	cbk(CP.data.Q0); 
};
CP.serial(
	_f,
	function(data) {
		res.send(data.results.Q0);	
	},
	60000
);

