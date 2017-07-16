pkg.fs.readdir('/mnt/shusiou-video/youtube/', function(err, files) {
    if (err) res.send(err.message);
    else res.send(files);
});
