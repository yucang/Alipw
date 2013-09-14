/** 
* @constructor 
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description 所有非可视类的基类。
*/
Alipw.Nonvisual = function(){
	var instanceStore = new Object();
	var autoIdCounter = 0;
	var getAutoId = function(){
		autoIdCounter++;
		return 'Alipw-nonvisual-' + autoIdCounter;
	};
	
	var pub = function(config){
		this.config = config || (new Object());
		this.commitProperties(config);
		//register instance to store
		instanceStore[this.id] = this;
		if(this.autoInit){
			this.initialize();
		}
	};
	
	//static method
	pub.getInstance = function(id){
		var instance = instanceStore[id];
		if(instance){
			return instance;
		}
		
		return null;
	};
	
	pub.prototype = 
	/**
	 * @lends Alipw.Nonvisual.prototype
	 */ 
	{
		/**
		 * @property
		 * @type Boolean
		 * @description [config]自动初始化。在实例化对象时自动初始化。
		 * @default true
		 */
		autoInit:true,
		/**
		 * @property
		 * @type Boolean
		 * @description 指示该对象是否已被初始化。
		 */
		initialized:false,
		/**
		 * @property
		 * @type Boolean
		 * @description 指示该对象当前是否可用。
		 */
		enabled:true,
		/**
		 * @property
		 * @type Object
		 * @default null
		 * @description [config option]定义事件监听。
		 */
		listeners:null,
		commitProperties:function(){
			Alipw.apply(this, this.config);
			if(!this.id){
				this.id = getAutoId();
			}
		},
		/**
		 * @public
		 * @description 对Nonvisual实例进行初始化
		 */
		initialize:function(){
			this.evtProxy = jQuery(new Object());
			this.initialized = true;
			
			if(this.listeners){
				for(var i in this.listeners){
					if(this.listeners[i] instanceof Function){
						this.addEventListener(i,this.listeners[i],this);
					}
				}
			}
		},
		/**
		 * @public
		 * @description 添加事件监听
		 * @param {String} type 事件类型。
		 * @param {Function} fn 监听函数。
		 * @param {Object} [scope] 作用域。指定监听函数fn中的this指针所指向的对象。默认为undefined。
		 */
		addEventListener:function(type, fn, scope){
			Alipw.EventManager.addListener(this,type,fn,scope,false);
		},
		/**
		 * @public
		 * @description 移除事件监听
		 * @param {String} type 事件类型。
		 * @param {Function} fn 监听函数。
		 */
		removeEventListener:function(type, fn){
			Alipw.EventManager.removeListener(this,type,fn,false);
		},
		/**
		 * @public
		 * @description 触发指定事件
		 * @param {String} type 事件类型。
		 * @param {Object} [params] 附带参数。
		 */
		fireEvent:function(type,params){
			return Alipw.EventManager.fireEvent(this,type,params,false,false);
		},
		regEvents:function(events){
			
		},
		update:function(){
			
		},
		/**
		 * @public
		 * @description 销毁对象，释放创建的资源与引用
		 */
		destroy:function(){
			if(this.destroyed)return;
			
			this.fireEvent("destroy");
			delete instanceStore[this.id];
			this.destroyed = true;
		},
		/**
		 * @public
		 * @description 启用
		 */
		enable:function(){
			this.enabled = true;
		},
		/**
		 * @public
		 * @description 禁用
		 */
		disable:function(){
			this.enabled = false;
		}
	};
	
	return pub;
}();