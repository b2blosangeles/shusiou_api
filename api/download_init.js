var ytdl = require(env.space_path + '/api/pkg/ytdl-core/node_modules/ytdl-core');
var folder_base = '/var/shusiou/videos/';

var CP = new pkg.crowdProcess();
var _f = {};

var vurl = req.body.vurl || 'https://www.youtube.com/watch?v=TtrymitI_Cw';

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

_f['S1'] = function(cbk) {
	var vid = CP.data.S0;
	if (!vid) {
		cbk(false);
		CP.exit = 1;
		return true;
	}	
	var folderP = require(env.space_path + '/api/lang_space/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(folder_base + vid + '/', function() {
		cbk(vid);
	});	
};
_f['S2'] = function(cbk) {
	var vid = CP.data.S0, fn = folder_base + vid + '/matrix.data', v=[];
        for (var i=0; i < 30; i++) { v[i] = 0; }
	pkg.fs.writeFile(fn, JSON.stringify(v), function (err) {
		if (err) 
		  	cbk(err.message);
		else  
		 	cbk(v);
	}); 
};	


CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data.results.S2});
	},
	30000
);
