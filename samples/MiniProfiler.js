var MiniProfiler = function(){
	var startTime;
	
	var pub = {
		startTimer:function(){
			startTime = new Date();
		},
		endTimer:function(){
			var endTime = new Date;
			alert((endTime - startTime) + ' ms');
		}
	};
	
	return pub;
}();