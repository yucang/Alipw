/** 
* @class
* @type singleton
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description 事件管理器。
*/
Alipw.EventManager = function(){
	var listenerProxyStore =  new Array();
	
	listenerProxyStore.getFnProxy = function(fn,object){
		for(var i=0,len=listenerProxyStore.length;i<len;i++){
			if(listenerProxyStore[i].fn == fn && listenerProxyStore[i].object == object){
				return listenerProxyStore[i].proxy;
			}
		}
		
		return null;
	};
	
	var pub = 
	/** @lends Alipw.EventManager */
	{
		/**
		 * @public
		 * @description 添加事件监听
		 * @param {Alipw.Component/Alipw.Nonvisual} object 需要监听的对象。
		 * @param {String} type 事件类型。
		 * @param {Function} fn 监听函数。
		 * @param {Object} [scope] 作用域。指定监听函数fn中的this指针所指向的对象。默认为undefined。
		 * @param {Boolean} [useBrowserEvent] 是否为浏览器事件。浏览器事件是指click, mouseover等浏览器自带事件。默认为false。
		 */
		addListener:function(object, type, fn, scope, useBrowserEvent){
			var el;
			if(object instanceof Alipw.Component){
				el = object.el;
			}else if(object instanceof Alipw.Nonvisual){
				el = object.evtProxy;
			}else{
				return;
			}
			
			if(!useBrowserEvent){
				type = "alipw-" + type;
			}
			
			if(useBrowserEvent && object instanceof Alipw.Component){
				el.bind(type,scope?jQuery.proxy(fn,scope):fn);
			}else{
				var fnProxy = listenerProxyStore.getFnProxy(fn,object);
				if(!fnProxy){
					fnProxy = function(jQueryEvent,event){
						event.currentTarget = object;
						event.jQueryEvent = jQueryEvent;
						//to cover the deprecated parameter 'eo' that was used in the past projects,
						//send double event object here.
						fn.call(this,event,event);
					};
					
					listenerProxyStore.push({
						proxy:fnProxy,
						fn:fn,
						object:object
					});
				}
				
				el.bind(type,scope?jQuery.proxy(fnProxy,scope):fnProxy);
			}
		},
		/**
		 * @public
		 * @description 移除事件监听
		 * @param {Alipw.Component/Alipw.Nonvisual} object 需要移除监听的对象。
		 * @param {String} type 事件类型。
		 * @param {Function} fn 监听函数。
		 * @param {Boolean} [useBrowserEvent] 是否为浏览器事件。浏览器事件是指click, mouseover等浏览器自带事件。默认为false。
		 */
		removeListener:function(object, type, fn, useBrowserEvent){
			var el;
			if(object instanceof Alipw.Component){
				el = object.el;
			}else if(object instanceof Alipw.Nonvisual){
				el = object.evtProxy;
			}else{
				return;
			}
			
			if(!useBrowserEvent){
				type = "alipw-" + type;
			}
			
			if(useBrowserEvent && object instanceof Alipw.Component){
				el.unbind(type,fn);
			}else{
				var fnProxy = listenerProxyStore.getFnProxy(fn,object);
				
				if(fnProxy){
					el.unbind(type,fnProxy);
				}
			}
		},
		/**
		 * @public
		 * @description 触发该component的指定事件
		 * @param {Alipw.Component/Alipw.Nonvisual} object 需要触发事件的对象。
		 * @param {String} type 事件类型。
		 * @param {Object} [params] 附带参数。
		 * @param {Boolean} [bubble] 是否冒泡,默认为true。
		 * @param {Boolean} [useBrowserEvent] 是否为浏览器事件。浏览器事件是指click, mouseover等浏览器自带事件。默认为false。
		 * @return {Boolean} 如果成功调度了事件，则值为 true。 值 false 表示失败或对事件调用了 preventDefault(). 仅当useBrowserEvent为false时有效。
		 */
		fireEvent:function(object, type, params, bubble, useBrowserEvent){
			var el;
			if(object instanceof Alipw.Component){
				el = object.el;
			}else if(object instanceof Alipw.Nonvisual){
				el = object.evtProxy;
			}else{
				return;
			}
			
			if(!useBrowserEvent){
				type = "alipw-" + type;
			}
			
			if(!Alipw.isSet(bubble)){
				bubble = true;
			}
			
			if(useBrowserEvent && object instanceof Alipw.Component){
				if(bubble){
					el.trigger(type,params);
				}else{
					el.triggerHandler(type,params);
				}
			}else{
				var event = new Alipw.Event(type,object,params);
				if(bubble){
					el.trigger(type,event);
				}else{
					el.triggerHandler(type,event);
				}
				return event.isDefaultPrevented?false:true;
			}
		},
		/**
		 * @public
		 * @description 开启对hashChange事件的监听
		 */
		enableHashChangeEvent:function(){
			var me = this;
			this.hashChangeManager = new Object();
			this.hashChangeManager.lastHash = Alipw.getHash();
			this.hashChangeManager.timer = setInterval(function(){
				var hash = Alipw.getHash();
				if(hash !== me.hashChangeManager.lastHash){
					var params = new Object();
					params.lastHash = me.hashChangeManager.lastHash;
					params.hash = hash;
					Alipw.getWinProxy().fireEvent("hashChange",params);
					me.hashChangeManager.lastHash = hash;
				}
			},100);
		}
	};
	
	return pub;
}();