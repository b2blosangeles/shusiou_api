var folder_base = '/mnt/shusiou-video/youtube/', fn =  folder_base + req.param('video') + '/' + req.param('fn');
pkg.fs.stat(fn, function(err, data) {
    if (err) 
      res.send('it does not exist');
    else {
	var file = fs.createReadStream(fn);
        file.pipe(res);
    }
  });
