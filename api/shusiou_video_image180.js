var video = req.param('video').split('|'), fn;
var folder_base = '/mnt/shusiou-video/youtube/';

var vid = video[0]; s =  (!video[1])?0:video[1];

var file_video = folder_base + vid + '/video/video.mp4';
var folder_image = folder_base + vid + '/images/' +  vid;

fn = folder_image + '/180_' + s + '.png';
var CP = new pkg.crowdProcess();


var _f = {};
_f['S0'] = function(cbk) {
	pkg.fs.stat(file_video, function(err, stat) {
		 if(!err) {
			cbk(true);
		 } else {
			cbk(false);
			CP.exit = 1;
		}
	});	
};

_f['S1'] = function(cbk) {
	var folderP = require(env.space_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(folder_image, function() {
		cbk(true);
	});
};

_f['S2'] = function(cbk) {
	pkg.fs.stat(fn, function(err, stat) {
		 if(!err) {
			cbk(fn);
		 } else {
			var childProcess = require('child_process');
			var ls = childProcess.exec('ffmpeg -ss ' + s + ' -i ' + file_video + ' -vf scale=-1:180  -preset ultrafast ' +  fn +' -y ', 		   
				function (error, stdout, stderr) {
					cbk(true);
				});

		}
	});
};

CP.serial(
	_f,
	function(data) {	
		//	res.send(data);
		//	return true;		
		pkg.fs.stat(fn, function(err, data) {

		      if (err) {
			      res.send(fn + ' does not exist');
		      } else {
				var file = pkg.fs.createReadStream(fn);
				file.pipe(res);		      
			//	res.sendFile(fn);
			}
		});
	},
	6000
);
