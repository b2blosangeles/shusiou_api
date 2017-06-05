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
_f['S0'] = function(cbk) {
  if (!CP.data.S1) {
	  cbk(false);
  } else {
	  cbk(CP.data.S1.vid);
	});	    
  }
};
CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data.results});
	},
	30000
);
