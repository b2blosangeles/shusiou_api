var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

_f['Q1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `video_queue` WHERE 1 ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			for (var i = 0; i < results.length; i++) {
				var matrix = JSON.parse(results[i].matrix);
				var matrix_success = 0;
				for (var j=0; j < matrix.length; j++) {
					if (parseInt(matrix[j]) == 1) matrix_success++;
				}
				var rate = Math.round(matrix_success * 1000 / matrix.length)
				results[i].perc = rate.toFixed(1);
			}
			cbk(results);
		}
	});  
};


CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data.results.Q1});
	},
	30000
);
