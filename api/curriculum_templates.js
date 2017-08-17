pkg.fs.readFile(env.space_path + '/api/templates/tmp1', 'utf8', function(err, data) {
    res.send(err.message);  
//    res.send(JSON.parse(data));             
 });

