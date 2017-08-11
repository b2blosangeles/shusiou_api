var str = req.param('str'), lang = req.param('lang');
if (!str) {
	res.send('No string sent!');
	return false;
}
if (!lang) {
	res.send('No lang!');
	return false;
}

var sh = require(env.space_path + '/api/inc/shorthash/node_modules/shorthash');
var fn = '/var/vv/vr/icona/'+sh.unique(str+'_'+lang)+'.mp3';



 pkg.fs.stat(fn, function(err, data) {
     // if (err) {  
     if (true) { 	     
	var googleTTS = require(env.space_path + '/api/lang_space/inc/google-tts-api/node_modules/google-tts-api/');
	     res.send(fn);
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
	     res.sendFile(fn);
	     return true; 
    }	     
});
return true;



// 金正恩在办公室里弹钢琴A工作人员热血沸腾
// 'cmn-Hans-CN'
// https://cloud.google.com/speech/docs/languages
