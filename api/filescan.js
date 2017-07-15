var total_size = 0;
var _result = [];

function uu(dir, cbk) {
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
      // var filter = /(\/\.git\/)/;
       if (!filter.test(file)) {
           var patt = new RegExp('^'+ dir, 'i');
           _result[_result.length] = {path:file};
       }
    });

    finder.on('link', function (link, stat) {
     //  _result[_result.length] = {path:link};
    });
    
    finder.on('end', function (link, stat) {
        if (typeof cbk == 'function') {
            cbk();
        }
    });


}


uu('/mnt/shusiou-video/youtube/', function() {
// uu(env.root_path + '', function() {
    var str = 'total size:' + (total_size/1024/1024).toFixed(0) + ' MB (' + total_size + ')';
    // res.send(str);
    res.send(_result);
});
