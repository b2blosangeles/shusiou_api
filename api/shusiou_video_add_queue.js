var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');

var CP = new pkg.crowdProcess();
var _f = {};

var vurl = req.body.vurl || 'https://www.youtube.com/watch?v=IvbGKnYAxiE';
var vid = req.body.vid;

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
					cbk(results[0]);
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

/*
_f['S11'] = function(cbk) {
	if (!CP.data.S0) {
	  cbk(false);
	} else {
		
		var cfg0 = require(env.space_path + '/api/cfg/db.json');
		var connection = mysql.createConnection(cfg0);
		connection.connect();
		
		var str = "SELECT * FROM  `video_queue` WHERE `source` = 'youtube' AND  `source_code` = '" +  vurl + "'; ";
		
		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error) {
				cbk(error.message);
				return true;
			} else {
				cbk(results[0]);
				// cbk(true);
			}
		});    
	}
};
_f['S2'] = function(cbk) {
	if (!CP.data.S0) {
	  cbk(false);
	} else {
		var cfg = require(env.space_path + '/api/cfg/db.json');
		cfg['multipleStatements'] = true;
		var connection = mysql.createConnection(cfg);
		connection.connect();

		var str = 'TRUNCATE TABLE  `video_queue`; ';
		str += "INSERT INTO video_queue (`source`, `source_code`, `created`, `status`, `info`, `matrix`, `code`) " +
			"values ('youtube', '" + vurl + "', NOW(), 0 , '" + JSON.stringify(CP.data.S0) + "', '[]', '" + 
			CP.data.S0.vid + "'); ";
		
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
	}
};
*/
CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data});
	},
	30000
);
