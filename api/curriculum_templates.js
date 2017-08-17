var CP = new pkg.crowdProcess();
var _f = {};
		
pkg.fs.readdir(env.space_path + '/api/templates/', function(err, files) {
     for (var i in files) {
     _f[files[i]] = (function(i) {
		return function(cbk) {
			pkg.fs.readFile(env.space_path + '/api/templates/'+files[i], 'utf8', function(err, data) { 
			    try {
				cbk(JSON.parse(data)); 
			    } catch (err) {
				cbk(false);
			    }
			 });
		}	
	})(i);	
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


