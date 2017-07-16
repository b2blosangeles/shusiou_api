var vid = req.param('vid');
var folder_base = '/mnt/shusiou-video/youtube/';
var fn =  '/mnt/shusiou-video/youtube/962SfJ00tYM/images/962SfJ00tYM/180_11.png';

// var fn =  '/mnt/shusiou-video/youtube/962SfJ00tYM/video/video.mp4';
var fs = require('fs');

fs.stat(fn, function(err, data) {

    if (err) 
      res.send('it does not exist');
    else {
	    /*
      var total = data.size;
      var range = req.headers.range;
    
	    

        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0]; var partialend;
        partialend =  parts[1];
      
        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
    //   var end = partialend ? parseInt(partialend, 10) : 120098;
	      
        var chunksize = (end-start)+1;   
        var file = fs.createReadStream(fn, {start: start, end: end});
	
	 	  
        res.writeHead(206, {
		'Connection':'keep-alive',
			    'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
			  'Accept-Ranges': 'bytes', 
			    'Content-Length': chunksize, 'Content-Type': 'video/mp4' 
			   }); 
	*/	
	    var file = fs.createReadStream(fn);
        file.pipe(res);
	


    }
    
   
  });
