var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var CP = new pkg.crowdProcess();
var _f = {};

_f['S1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'INSERT INTO  curriculums (`uiv`,`vid`,`name`,`mother_lang`,`learning_lang`,`created`) VALUES (' +
	'"' + req.body.uid + '",' +
	'"' + req.body.vid + '",' +
	'"' + req.body.name + '",' +
	'"' + '' + '",' +
	'"' + '' + '",' +
	'NOW(),' +	
	+ '); ';
	
	cbk(str);
	return true;
	
	connection.query(str, function (error, results, fields) {
		connection.end();
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

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
