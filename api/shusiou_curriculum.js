var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var CP = new pkg.crowdProcess();
var cfg0 = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);

switch(req.body.cmd) {
	case 'add':
		var _f = {};

		_f['S1'] = function(cbk) {
			var str = 'INSERT INTO  curriculums (`uid`,`vid`,`name`,`mother_lang`,`learning_lang`,`created`) VALUES (' +
			'"' + req.body.uid + '",' +
			'"' + req.body.vid + '",' +
			'"' + req.body.name + '",' +
			'"' + '' + '",' +
			'"' + '' + '",' +
			'NOW()' +	
			'); ';

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
		break;
	case 'delete':
		var _f = {};

		_f['S1'] = function(cbk) {
			var str = 'DELETE FROM  curriculums WHERE `id` ="' + req.body.cid + '" AND `uid` = "' + req.body.uid + '"; ';
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
		break;		
	default:
		res.send({seatus:'error', message:'Missing or Wrong CMD!'});
}		