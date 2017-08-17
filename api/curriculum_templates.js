var CP = new pkg.crowdProcess();
var _f = {};
		
pkg.fs.readdir(env.space_path + '/api/templates/', function(err, files) {
     for (var i in files)
     _f[files[i]] = function(cbk) {
          cbk(files[i])
     }
     CP.serial(
          _f,
          function(data) {
               res.send(data);
          },
          3000
     );     
     
});
return true;

pkg.fs.readFile(env.space_path + '/api/templates/tmp1', 'utf8', function(err, data) { 
    try {
        res.send(JSON.parse(data)); 
    } catch (err) {
        res.send(err.message);
    }
 });

