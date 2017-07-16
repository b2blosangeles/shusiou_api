var vid = req.param('vid');
var folder_base = '/mnt/shusiou-video/youtube/';
//var fn =  '/mnt/shusiou-video/youtube/962SfJ00tYM/images/962SfJ00tYM/180_11.png';

var fn =  '/mnt/shusiou-video/youtube/962SfJ00tYM/video/video.mp4';
var fs = require('fs');

fs.stat(folder_base  + req.param('fn'), function(err, data) {
    if (err) 
      res.send('it does not exist');
    else {
	var file = fs.createReadStream(fn);
        file.pipe(res);
    }
  });
