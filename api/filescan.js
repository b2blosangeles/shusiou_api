var total_size = 0;
var _result = [];
var master_video = {};
'/video/video.mp4'
function scan(dir, cbk) {
 //   var d = dir || process.argv[2] || '.';
    var d = dir || '.';
 
    var finder = require(env.space_path + '/api/inc/findit/findit.js')(d);
    var path = require('path');

    finder.on('directory', function (dir, stat, stop) {
        var base = path.basename(dir);
        total_size += stat.size;
    });
    finder.on('file', function (file, stat) {
       var ff =  ' bytes on both *nix and Windows systems. bytes on both *nix and Windows systems. bytes on both *nix and Windows systems.';
       total_size += stat.size;
       
       var filter = /(\/\.git\/|\/node\_modules\/)/;
       var filter_master = /\/video\/video\.mp4$/;
     
       if (filter_master.test(file)) {
          master_video = {folder:dir, path:file, mtime:stat.mtime, size:stat.size};
       }     
       if (!filter.test(file)) {
           var patt = new RegExp('^'+ dir);
           _result[_result.length] = {path:file.replace(patt,'--'), mtime:stat.mtime, size:stat.size};
       }
    });
    finder.on('link', function (link, stat) { });
    
    finder.on('end', function (link, stat) {
        if (typeof cbk == 'function') {
            cbk();
        }
    });


}


scan('/mnt/shusiou-video/youtube/962SfJ00tYM/', function() {
    master_video['totalsize'] = 'total size';
    res.send({master:master_video, list:_result});
});
