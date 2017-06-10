var video = req.query['video'].split('|'), fn;

var folder_base = '/mnt/shusiou-video/youtube/';

var s_file = folder_base + 'video/' + video[0],  s =  video[1], l =  video[2];

var fn = folder_base + 'cut/'  + video[0] '/' + s + '_' + l + '.mp4';

var childProcess = require('child_process');

var CP = new pkg.crowdProcess();
var _f = {};

_f['S0'] = function(cbk) {
	cbk(true);
};
_f['S1'] = function(cbk) {
	cbk(true);
}

CP.serial(
	_f,
	function(data) {
		res.send(data);
	},
	30000
);
return true;

var stream = function() {
	//res.send(fn+'=s==');
	//return true;
	pkg.fs.stat(fn, function(err, data) {
            if (err) 
              res.send('it does not exist');
            else {
		      var total = data.size;
		      var range = req.headers.range;
		      if (range) {
				var parts = range.replace(/bytes=/, "").split("-");
				var partialstart = parts[0]; var partialend;
				  partialend =  parts[1];
				var start = parseInt(partialstart, 10);
				var end = partialend ? parseInt(partialend, 10) : total-1;
				var chunksize = (end-start)+1;
				var file = pkg.fs.createReadStream(fn, {start:start, end:end});
			      
				res.writeHead(206, {'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
					'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
			       file.pipe(res);
			} else {
				res.send('Need streaming player');
			}
		}
	});
};

pkg.fs.stat(fn, function(err, stat) {
	// if(err == null) {
	//	stream();  -async 1 -strict -2
	// } else {  -vcodec copy -acodec copy
	/*
		var ls = pkg.spawn('ffmpeg', ['-i', s_file, '-ss', s,  '-to', l,  
					     '-c', 'copy',
					    //  '-c:v:1', 'copy',
					   //   '-c:v', 'libx264', 
					    //  '-preset', 'ultrafast', '-threads', '5',
					   //   '-acodec', 'copy', '-vcodec', 'libx264',
			//	'-vcodec','copy', 
			//	 '-acodec','copy', 
					  //    '-async', 1, 
					   //   '-strict', '-2',
					//       '-preset', 'ultrafast',
				fn, '-y']);	
		ls.stdout.on('data', (data) => {
			// console.log(`stdout: ${data}`);
		});

		ls.stderr.on('data', (data) => {
			// console.log(`stderr: ${data}`);
		});

		ls.on('close', (code) => {
			// console.log(`child process exited with code ${code}`);
			stream();  
		}); 	
	*/
//	res.send('ffmpeg  -i ' + s_file + ' -ss ' + s + ' -to ' + l + ' -c copy ' + fn +' -y ');
//	return true;
	
		var ls = childProcess.exec('ffmpeg  -i ' + s_file + ' -ss '+ s + ' -t ' + l + ' -c copy ' + fn +' -y ', 		   
			function (error, stdout, stderr) {
				stream();
			});
			
/*
		ls.on('close', (code) => {
		}); 
*/		
	//}
});
