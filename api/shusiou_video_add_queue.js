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
		cbk(info.video_id);
	  }
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
