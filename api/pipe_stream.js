var folder_base = '/mnt/shusiou-video/youtube/';
var fs = require('fs');
var url =  folder_base + req.param('video') + '/' + req.param('fn');
fs.stat(folder_base + req.param('video') + '/' + req.param('fn'), function(err, data) {
    if (err) 
      res.send('it does not exist');
    else {
	var file = fs.createReadStream(fn);
        file.pipe(res);
    }
  });
