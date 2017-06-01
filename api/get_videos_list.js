// var folder_base = '/var/shusiou/videos/';
var video_list_file = '/mnt/shusiou-video/youtube/video_list.data';

var CP = new pkg.crowdProcess();
var _f = {};

_f['S0'] = function(cbk) {
	var v = {};
	pkg.fs.readFile(video_list_file, {encoding: 'utf-8'}, function(err,data) {
          if(err) {
	     cbk(Object.keys(v));
	  } else { 
		v = JSON.parse(data);
		cbk(Object.keys(v))		  
			
          }
      });	
}

CP.serial(
	_f,
	function(data) {
		var v = data.results.S0;
		res.send(v);
	},
	3000
);
