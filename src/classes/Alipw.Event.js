/** 
* @constructor
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description 事件对象。
* @demo http://aliyun-ued.com/alipw/samples/event.html
*/
Alipw.Event = function(){
	
	var pub = function(type,object,params,jQueryEvent){
		jQuery.extend(this,params);
		/**
		 * @memberOf Alipw.Event.prototype
		 * @property
		 * @type String
		 * @description 事件类型。
		 */
		this.type = type.replace(/alipw\-/g,'');
		/**
		 * @memberOf Alipw.Event.prototype
		 * @property
		 * @type Object
		 * @description 触发事件的当前对象。
		 */
		this.currentTarget = object;
		/**
		 * @memberOf Alipw.Event.prototype
		 * @property
		 * @type Object
		 * @description 触发事件的原始对象。
		 */
		this.target = object;
		this.jQueryEvent = jQueryEvent;
	};
	
	pub.prototype = 
	/** @lends Alipw.Event.prototype */
	{
		/**
		 * @public
		 * @description 阻止事件响应时浏览器将要发生的默认动作。
		 */
		preventDefault:function(){
			if(this.jQueryEvent){
				this.jQueryEvent.preventDefault();
			}
			this.isDefaultPrevented = true;
		},
		/**
		 * @public
		 * @description 阻止事件的冒泡传播。
		 */
		stopPropagation:function(){
			if(this.jQueryEvent){
				this.jQueryEvent.stopPropagation();
			}
		}
	};
	
	return pub;
}();