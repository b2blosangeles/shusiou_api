if (!req.query['video']) {
	res.send('Url error');
	return true;
}
var video = req.query['video'].split('|'), fn;

var folder_base = '/mnt/shusiou-video/youtube/';
var c_folder = folder_base + video[0] + '/cut/';



var s_file = folder_base + 'video/' + video[0],  s =  video[1], l =  video[2];


var fn = c_folder + s + '_' + l + '.mp4';

var childProcess = require('child_process');

var CP = new pkg.crowdProcess();
var _f = {};

_f['S0'] = function(cbk) {
	var folderP = require(env.space_path + '/api/inc/folderP/folderP');
	var fp = new folderP();
	fp.build(c_folder, function() {
		cbk(c_folder);	
	});
	
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
