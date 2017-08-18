var CP = new pkg.crowdProcess();
var _f = {};
		
var mother = req.body.mother, learning = req.body.learning;

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
		var v = []; 
		for (var i in files) { 
			if (data.results[files[i]].script) {
				var vs =  data.results[files[i]].script;
				if ((vs.lang.mother == mother && vs.lang.learning1 == learning) ||(!mother && !learning)) {
					v[v.length] = data.results[files[i]];
				}	
			}	

		}
		res.send(v);
	  },
	  3000
     );     

});




