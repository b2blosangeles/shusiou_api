var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var cfg0 = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);
connection.connect();


var CP = new pkg.crowdProcess();

switch(req.body.cmd) {
    case 'login':
	var _f = {};
	_f['S1'] = function() {
		var str = 'SELECT FROM  `users` WHERE `email` = "' + req.body.email + '" AND `password`  = "' + req.body.password + '" ; ';
		connection.query(str, function (error, results, fields) {
			connection.end();
			if (!error) {
				res.send({status:true});
				return true;
			} else {
				res.send({status:false});
			}
		}); 		
	};
	_f['S2'] = function() {
		var str = 'INSERT INTO `sessions` (); ';
		connection.query(str, function (error, results, fields) {
			connection.end();
			if (!error) {
				res.send({status:true});
				return true;
			} else {
				res.send({status:false});
			}
		}); 		
	};		
		
        break;
    case 'registration':
        res.send(req.body);
        break;
    case 'logoff':
        res.send(req.body);
        break;		
    default:
        res.send('req.body');
}



return true;


var folder_base = '/mnt/shusiou-video/youtube/';

var CP = new pkg.crowdProcess();
var _f = {};

var vid =  req.body.vid;

_f['D0'] = function(cbk) {
	if (!vid) {
		cbk(false);
		CP.exit = true;
		return true;		
	}
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `videos` WHERE `code` = "' + vid + '" ; ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(false);
			CP.exit = true;
			return true;
		} else {
			if (!results.length) {
				cbk(false);
				CP.exit = true;
			} else {
				cbk(true);
			}
		}
	});  
};

_f['D1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'DELETE FROM  `videos` WHERE `code` = "' + vid + '" ; ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			cbk(true);
		}
	});  
};

_f['D2'] = function(cbk) {
	
	var childProcess = require('child_process');
	
	var cmd_str = 'rm -fr ' + folder_base +  vid;

	var ls = childProcess.exec(cmd_str, 		   
		function (error, stdout, stderr) {
			if (error) cbk(false);
			else cbk(true);
		});
};


CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
