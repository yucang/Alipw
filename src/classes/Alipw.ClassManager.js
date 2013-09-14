/**
 * @class
 * @type singleton
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 类管理器。用于管理类的加载及加载状态的监视，通常不需要直接使用。
 */
Alipw.ClassManager = function(){
	var classes = {
		'Alipw.ClassManager':'loaded',
		'Alipw.Component':'loaded',
		'Alipw.ComponentManager':'loaded',
		'Alipw.BoxComponent':'loaded',
		'Alipw.Shadow':'loaded',
		'Alipw.Container':'loaded',
		'Alipw.Nonvisual':'loaded',
		'Alipw.Template':'loaded',
		'Alipw.Module':'loaded',
		'Alipw.Event':'loaded',
		'Alipw.EventManager':'loaded',
		'Alipw.WinProxy':'loaded'
	};
	
	var classRequires = {
		'Alipw.Container':['Alipw.BoxComponent'],
		'Alipw.Panel':['Alipw.Container','Alipw.Button'],
		'Alipw.Window':['Alipw.ResizeSupporter','Alipw.DragSupporter','Alipw.Panel','Alipw.ScreenMask','Alipw.WindowManager','Alipw.AnimationProxy'],
		'Alipw.Taskbar':['Alipw.Window','Alipw.TaskbarItem'],
		'Alipw.Button':['Alipw.BoxComponent'],
		'Alipw.Msg':['Alipw.Window','Alipw.Template'],
		'Alipw.ScreenMask':['Alipw.FixedWrapper'],
		'Alipw.FixedWrapper':['Alipw.Container'],
		'Alipw.ResizeSupporter':['Alipw.BorderContainer'],
		'Alipw.BorderContainer':['Alipw.Container'],
		'Alipw.ColorPicker':['Alipw.BoxComponent'],
		'Alipw.Gallery':['Alipw.DataProxy'],
		'Alipw.Slider':['Alipw.Component'],
		'Alipw.Scrollbar':['Alipw.Slider'],
		'Alipw.ValidatorGroup':['Alipw.Validator'],
		'Alipw.List':['Alipw.BorderContainer','Alipw.ListItem','Alipw.DataStore'],
		'Alipw.ComboBox':['Alipw.BorderContainer','Alipw.List'],
		'Alipw.DatePicker':['Alipw.BorderContainer','Alipw.utils.Date'],
		'Alipw.ToolTip':['Alipw.BorderContainer']
	};
	
	var classRoot = Alipw.classPath;
	var createClassScript = function(cls){
		classes[cls] = "loading";
		
		Alipw.loadScript({
			url:classRoot + cls + '.js?v=' + Alipw.build,
			success:function(){
				classes[cls] = 'loaded';
				pub.classComplete(cls);
				if(pub.getStatus() == "complete"){
					pub.complete();
				}else{
					updateLoadingProcess();
				}
			}
		});
	};
	var updateLoadingProcess = function(){
		for(var i in classes){
			if(classes[i] == "pending"){
				createClassScript(i);
				return;
			}
		}
	};

	var pub = 
	/** @lends Alipw.ClassManager */
	{
		loadingAdapter:null,
		/**
		 * @public
		 * @description 获取当前类的加载状态。如果传入参数className值，则返回名为className的类的加载状态；若不传入，则返回全局加载状态。
		 * @param [className] 要返回加载状态类名，可选。若为空，则返回全局加载状态。
		 * @return {String} 全局状态返回'loading'或'complete'；单个类状态返回'pending','loading'或'loaded'.
		 */
		getStatus:function(className){
			if(Alipw.isSet(className)){
				return classes[className];
			}else{
				for(var i in classes){
					if(classes[i] != "loaded"){
						return "loading";
					}
				}
				return "complete";
			}
		},
		setStatus:function(className,status){
			classes[className] = status;
		},
		loadClass:function(){
			if(pub.loadingAdapter){
				pub.loadingAdapter.call(pub,arguments,classRequires);
				return;
			}
			var currentStatus = pub.getStatus();
			pub.addClass.apply(pub,arguments);
			if(currentStatus == "complete"){
				updateLoadingProcess();
			}
		},
		addClass:function(){
			var pendingClasses = arguments;
			for(var i=0,len=pendingClasses.length;i<len;i++){
				if(classes[pendingClasses[i]]){
					continue;
				}
				var requires = classRequires[pendingClasses[i]];
				if(requires instanceof Array){
					pub.addClass.apply(pub,requires);
				}
				
				classes[pendingClasses[i]] = "pending";
			}
		},
		classComplete:function(clsName){
			Alipw.Config.applySettings(clsName);
		},
		complete:function(){
			Alipw.classLoadedHandler();
		}
	};
	
	return pub;
}();


//loading adapter sample: tengine service on aliyun.com
/*
(function(){
	var server = function(){
		return '//static.aliyun.test';
	}();
	var classPath = 'js/lib/alipw/classes/';
	Alipw.ClassManager.loadingAdapter = function(classesToLoad,classRequires){
		var classQueue = new Array();
		queue.apply(null,classesToLoad);
		if(Alipw.ClassManager.getStatus() == "complete"){
			Alipw.ClassManager.complete();
		}else if(classQueue.length > 0){
			var url = server + '??';
			for(var i=0,len=classQueue.length;i<len;i++){
				url += classPath + classQueue[i] + '.js';
				if(i !== len - 1){
					url += ',';
				}
				//set class loading status
				Alipw.ClassManager.setStatus[classQueue[i],'loading'];
			}
			url += '?v=' + Alipw.build;
			Alipw.loadScript({
				url:url,
				success:function(){
					for(var i=0,len=classQueue.length;i<len;i++){
						//set class loaded status
						Alipw.ClassManager.setStatus(classQueue[i],'loaded');
						//load class complete interface
						Alipw.ClassManager.classComplete(classQueue[i]);
					}
					//load global complete interface
					if(Alipw.ClassManager.getStatus() == "complete"){
						Alipw.ClassManager.complete();
					}
				}
			});
		}
		
		function queue(){
			var pendingClasses = arguments;
			for(var i=0,len=pendingClasses.length;i<len;i++){
				if(Alipw.ClassManager.getStatus(pendingClasses[i])){
					continue;
				}
				var requires = classRequires[pendingClasses[i]];
				if(requires instanceof Array){
					queue.apply(null,requires);
				}
				
				//set class pending status
				Alipw.ClassManager.setStatus(pendingClasses[i],'pending');
				classQueue.push(pendingClasses[i]);
			}
		}
	};
		
})();
*/