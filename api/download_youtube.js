var ytdl = require(env.space_path + '/api/pkg/ytdl-core/node_modules/ytdl-core');
var folder_base = '/var/shusiou/videos/';

var CP = new pkg.crowdProcess();
var _f = {};

var sid = req.body.sid;
// var vurl = req.body.vurl || 'https://www.youtube.com/watch?v=Yq5v6QqruBA';

var vurl = req.body.vurl
 if (!vurl) {
 	res.send('Missing video url');
	return true;
 }
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
	fp.build(folder_base + vid + '', function() {
		cbk(folder_base + vid + '');
	});	
};
_f['S3'] = function(cbk) {
	
	if (!sid && sid !==0) {
		cbk(false);
		CP.exit = 1;
	}
	var vid = CP.data.S0;
	if (!vid) {
		cbk(false);
		CP.exit = 1;
		return true;
	}
	var step = 50000000;
	var start = sid * step;
	var end = (sid + 1) * step -1;
	
 	var video = ytdl(vurl, {range: {start:start, end:end}, quality:'18'});	
	video.pipe(pkg.fs.createWriteStream(folder_base + vid + '/' + sid+'.mp4'));

	video.on('data', function(info) {}); 

	video.on('end', function(info) {
		cbk({sid:sid, value:1});
	});	

	video.on('error', function() {
		cbk({sid:sid, value:9});
	});	


};

_f['S5'] = function(cbk) {
	var vid = CP.data.S0, fn = folder_base + vid + '/matrix.data', v=[];
	pkg.fs.readFile(fn, {encoding: 'utf-8'}, function(err,data) {
          if(err) {
             for (var i=0; i < 30; i++) { v[i] = 0; }
	     cbk(v);
	  } else { 
		try {  
			v = JSON.parse(data);
			cbk(v);
		} catch(e) {
			for (var i=0; i < 30; i++) { v[i] = 0; }
	    		cbk(v);
		}	
             }
      });	
};	

_f['S6'] = function(cbk) {
	var vid = CP.data.S0, fn = folder_base + vid + '/matrix.data', m = CP.data.S5;
	var mv = CP.data.S3;
	m[mv.sid] = mv.value;
	pkg.fs.writeFile(fn, JSON.stringify(m), function (err) {
		if (err) 
		  	cbk(err.message);
		else  
		 	cbk(m);
	}); 

};

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data.results.S6});
	},
	30000
);
