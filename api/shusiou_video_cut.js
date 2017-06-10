var video = req.query['video'].split('|'), fn;

var folder_base = '/mnt/shusiou-video/youtube/';

var s_file = folder_base + 'video/' + video[0],  s =  video[1], l =  video[2];

// var fn = folder_base + 'cut/'  + video[0] '/' + s + '_' + l + '.mp4';

var childProcess = require('child_process');

var CP = new pkg.crowdProcess();
var _f = {};

_f['S0'] = function(cbk) {
	cbk(true);
};
_f['S1'] = function(cbk) {
	cbk(true);
}

CP.serial(
	_f,
	function(data) {
		res.send(data);
	},
	30000
);
