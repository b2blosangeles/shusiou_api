var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var cfg0 = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);

var CP = new pkg.crowdProcess();
var _f = {};

_f['S1'] = function(cbk) {
	var str = 'DELETE FROM curriculums WHERE `id` = "' + req.body.cid + '"; ';
	
	connection.query(str, function (error, results, fields) {
		
		if (error) {
			cbk(error.message);
			return true;
		} else {
			if (results[0]) {
				cbk(results[0]);
				CP.skip = true;
			} else {
				cbk(false);
			}

		}
	});  
};
connection.connect();
CP.serial(
	_f,
	function(data) {
		connection.end();
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
