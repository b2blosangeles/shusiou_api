var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var folder_base = '/mnt/shusiou-video/youtube/video/';

var CP = new pkg.crowdProcess();
var _f = {};
/*
_f['matrix_change0'] = function(cbk) {
//	var m = JSON.parse(CP.data.AF1.matrix), v = [];
	//--- Save adjusted matrix ---
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();	
	var vid = '2lHWSIbf6gg';
	var m = [];
	for (var j = 0; j < 30; j++) {
		m[j] = 0;
	}
	m[0] = 1; m[1] = 1; m[2] = 9; m[3] = 9; m[4] = 9;

				var str = 'UPDATE `video_queue` SET `matrix` = "' + JSON.stringify(m) + '" '+
				    'WHERE `source` = "youtube" AND `status` = 0 AND code = "' + vid + '"; ';

				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(m);
					}
				}); 	

};

_f['Q0'] = function(cbk) {
	cbk(1);
	CP.exit = 1;
};
*/
_f['Q1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `video_queue` WHERE `source` = "youtube" AND `status` = 0 ORDER BY `created` ASC LIMIT 100; ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			if (results.length) {
				cbk(results[0]);
				CP.skip = true;
			} else {
				cbk(false);
			}

		}
	});  
};

_f['Q2'] = function(cbk) {
	if (!CP.data.Q1 || !CP.data.Q1.source_code) {
		cbk(false);
		CP.exit = true;
	} else {
		cbk(CP.data.Q1.source_code);
	}
};



_f['Q3'] = function(cbk) {
	var url = CP.data.Q2, vid = CP.data.Q1.code, m = JSON.parse(CP.data.Q1.matrix), c_m = null;
	var step = 50000000;
	for (var i = 0; i < m.length; i++) {
		if (m[i] == 0) {
			c_m = i;
			break;
		}
	}
	var start = c_m * step;
	var end = (c_m + 1) * step - 1;	
	if (c_m !== null) {
		var folderP = require(env.space_path + '/api/inc/folderP/folderP');
		var fp = new folderP();
		fp.build(folder_base  + vid + '/tmp', function() {
			ytdl.getInfo(url, function(err) {
				if (err) {
					cbk({idx:c_m, status:9});
					return true;
				}
				var video = ytdl(url, {range: {start:start, end:end}, quality:'18'});


				video.pipe(pkg.fs.createWriteStream(folder_base + vid + '/tmp/' + c_m +'.mp4'));	
				video.on('data', function(info) {}); 

				video.on('end', function(info) {
					// cbk(url + '-**-' + folder_base  + vid + '/' + c_m + '.mp4');
					cbk({idx:c_m, status:1});
				});	

				video.on('error', function() {
					cbk({idx:c_m, status:9});
				});			
			});
		});
		
	} else {
		cbk(false);
	}
};

_f['Q4'] = function(cbk) {
	var m = JSON.parse(CP.data.Q1.matrix), vid = CP.data.Q1.code;
	m[CP.data.Q3.idx] = CP.data.Q3.status;
	
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'UPDATE `video_queue` SET `matrix` = "' + JSON.stringify(m) + '" '+
	    'WHERE `source` = "youtube" AND `status` = 0 AND code = "' + vid + '"; ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			cbk(m);
		}
	}); 	
	
};

_f['AF1'] = function(cbk) {
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();

	var str = 'SELECT * FROM  `video_queue` WHERE `source` = "youtube" AND `status` = 0 ORDER BY `created` ASC LIMIT 1; ';

	connection.query(str, function (error, results, fields) {
		connection.end();
		if (error) {
			cbk(error.message);
			return true;
		} else {
			if (results.length) {
				cbk(results[0]);
				CP.skip = true;
			} else {
				cbk(false);
			}

		}
	});  
};
function matrixAfter9(m, idx) {
	if (idx === 0 || idx === 1 ) return m;
	var v = [];
	if (m[idx-1] == 9 && m[idx-2] == 9) {
		for (var i = 0; i < idx-2; i++) {	
			v[v.length] = m[i];  
		}
		return v;
	}
	return m; 
}

_f['matrix_change'] = function(cbk) {
	var m = JSON.parse(CP.data.AF1.matrix), v = [];
	var vid = CP.data.AF1.code;

	/--- Save adjusted matrix ---*/
	var cfg0 = require(env.space_path + '/api/cfg/db.json');
	var connection = mysql.createConnection(cfg0);
	connection.connect();	
	for (var i = 0; i < m.length; i++) {
		if (m[i] == 9) {
			break;
		} else {
			v[v.length] = m[i];
		}
		
	}	
	cbk(v);
	CP.exit = true;
	return true;
				var str = 'UPDATE `video_queue` SET `matrix` = "' + JSON.stringify(m) + '" '+
				    'WHERE `source` = "youtube" AND `status` = 0 AND code = "' + vid + '"; ';

				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						
						return true;
					} else {
						cbk(m);
					}
				}); 	
	
				return true;	
	
	
	
	
	if (!CP.data.AF1 || !CP.data.AF1.source_code) {
		cbk(false);
		CP.exit = true;
	} else {
		var m = JSON.parse(CP.data.AF1.matrix), v = [];	
		
		for (var i = 0; i < m.length; i++) {
			if (m[i] == 9) {
			//	if (m[i+1] == 0 && m[i+2] == 0) {
					for (var j = i; j < m.length; j++) {
						m[j] = 0;
					}
			//	} 				
				var str = 'UPDATE `video_queue` SET `matrix` = "' + JSON.stringify(m) + '" '+
				    'WHERE `source` = "youtube" AND `status` = 0 AND code = "' + vid + '"; ';

				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error) {
						cbk(error.message);
						return true;
					} else {
						cbk(m);
					}
				}); 				
				return true;
			}
		}	
		
		cbk(m);
		CP.exit = true;
		for (var i = 0; i < m.length; i++) {
			if (m[i] == 9) {
				var v = matrixAfter9(m, i);
				if (v.length != m.length) {					
					/--- Save adjusted matrix ---*/
					var cfg0 = require(env.space_path + '/api/cfg/db.json');
					var connection = mysql.createConnection(cfg0);
					connection.connect();

					var str = 'UPDATE `video_queue` SET `matrix` = "' + JSON.stringify(v) + '" '+
					    'WHERE `source` = "youtube" AND `status` = 0 AND code = "' + CP.data.AF1.code + '"; ';

					connection.query(str, function (error, results, fields) {
						connection.end();
						if (error) {
							cbk(error.message);
							return true;
						} else {
							cbk(false);
						}
					}); 						
					return true;
				} else {
					cbk(false);
					return true;
				}
			} 
		}
	}
};
_f['Q0'] = function(cbk) {
	cbk(1);
	CP.exit = 1;
};

_f['AF2'] = function(cbk) {

	if (!CP.data.AF1 || !CP.data.AF1.source_code) {
		cbk(false);
		CP.exit = true;
	} else {
		var m = JSON.parse(CP.data.AF1.matrix);	
		for (var i = 0; i < m.length; i++) {
			if (m[i] == 0) {
				cbk(false);
				return true;
			}
		}			
		for (var i = 0; i < m.length; i++) {
			if (m[i] == 9) {
				var v = matrixAfter9(m, i);
				if (v.length != m.length) {					
					/--- Save adjusted matrix ---*/
					var cfg0 = require(env.space_path + '/api/cfg/db.json');
					var connection = mysql.createConnection(cfg0);
					connection.connect();

					var str = 'UPDATE `video_queue` SET `matrix` = "' + JSON.stringify(v) + '" '+
					    'WHERE `source` = "youtube" AND `status` = 0 AND code = "' + CP.data.AF1.code + '"; ';

					connection.query(str, function (error, results, fields) {
						connection.end();
						if (error) {
							cbk(error.message);
							return true;
						} else {
							cbk(false);
						}
					}); 						
					return true;
				} else {
					cbk(false);
					return true;
				}
			} 
		}
		
		cbk(CP.data.AF1.code);
	}
};
_f['AF3'] = function(cbk) {
	if (CP.data.AF2 === false) {
	 	cbk(false);
	} else {
		

		var cfg = require(env.space_path + '/api/cfg/db.json');
		cfg['multipleStatements'] = true;
		var connection = mysql.createConnection(cfg);
		connection.connect();
		
		var info = JSON.parse(decodeURIComponent(CP.data.AF1.info));
		var m = JSON.parse(decodeURIComponent(CP.data.AF1.matrix));
		var code = CP.data.AF1.code;
		
		var cmd_str = 'cd ' + folder_base + code + '/tmp && cat ';
		for (var i = 0; i < m.length; i++) {
			if (m[i] == 1) cmd_str += i + '.mp4 ';	
		}
		cmd_str += ' > '+ folder_base + code + '/video.mp4 && rm -fr ' + folder_base + code + '/tmp';
		
		var childProcess = require('child_process');
		var ls = childProcess.exec(cmd_str, 		   
			function (error, stdout, stderr) {
				if (error) cbk(false);
				else {
		
					var str = 'INSERT INTO videos (`source`, `code`, `title`, `length`, `size`) ' +
						'values ("youtube", "' + CP.data.AF2 + '", "' + info.title + '","' + info.length_seconds +  
						'", 0); ';
					 str += 'DELETE FROM video_queue WHERE `source` = "youtube" AND  `code` = "' + CP.data.AF2 + '"; ';
					connection.query(str, function (error, results, fields) {
						connection.end();
						if (error) {
							cbk(error.message);
							return true;
						} else {
							cbk(true);
						}
					}); 					
				}
			});		
		return true;	
	}
	
};


CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
