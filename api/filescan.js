var total_size = 0, _result = [], master_video = {}, mtime = '', last_file = '';

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
       var filter = /(\/tmp\_section\/)/;
       var filter_master = /\/video\/video\.mp4$/;
        var patt = new RegExp('^'+ dir);
      
       if (filter_master.test(file)) {
          master_video = {folder:dir, master_video:file, mtime:stat.mtime, size:stat.size};
       }  else if (!filter.test(file)) {
           total_size += stat.size;
           if (!mtime) mtime = stat.mtime;
           if (new Date(stat.mtime) > new Date(mtime)) {
               mtime = stat.mtime;
               last_file = file.replace(patt,'');
           }
           _result[_result.length] = {path:file.replace(patt,''), mtime:stat.mtime, size:stat.size};
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
    master_video['totalsize'] = total_size;
    res.send({master:master_video, laster_file:{file:last_file, mtime:mtime}, list:_result});
});
