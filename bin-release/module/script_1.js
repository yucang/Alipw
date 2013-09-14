Alipw.addModuleScript(function(){
	this.el.find('#action_btn').click(function(e){
		alert('action!!!');
	});
	
	this.context.testFn = function(){
		alert('this is a global function in the module');
	};
});