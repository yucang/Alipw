/**
 * @class
 * @type singleton
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 可视控件管理器。负责管理所有被创建的可视控件，对其ID，层级顺序以及生命周期中涉及的资源的创建和释放进行统一管理。
 */
Alipw.ComponentManager = function(){
	var cs = new Object(); // component storage
	var fs = new Array(); // floating component storage
	var is = new Array(); // auto ID component storage

	var pub = 
	/** @lends Alipw.ComponentManager */
	{
		/**
		 * @property
		 * @type Number
		 * @description 浮动Component的z-index的初始值
		 * */
		zseed:8000,
		
		/**
		 * @public
		 * @param {Alipw.Component} component 需要被注册的Alipw.Component实例
		 * @description 将制定component实例注册到管理器
		 * */
		register:function(component){
			if(component.floating && component.floatingManagement){
				fs.push(component);
				component.zIndex = this.zseed + fs.length * 5;
			}
			if(!component.id){
				is.push(component);
				component.id = "Alipw-comp-" + is.length;
			}
			cs[component.id] = component;
		},
		/**
		 * @public
		 * @param {Alipw.Component} component 需要被注销的Alipw.Component实例
		 * @description 将制定component实例从管理器注销
		 * */
		unregister:function(component){
			Alipw.removeItemFromArray(component, fs);
			this.updateZIndex();
			
			//don't change id stack.
			for(var i=0,len=is.length;i<len;i++){
				if(is[i] == component){
					delete is[i];
				}
			}
			
			delete cs[component.id];
		},
		/**
		 * @public
		 * @param {Integer} id component的id
		 * @description 通过id获取已创建的component实例。
		 * */
		getComponent:function(id){
			return cs[id];
		},
		/**
		 * @public
		 * @param {Alipw.Component} component component实例
		 * @description 将指定的component实例的显示层级顺序提到最前，此方法仅对floating属性和floatingManagement属性都为true的component实例有效。
		 * */
		bringToFront:function(component){
			if(component.floating && component.floatingManagement){
				Alipw.removeItemFromArray(component, fs);
				fs.push(component);
				this.updateZIndex();
			}
		},
		sendToBack:function(){
			
		},
		updateZIndex:function(){
			for(var i=0,len=fs.length;i<len;i++){
				fs[i].zIndex = this.zseed + (i + 1) * 5;
				if(fs[i].rendered){
					fs[i].setPosition(null,null,fs[i].zIndex);
				}
			}
		}
	};
	
	return pub;
}();