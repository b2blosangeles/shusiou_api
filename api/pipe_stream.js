var vid = req.param('vid');
var folder_base = '/mnt/shusiou-video/youtube/';
var fs = require('fs');

res.send(folder_base  + req.param('fn'));
return true;

fs.stat(folder_base  + req.param('fn'), function(err, data) {
    if (err) 
      res.send('it does not exist');
    else {
	var file = fs.createReadStream(fn);
        file.pipe(res);
    }
  });
