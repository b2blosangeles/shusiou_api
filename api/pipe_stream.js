var folder_base = '/mnt/shusiou-video/youtube/';
var fn =  folder_base + req.param('video') + '/' + req.param('fn');
pke.fs.stat(fn, function(err, data) {
    if (err) 
      res.send('it does not exist');
    else {
	var file = fs.createReadStream();
        file.pipe(res);
    }
  });
