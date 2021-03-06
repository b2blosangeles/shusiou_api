var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

var vurl = req.body.vurl;
var vid = req.body.vid;
var thumbnail_url = req.body.thumbnail_url;

_f['Q'] = function(cbk) {
	if (!vid && !vurl) {
		cbk(false);
		CP.skip  = 1;
	} else {	
		var cfg0 = require(env.space_path + '/api/cfg/db.json');
		var connection = mysql.createConnection(cfg0);
		connection.connect();

		var str = "SELECT * FROM  `videos` WHERE `source` = 'youtube' AND  `code` = '" +  vid + "'; ";

		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error) {
				cbk(error.message);
				return true;
			} else {
				if (results[0]) {
					cbk(results[0]);
					CP.exit = 1;
				} else {
					cbk(false);
				}

			}
		});  
	}
};

_f['S0'] = function(cbk) {
	if (!vid && !vurl) {
		cbk(false);  
		CP.skip = true;
	} else {	
		var cfg0 = require(env.space_path + '/api/cfg/db.json');
		var connection = mysql.createConnection(cfg0);
		connection.connect();

		var str = "SELECT * FROM  `video_queue` WHERE `source` = 'youtube' AND " + 
		    " (`source_code` = '" +  vurl + "'  OR `code` = '" +  vid + "'); ";

		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error) {
				cbk(error.message);
				return true;
			} else {
				if (results[0]) {
					cbk( JSON.parse(decodeURIComponent(results[0].info)));
				} else {
					cbk(false);
				}

			}
		});  
	}
};

_f['S1'] = function(cbk) {
  if (!CP.data.S0 || !CP.data.S0.vid) {
	ytdl.getInfo(vurl, {},  function(err, info){
	  if (err) {  
		cbk(false);  
	  } else {
		cbk({vid:info.video_id, title:info.title, length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url});
	  }
	});	  
  } else {
	cbk(CP.data.S0);	    
  }
};



_f['S2'] = function(cbk) {
	if (!CP.data.S1 || !CP.data.S1.vid) {
	  cbk(false);
	} else {
		 if (!CP.data.S0 || !CP.data.S0.vid) {
			var cfg = require(env.space_path + '/api/cfg/db.json');
		//	cfg['multipleStatements'] = true;
			var connection = mysql.createConnection(cfg);
			connection.connect();
			
			var matrix = [];
			for (var j=0; j < 50; j++) {   matrix[ matrix .length] = 0; }
		//	var str = 'TRUNCATE TABLE  `video_queue`; ';
			var str = 'INSERT INTO video_queue (`source`, `source_code`, `thumbnail_url`, `created`, `status`, `info`, `matrix`, `code`) ' +
				'values ("youtube", "' + vurl + '", "' + thumbnail_url + '", NOW(), 0 , "' +  encodeURIComponent(JSON.stringify(CP.data.S1)) + 
				'", "' + JSON.stringify(matrix) + '", "' + CP.data.S1.vid + '"); ';

			connection.query(str, function (error, results, fields) {
				connection.end();
				if (error) {
					cbk(false);
					return true;
				} else {
					// cbk(results);
					cbk(true);
				}
			}); 
		 } else {
			cbk(2);
		}
	}
};
_f['S3'] = function(cbk) {
	if (!vid && !vurl) {
		cbk(false);
	} else {	
		var cfg0 = require(env.space_path + '/api/cfg/db.json');
		var connection = mysql.createConnection(cfg0);
		connection.connect();

		var str = "SELECT * FROM  `video_queue` WHERE `source` = 'youtube' AND " + 
		    " (`source_code` = '" +  vurl + "'  OR `code` = '" +  vid + "'); ";

		connection.query(str, function (error, results, fields) {
			connection.end();
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
	}
};

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
