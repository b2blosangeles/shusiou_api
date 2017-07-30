var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
var cfg0 = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);
connection.connect();

var CP = new pkg.crowdProcess();
var _f = {};
_f['Q0'] = function(cbk) {
	var str = 'DELETE FROM `cloud_node` WHERE  `status` > "2"; ';
	connection.query(str, function (error, results, fields) {
		if (error) {
			cbk(error.message);
			CP.exit = 1;
		} else {
			cbk(results);
		}
	});  
};

_f['Q1'] = function(cbk) {
	var str = 'SELECT * FROM  `cloud_node` WHERE  1; ';
	connection.query(str, function (error, results, fields) {
		if (error) {
			cbk(error.message);
			CP.exit = 1;
		} else {
			cbk(results);
		}
	});  
};
_f['Q2'] = function(cbk) {
	var v = CP.data.Q1;
	var CP1 = new pkg.crowdProcess();
	var _f1 = {};	
	for (var i=0; i <v.length; i++) {
		_f1['S_'+i] = (function(i) {
			return function(cbk1) {
				var r = pkg.request({
					url: 'http://'+v[i].node_ip+'/checkip/',
					headers: {
					    "content-type": "application/json"
					},
					timeout: 2000
				    }, function (error, resp, body) {
					if (error) {
				cbk1('error.message==AA>'+i);
				return true;						
												
									
						var str = 'UPDATE `cloud_node` SET status = status + 1 WHERE  id = "' + v[i].id + '"; ';
						connection.query(str, function (error, results, fields) {
							if (error) {
								cbk1(error.message);
							} else {
								cbk1(false);
							}
						}); 						
					} else {								
						if  (v[i].status) {
							var str = 'UPDATE `cloud_node` SET status = 0 WHERE  id = "' + v[i].id + '"; ';
							connection.query(str, function (error, results, fields) {
								if (error) {
									cbk1(error.message);
								} else {
									cbk1(true);
								}
							});							
						} else {
							cbk1(true);
						}	
					}
				});	
			}
		})(i);
	}
	CP1.parallel(
		_f1,
		function(data) {
			cbk(data);	
		},
		30000
	);
};
CP.serial(
	_f,
	function(data) {
		connection.end();
		res.send(data);	
	},
	30000
);

