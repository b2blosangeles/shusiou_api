pkg.fs.readFile(env.space_path + '/api/templates/tmp1', 'utf8', function(err, data) { 
    try {
        res.send(JSON.parse(data)); 
    } catch (err) {
        res.send(err.message);
    }
 });

