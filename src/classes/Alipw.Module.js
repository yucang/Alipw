/**
 * @constructor Alipw.Module
 * @extends Alipw.Component
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 模块。模块是一个独立个体。它可以独立的调用一个远程页面，并在指定的位置进行渲染。同时，它还可以调用指定的JavaScript文件并在该模块的资源完全加载完毕后执行。模块还可对在其内部创建的可视控件进行资源管理，在自身被销毁时，通过该模块创建的可视控件也将被销毁。
 */

Alipw.Module = Alipw.extend(Alipw.Component,
/** @lends Alipw.Module.prototype */
{
	/**
	 * @property
	 * @type String
	 * @description [config option]定义模块的HTML模板。此配置仅当TemplateUrl未设置时有效。
	 * @default ''
	 */
	template:'',
	/**
	 * @property
	 * @type String
	 * @description [config option]定义模块的HTML模板的URL。当模块执行load方法时，会调取该URL的返回字符串作为该模块的HTML模板。
	 * @default ''
	 */
	templateUrl:'',
	/**
	 * @property
	 * @type Array
	 * @description [config option]定义模块模板加载完成之后执行的脚本。该数组的元素类型为Function，当模板加载完成后，会依次执行数组中的function，在这些function的执行过程中，this指针指向的对象对当前的module对象。
	 * @Default []
	 */
	scripts:null,
	/**
	 * @property
	 * @type Array
	 * @description [config option]定义模块模板加载完成之后执行的脚本文件url，可实现跨域调用。该数组的元素类型为String，当模板加载完成后，会依次加载数组中的URL作为脚本执行。在这些URL指向的文件中，需要使用Alipw.addModuleScript()方法写入脚本，以保证在调用的脚本中，this指向的对象为该module.
	 * @Default []
	 */
	scriptUrls:null,
	/**
	 * @property
	 * @type String
	 * @description [config option]定义模块处于正在加载的状态时，追加的class名称。
	 * @Default []
	 */
	loadingCls:'',
	commitProperties:function(){
		Alipw.Module.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.Module.superclass.initialize.apply(this,arguments);
		
		if(!this.scripts){
			this.scripts = new Array();
		}
		
		if(!this.scriptUrls){
			this.scriptUrls = new Array();
		}
		
		//module context
		this.context = new Object();
		
		//internal.components in this module.
		this.__componentMgr = new Object();
	},
	createDom:function(){
		Alipw.Module.superclass.createDom.apply(this,arguments);
	},
	renderComplete:function(){
		Alipw.Module.superclass.renderComplete.apply(this,arguments);
	},
	destroy:function(){
		var instance;
		for(var i in this.__componentMgr){
			instance = Alipw.getInstance(i);
			if(instance){
				instance.destroy();
			}
		}
		Alipw.Module.superclass.destroy.apply(this,arguments);
	},
	/**
	 * @public
	 * @description 向模块中增加一段脚本。
	 * @param {Function} fn 增加的脚本片段需要在function包中。
	 */
	addScript:function(fn){
		this.scripts.push(fn);
	},
	/**
	 * @public
	 * @description 加载。如果存在templateUrl,则开始调用远程HTML模板，否则，则使用template作为模板。之后开始调用scriptUrls中URL指向的javascript脚本文件，并在加载完成后依次执行。
	 * @param {Object} arg arg包含以下可设置属性：<ul><li>url : String  可选。模块HTML模板的URL。若为空，则调用模块的templateUrl。</li><li>method : String  调用方式。可选值有'POST','GET'。</li><li>params : Object  提交的参数。可选。</li></ul>
	 */
	load:function(arg){
		this.fireEvent('beforeModuleLoad',{},false);
		
		if(this.loadingCls)this.el.addClass(this.loadingCls);
		this.el.empty();
		for(var i=0,len=this.scripts.length;i<len;i++){
			if(this.scripts[i].__Alipw_needToReload){
				this.scripts.splice(i,1);
				len=this.scripts.length;
				i--;
			}
		}
		
		if(this.templateUrl){
			this.loadTemplate_Module(arg);
		}else{
			this.loadScripts_Module();
		}
	},
	/**
	 * @public
	 * @description 在该模块中创建Alipw.Component实例。使用此方法创建实例时，模块会对创建的实例进行管理，当该模块被销毁时，通过该方法所创建的实例也将被销毁。
	 * @param {Object(Constructor)} Alipw.Component或其子类。
	 * @param {Object} config 初始化实例时的配置对象。
	 */
	create:function(component,config){
		var comp;
		if(component){
			comp = new component(config);
			if(comp instanceof Alipw.Component || comp instanceof Alipw.Nonvisual){
				this.__componentMgr[comp.id] = true;
				
				comp.addEventListener('destroy',function(){
					this.__componentMgr[comp.id] = null;
				},this);
			}
		}
		
		return comp;
	},
	getInstance:function(type){
		var output = new Object();
		var instance;
		for(var i in this.__componentMgr){
			instance = Alipw.getInstance(i);
			if(!type && instance){
				output[i] = instance;
			}else if(type == 'module' && instance instanceof Alipw.Module){
				output[i] = instance;
			}else if(type == 'component' && instance instanceof Alipw.Component){
				output[i] = instance;
			}else if(type == 'nonvisual' && instance instanceof Alipw.Nonvisual){
				output[i] = instance;
			}
		}
		
		return output;
	},
	//private
	loadTemplate_Module:function(arg){
		var _this = this;
		if(!arg)arg = new Object();
		
		var url = arg.url || this.templateUrl;
		var method = arg.method || 'GET';
		var params = arg.params;
		
		jQuery.ajax({
			url:url,
			type:method,
			data:params,
			success:function(response){
				_this.template = response;
				_this.loadScripts_Module();
			}
		});
	},
	//private
	loadScripts_Module:function(){
		if(this.destroyed)return;
		
		var _this = this;
		
		var len = this.scriptUrls.length;
		var loadedNum = 0;
		
		var loadScript = function(){
			if(_this.destroyed)return;
			var scriptNode = Alipw.loadScript({
				url:_this.scriptUrls[loadedNum],
				success:function(){
					if(Alipw.Module.__moduleScriptFn instanceof Function){
						_this.addScript(Alipw.Module.__moduleScriptFn);
						Alipw.Module.__moduleScriptFn = null;
					}
					
					loadedNum++;
					if(loadedNum >= len){
						_this.renderContent_Module();
					}else{
						loadScript();
					}
				}
			});
			_this.addEventListener('destroy',function(){
				jQuery(scriptNode).remove();
			});
		};
		if(len > 0){
			loadScript();
		}else{
			this.renderContent_Module();
		}
	},
	//private
	renderContent_Module:function(){
		if(this.destroyed)return;
		if(this.loadingCls)this.el.removeClass(this.loadingCls);
		this.fireEvent('moduleLoaded', {}, false);
		
		if(this.template){
			this.el.append(jQuery(this.template));
		}
		for(var i=0,len=this.scripts.length;i<len;i++){
			if(this.destroyed)return;
			this.scripts[i].call(this);
		}
		
		this.fireEvent('moduleRendered', {}, false);
	}
});