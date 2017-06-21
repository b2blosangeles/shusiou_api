var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var CP = new pkg.crowdProcess();
var cfg0 = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);

switch(req.body.cmd) {
	case 'getCurriculumById':
		var _f = {};
		_f['S1'] = function(cbk) {
			if (!req.body.cid) {
				cbk({}); return true;
			}
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
		break;
	case 'getList':
		var _f = {};
		_f['S1'] = function(cbk) {
			var cfg0 = require(env.space_path + '/api/cfg/db.json');
			var connection = mysql.createConnection(cfg0);


			var str = 'SELECT A.*, B.code FROM  `curriculums` A LEFT JOIN `videos` B ON A.vid = B.id; ';

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
		break;	
	case 'update':
		var _f = {};

		_f['S1'] = function(cbk) {
			var str = 'UPDATE  `curriculums` SET ' +
			'`name` = "' + req.body.name + '",' +
			'`created` = NOW() ' +
			'WHERE `id` ="' + req.body.id + '"; ';

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
						cbk(results);
					} else {
						cbk(false);
					}

				}
			});  
		};
		_f['S2'] = function(cbk) {
			var str = 'SELECT LAST_INSERT_ID() AS ID; ';
			connection.query(str, function (error, results, fields) {

				if (error) {
					cbk(error.message);
					return true;
				} else {
					if (results[0]) {
						cbk(results[0]);
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
				res.send({_spent_time:data._spent_time, status:data.status, data:data.S2.ID});
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
