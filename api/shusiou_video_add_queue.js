var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');

var CP = new pkg.crowdProcess();
var _f = {};

var vurl = req.body.vurl || 'https://www.youtube.com/watch?v=IvbGKnYAxiE';

_f['S0'] = function(cbk) {
  if (req.body.vid) {
	cbk(req.body.vid);  
  } else {
	ytdl.getInfo(vurl, {},  function(err, info){
	  if (err) {  
		cbk(false);  
	  } else {
		cbk({vid:info.video_id, title:info.title, length_seconds:parseInt(info.length_seconds), thumbnail_url:info.thumbnail_url});
	  }
	});	    
  }
};
_f['S1'] = function(cbk) {
	if (!CP.data.S0) {
	  cbk(false);
	} else {
		var mysql = require(env.space_path + '/api/inc/mysql/node_modules/mysql');
		var cfg = require(env.space_path + '/api/cfg/db.json');
		cfg['multipleStatements'] = true;
		var connection = mysql.createConnection(cfg);
		connection.connect();

		var str = 'TRUNCATE TABLE  `video_queue`; ';
		str += 'INSERT INTO video_queue (`source`, `source_code`, `created`, `status`, `info`) '+
			'values ("youtube", "' + vurl + '", NOW(), 0 , "' + encodeURIComponent(JSON.stringify(CP.data.S0)) + '"); ';
		
		connection.query(str, function (error, results, fields) {
			connection.end();
			if (error) {
				cbk(error.message);
				return true;
			} else {
				cbk(results);
				// cbk(true);
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
