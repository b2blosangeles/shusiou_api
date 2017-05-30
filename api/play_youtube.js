var vid = req.param('vid');
var folder_base = '/var/shusiou/';
var fn =  folder_base + 'videos/' +  vid + '/N.mp4';
var fs = require('fs');

// fs.stat(fn, function(err, data) {

  //  if (err) 
 //     res.send('it does not exist');
//    else {
 //     var total = data.size;
	    var total = 1000000000;
      var range = req.headers.range;
    
	    
      if (range) {
   
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0]; var partialend;
        partialend =  parts[1];
      
        var start = parseInt(partialstart, 10);
//	      var start = 100000;
      var end = partialend ? parseInt(partialend, 10) : total-1;
   //  var end = partialend ? parseInt(partialend, 10) : 1024000;
	      
        var chunksize = (end-start)+1;   
     //   var file = fs.createWriteStream(folder_base + 'videos/' +  vid + '/'+start+'_'+end+'N.mp4');
	   //   createWriteStream(folder_base + vid + '/' + sid+'.mp4')
	
	      //'Connection':'keep-alive',
	/*==== OK ====	  
        res.writeHead(206, {
		'Connection':'keep-alive',
			    'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
			  'Accept-Ranges': 'bytes', 
			    'Content-Length': chunksize, 'Content-Type': 'video/mp4' 
			   });
	
	      
 var x = pkg.request('http://shusiou.com/api/play_vr.js?vid=TtrymitI_Cw')
    req.pipe(x)
    x.pipe(res)	      
	 ==== OK ====	*/  
	      
	      
	/*      
        res.writeHead(206, {
		'Connection':'keep-alive',
			    'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
			  'Accept-Ranges': 'bytes', 
			    'Content-Length': chunksize, 'Content-Type': 'video/mp4' 
			   });
	*/		   
	 var ytdl = require(env.space_path + '/api/pkg/ytdl-core/node_modules/ytdl-core');
	 /*     
        res.writeHead(206, {
		'Connection':'keep-alive',
			    'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
			  'Accept-Ranges': 'bytes', 
			    'Content-Length': chunksize, 'Content-Type': 'video/mp4' 
			   });
	*/
	      
 var x = pkg.request('https://www.youtube.com/watch?v=TtrymitI_Cw')
    req.pipe(x)
    x.pipe(res)	 	      
	      
	//	pkg.request('http://shusiou.com/api/play_vr.js?vid=TtrymitI_Cw').pipe(res);
		
	//      var ytdl = require(env.space_path + '/api/pkg/ytdl-core/node_modules/ytdl-core');
	// var video =  ytdl('https://www.youtube.com/watch?v=TtrymitI_Cw', {range: {start:start, end:end}, quality:'18'});
	//      var video =  ytdl('https://www.youtube.com/watch?v=TtrymitI_Cw', {quality:'18'});
		//	 video.pipe(res);
	
	      
/*	      
	//  file.pipe(res);
video.on('end', function(info) {
	video.pipe(res);
	});	      
video.on('error', function(info) {
//	video.pipe(res);
	});
video.on('data', function(info) {
	// video.pipe(res);
	});
*/	
     // 	video.pipe(res)
	//	res.send(video.pipe(res));	      
	      
       // file.pipe(res);
	
      } else {
        res.send('Need streaming player');
      }

 //   }
    
   
//  });

