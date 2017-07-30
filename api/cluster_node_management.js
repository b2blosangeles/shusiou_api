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
	var v = CP.data.Q0;
	var CP1 = new pkg.crowdProcess();
	var _f1 = {};	
	for (var i=0; i <v.length; i++) {
		_f1['S_'+i] = (function(i) {
			return function(cbk) {
				pkg.request({
					url: 'http://'+v[i]+'/checkip/',
					headers: {
					    "content-type": "application/json"
					}
				    }, function (error, resp, body) {
					cbk(body);
					}
				);	    
			}
		})(i);
	}
	CP1.serial(
		_f1,
		function(data) {
			res.send(data);	
		},
		60000
	);
};
CP.serial(
	_f,
	function(data) {
		res.send(data.results.Q0);	
	},
	60000
);

