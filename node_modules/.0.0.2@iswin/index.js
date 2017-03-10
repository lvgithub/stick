module.exports = function(){
	return (/win32|mswin(?!ce)|mingw|bccwin|cygwin/i).test(process.platform);
};
