var ytdl = require(env.space_path + '/api/inc/ytdl-core/node_modules/ytdl-core');
var folder_base = '/mnt/shusiou-video/youtube/';

var video_list_file = folder_base + 'video_list.data';

var CP = new pkg.crowdProcess();
var childProcess = require('child_process');
var _f = {};

var vurl = req.body.vurl;
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
	var folderP = require(env.space_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(folder_base + vid + '/', function() {
		cbk(vid);
	});	
};



_f['S2'] = function(cbk) {
	var vid = CP.data.S0, fn = folder_base + vid + '/matrix.data', v=[], str='cat ';
	pkg.fs.readFile(fn, {encoding: 'utf-8'}, function(err,data) {
          if(err) {
	     cbk('Wrong');
	  } else { 
		v = JSON.parse(data);
		// for (var i =0; i < Math.min(10, v.length); i++) {
		for (var i =0; i < v.length; i++) {
			if (v[i] == 1) {
				str += folder_base + vid + '/' +i+'.mp4  ';
			}
		}
		  str += ' > ' + folder_base + vid + '/N.mp4';

		//CP.exit = 1;
		 // return true;
		var ls = childProcess.exec(str, 		   
			function (error, stdout, stderr) {
				if (error) cbk(false);
				else cbk(true);
			});		  
			
          }
      });	
};

_f['S3'] = function(cbk) {
	if (!CP.data.S2) {
		cbk(CP.data.S2);
		CP.exit = 1;
		return true;
	}
	var vid = CP.data.S0, v={};
	pkg.fs.readFile(video_list_file, {encoding: 'utf-8'}, function(err,data) {
          if(err) {
	     cbk(v);
	  } else { 
		v = JSON.parse(data);
		v[vid] = true;  
		cbk(v);		  
			
          }
      });	
};

_f['S6'] = function(cbk) {
	var v = CP.data.S3;
	pkg.fs.writeFile(video_list_file, JSON.stringify(v), function (err) {
		if (err) 
		  	cbk(err.message);
		else  
		 	cbk(v);
	}); 	
}

CP.serial(
	_f,
	function(data) {
		res.send({_spent_time:data._spent_time, status:data.status, data:data.results});
	},
	30000
);
