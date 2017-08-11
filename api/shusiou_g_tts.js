var str = req.param('str'), lang = req.param('lang'), folder_base = '/mnt/shusiou_tts/';

if (!str) {
	res.send('No string sent!');
	return false;
}
if (!lang) {
	res.send('No lang!');
	return false;
}

var sh = require(env.space_path + '/api/inc/shorthash/node_modules/shorthash');
var fn = folder_base + sh.unique(str+'_'+lang)+'.mp3';

var CP = new pkg.crowdProcess();

var _f = {};
_f['S1'] = function(cbk) {
	var folderP = require(env.space_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(folder_base, function() {
		cbk(true);
	});
};

CP.serial(
	_f,
	function(data) {		
		 pkg.fs.stat(fn, function(err, data) {
		     if (error) { 
			 res.send(error.message);
     			return true;
			     
			var googleTTS = require(env.space_path + '/api/inc/google-tts-api/node_modules/google-tts-api/');
			googleTTS(str, lang, 1)   // speed normal = 1 (default), slow = 0.24 
			.then(function (url) {
			   var fs = require('fs');
			   var text = 'Hello World';
			   var options = {
			      url: url,
			      headers: {
				 'Referer': 'http://translate.google.com/',
				 'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
			      }
			   }
			   var p = pkg.request(options);
			      p.pipe(fs.createWriteStream(fn));
			      p.pipe(res);
			})
			.catch(function (err) {
			   res.send(err.stack);
			});
		     } else { 
			     res.send('fn');
			     return true; 
		    }	     
		});
	},
	6000
);
