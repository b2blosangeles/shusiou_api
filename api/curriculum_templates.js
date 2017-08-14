var default = {
	lang:{mother:'en-US', learning:'zh-CN'},
	pro:[
		{text:'The next sentence is saying|The next paragraph is talking about', lang:'en-US'},
		{text:'{l}', lang:'en-US'},
		{text:'Listen', lang:'en-US'},
		{action:'play video'}, 
		{text:'Please repeat', lang:'en-US'}
	],					
	match:[
		{text:'Good Job|Nice|good|excellent', lang:'en-US'},
	],
	nomatch:[
		{text:'Incorrect, please try again|Wrong, repeat', lang:'en-US'},
		{action:'play video'}, 
		{text:'Please try again.', lang:'en-US'}					
	],
	done:{text:'Lets continue', lang:'en-US'}
};
res.send(default);
