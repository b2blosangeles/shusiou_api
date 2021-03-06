var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

var cfg0 = require(env.space_path + '/api/cfg/db.json');
var connection = mysql.createConnection(cfg0);
connection.connect();

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


_f['S0'] = function(cbk) {
	var str = 'SELECT * FROM `videos` WHERE 1;';
	connection.query(str, function (error, results, fields) {	
		if (error) {
			cbk(error.message);
			return true;
		} else {
			var v = {};
			for (var i=0; i<results.length; i++) {
				v[results[i].id] = Math.round(results[i].size/1000000);
			}
			cbk(v);
		}
	});  
};
_f['S1'] = function(cbk) {
	var str = 'SELECT * FROM  `cloud_node` WHERE 1 ';
	connection.query(str, function (error, results, fields) {
		if (error) {
			cbk(error.message);
			return true;
		} else {
			var v = {};
			for (var i=0; i<results.length; i++) {
				v[results[i].node_ip] = results[i].total_space;
			}
			cbk(v);
		}
	});  
};

function sum(a, d) {
	var v = 0;
	for (var i=0; i < a.length; i++) {
		v += d[a[i]];	
	}
	return v;
}
function cap(v, idx, traffic) {
	var max = 2;
	if ((traffic) && (traffic[idx])) max = traffic[idx];
	if (v[idx].length >= max) {
		return true;	
	}
}
_f['Q1'] = function(cbk) {
	var S = {}, C = {}, T = {}, short_a = [], short_b = 0;
	
	for (var o in CP.data.S0) {
		var ex = false;
		if (!C[o]) C[o] = [];
		for (var p in CP.data.S1) {
			if (C[o].length) {
				ex = true;
				break;
			}	
			if (!S[p]) S[p] = [];
			if (sum(S[p], CP.data.S0) < (CP.data.S1[p] * 0.3)) {
				S[p][S[p].length] = o;
				C[o][C[o].length] = p;
				ex = true;;
				break;
			}
		}
		if (!ex) short_a[short_a.length] = o;
	}

	for (var o in CP.data.S0) {
		var ex = false;
		if (!C[o]) C[o] = [];
		
		for (var p in CP.data.S1) {
			if (!S[p]) S[p] = [];
			
			if (S[p].indexOf(o) == -1) {
				if (sum(S[p], CP.data.S0) < (CP.data.S1[p] * 0.3)) {
					if (cap(C,o, T)) {
						var ex = true;
						break;
					} else {
						S[p][S[p].length] = o;
						C[o][C[o].length] = p;
					}
				}
			}
			
		}
		if (!ex) short_b++;
	}
	var CP1 = new pkg.crowdProcess();
	var _f1 = {};
	
	for (var o in S) {
		_f1[o] = (function(o) {
			return function(cbk) {
				var str = 'UPDATE `cloud_node` SET `list` =  "' + S[o].join(',') + '" WHERE `node_ip` = "' + o + '" ';
				connection.query(str, function (error, results, fields) {
					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(S[o]);
					}
				});  
			}	
		})(o);
	}	
	for (var o in C) {
		_f1['video_'+o] = (function(o) {
			return function(cbk) {
				var str = 'INSERT INTO `video_node` (`video_id`,`nodes`) VALUES ("' + o + '","' + C[o].join(',') + '") '+
				'ON DUPLICATE KEY UPDATE `nodes` = "' +  C[o].join(',') + '"';

				connection.query(str, function (error, results, fields) {
					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(C[o]);
					}
				});  
			}	
		})(o);	
	}	
	CP1.serial(
		_f1,
		function(data) {
			// cbk({niu:'A001',S:S, C:C, short:{LV:short_a, L1:short_a.length,L2:short_b}});
			cbk(data);
		},
		10000
	);
	
};


_f['S3'] = function(cbk) {
	var str = 'SELECT * FROM  `video_node` WHERE 1 ';
	connection.query(str, function (error, results, fields) {
		if (error) {
			cbk(error.message);
			return true;
		} else {
			cbk(results);
		}
	});  
};

CP.serial(
	_f,
	function(data) {
		connection.end();
		res.send(data.results);	
	},
	10000
);
