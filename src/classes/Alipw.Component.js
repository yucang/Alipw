/** 
* @constructor 
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description Component类是所有可视控件类的基类。
*/
Alipw.Component = function(){
	
	var pub = function(config){
		this.config = config || (new Object());
		this.commitProperties();
		this.initialize();
		this.createDom();
		this._runAutoRender();
	};
	
	pub.prototype = 
	/**
	 * @lends Alipw.Component.prototype
	 */ 
	{
		/**
		 * @property 
		 * @type Boolean
		 * @description [config option]是否自动渲染。如果为true,则在实例初始化时自动渲染到renderTo属性指定的位置。
		 * @default true
		 */
		autoRender:true,
		/**
		 * @property 
		 * @type Boolean
		 * @description [config option]定义是否需要在可视条件下渲染。大部分可视控件需要在渲染到后，在可视条件下进行布局调整，但有时出于性能方面的考虑，需要在未渲染到页面中的HTML碎片中渲染，此时可将此配置设置为false。
		 * @default true
		 */
		visibleRender:true,
		/**
		 * @property
		 * @type Mixed HTML Element/selector
		 * @default null
		 * @description [config option]指定该component到哪个HTML节点中。其值可以是HTML元素，jQuery对象或jQuery选择器。当其值为jQuery对象或者jQuery选择器时，取第一个匹配的HTML节点。当其为null时，component会被渲染到body节点中。
		 */ 
		renderTo:null,
		/**
		 * @property
		 * @type String
		 * @default 'div'
		 * @description [config option]默认的HTML元素tag name。
		 */
		defaultEl:"div",
		/**
		 * @property
		 * @type String
		 * @default ''
		 * @description [config option]HTML元素的class名称的基本前缀。
		 */
		baseCls:"",
		/**
		 * @property
		 * @type String
		 * @default ''
		 * @description [config option]HTML元素的扩展子类追加的class名称。
		 */
		subCls:"",
		/**
		 * @property
		 * @type String
		 * @default ''
		 * @description [config option]HTML元素的class名称。
		 */
		cls:"",
		/**
		 * @property
		 * @type String
		 * @default ''
		 * @description [config option]鼠标经过时的HTML元素的class名称。
		 */
		overCls:'',
		/**
		 * @property
		 * @type String
		 * @default ''
		 * @description [config option]鼠标按下时的HTML元素的class名称。
		 */
		downCls:'',
		/**
		 * @property
		 * @type Boolean
		 * @default true
		 * @description [config option]是否可用。此属性在不同的子类中可能会有不同的作用。
		 */
		enabled:true,
		/**
		 * @property
		 * @type Boolean
		 * @default false
		 * @description 指示该Component是否已被销毁。
		 */
		destroyed:false,
		/**
		 * @property
		 * @type Boolean
		 * @default true
		 * @description 指示该Component当前是否可见。
		 */
		visible:true,
		/**
		 * @property
		 * @type Boolean
		 * @default false
		 * @description [config option]定义当前component是否为浮动的可视对象。
		 */
		floating:false,
		/**
		 * @property
		 * @type Boolean
		 * @default true
		 * @description [config option]定义当前component是否被浮动对象管理器所管理。此属性仅当floating属性值为true时才有效。
		 */
		floatingManagement:true,
		/**
		 * @property
		 * @type Boolean
		 * @default false
		 * @description [config option]定义当前component是否可被鼠标拖拽。
		 */
		draggable:false,
		/**
		 * @property
		 * @type String
		 * @default ''
		 * @description [config option]定义当前component的tooltip内容。若为空，则不显示tooltip。
		 */
		tooltip:"",
		/**
		 * @property
		 * @type String
		 * @default ''
		 * @description [config option]定义当前component的位置模式。可选值为'fixed'，'absolute',''。
		 */
		position:"",
		/**
		 * @property
		 * @type Object
		 * @default null
		 * @description [config option]定义当前component的HTML元素的style属性。
		 */
		inlineStyle:null,
		/**
		 * @property
		 * @type Object
		 * @default null
		 * @description [config option]定义事件监听。
		 */
		listeners:null,
		commitProperties:function(){
			Alipw.apply(this, this.config);
		},
		initialize:function(){
			Alipw.ComponentManager.register(this);
		},
		createDom:function(){
			/**
			 * @memberOf Alipw.Component.prototype
			 * @property
			 * @type JQuery Object
			 * @description 一个jQuery对象。其引用的HTML元素为当前component的HTML元素。
			 */
			this.el = $(document.createElement(this.defaultEl));
			this.el.attr('alipw_component','true');
			
			if(this.listeners){
				for(var i in this.listeners){
					if(this.listeners[i] instanceof Function){
						this.addEventListener(i,this.listeners[i],this);
					}
				}
			}
			
			this.el.attr("id", this.id);
			if(this.baseCls){
				this.el.attr("class", this.baseCls);
			}
			if(this.subCls){
				this.el.addClass(this.subCls);
			}
			if(this.cls){
				this.el.addClass(this.cls);
			}
			if(this.zIndex){
				this.el.css("z-index",this.zIndex);
			}
			if(this.position == "fixed"){
				if(parseInt(Alipw.ie()) == 6){
					this.el.css("position","absolute");
					this.x = this.getX() - jQuery(window).scrollLeft();
					this.y = this.getY() - jQuery(window).scrollTop();
					jQuery(window).bind("scroll",jQuery.proxy(this.scrollHandler_Component,this));
					this.addEventListener('destroy',function(e){
						jQuery(window).unbind('scroll',this.scrollHandler_Component);
					},this);
				}else{
					this.el.css("position","fixed");
				}
			}
			
			if(this.inlineStyle){
				this.el.css(this.inlineStyle);
			}
		},
		/**
		 * @public
		 * @description 将该component渲染到指定的HTML节点中。
		 * @param {Mix HTML Element/selector} con 该component要渲染到的HTML节点。如con为空，则渲染到renderTo指定的节点中。如renderTo属性为空，则渲染到body节点中。
		 */
		render:function(con){
			if(!con){
				if(this.renderTo){
					con = this.renderTo;
				}else{
					con = document.body;
				}
			}
			
			this.fireEvent('beforeRender',{},false);
			if(con instanceof Alipw.Container){
				//the appended component will call doLayout method and that will make the parent container update the layout. so here we don't make it update layout.
				con.appendChild(this,false);
			}else{
				con = Alipw.convertEl(con);
				con.append(this.el);
			}
			this.removed = false;
			this.fireEvent('afterRender',{},false);
			
			if(!this.rendered){
				this.renderComplete();
				
				this.rendered = true;
				this.creationCompleteFn_Component();
				this.fireEvent("creationComplete",{},false);
			}
		},
		renderComplete:function(isUpdating){
			this.addEventListener('afterLayout',this.afterLayoutHandler_Component,this);
			
			if(this.visibleRender && this.el.is(':hidden')){
				var tempWrapper = jQuery('<div style="position:absolute; left:-99999px; top:-99999px;"></div>');
				var nextSibling = this.el.next();
				var parent = this.el.parent();
				jQuery(document.body).append(tempWrapper);
				tempWrapper.append(this.el);
				
				this.doLayout();
				
				if(nextSibling[0]){
					this.el.insertBefore(nextSibling);
				}else{
					parent.append(this.el);
				}
				tempWrapper.remove();
			}else{
				this.doLayout();
			}

			//common interface to do more action after the dom element is rendered
			
			if(this.overCls){
				this.addEventListener('mouseover',this.mouseOverHandlerForOverCls_Component,this,true);
				this.addEventListener('mouseout',this.mouseOutHandlerForOverCls_Component,this,true);
			}
			
			if(this.downCls){
				var mouseUpHandler = Alipw.createFuncProxy(this.mouseUpHandlerForDownCls_Component,this);
				
				this.addEventListener('mousedown',this.mouseDownHandlerForDownCls_Component,this,true);
				jQuery(document).bind('mouseup',mouseUpHandler);
				
				this.addEventListener('destroy',function(e){
					jQuery(document).unbind('mouseup',mouseUpHandler);
				},this);
			}
		},
		/**
		 * @public
		 * @description 为该component添加事件监听
		 * @param {String} type 事件类型。
		 * @param {Function} fn 监听函数。
		 * @param {Object} [scope] 作用域。指定监听函数fn中的this指针所指向的对象。默认为undefined。
		 * @param {Boolean} [useBrowserEvent] 是否为浏览器事件。浏览器事件是指click, mouseover等浏览器自带事件。默认为false。
		 */
		addEventListener:function(type, fn, scope, useBrowserEvent){
			Alipw.EventManager.addListener(this,type,fn,scope,useBrowserEvent);
		},
		/**
		 * @public
		 * @description 为该component移除事件监听
		 * @param {String} type 事件类型。
		 * @param {Function} fn 监听函数。
		 * @param {Boolean} [useBrowserEvent] 是否为浏览器事件。浏览器事件是指click, mouseover等浏览器自带事件。默认为false。
		 */
		removeEventListener:function(type, fn, useBrowserEvent){
			Alipw.EventManager.removeListener(this,type,fn,useBrowserEvent);
		},
		/**
		 * @public
		 * @description 触发该component的指定事件
		 * @param {String} type 事件类型。
		 * @param {Object} [params] 附带参数。
		 * @param {Boolean} [bubble] 是否冒泡,默认为true。
		 * @param {Boolean} [useBrowserEvent] 是否为浏览器事件。浏览器事件是指click, mouseover等浏览器自带事件。默认为false。
		 */
		fireEvent:function(type,params,bubble, useBrowserEvent){
			if(this.destroyed)return false;
			return Alipw.EventManager.fireEvent(this,type,params,bubble,useBrowserEvent);
		},
		regEvents:function(events){
			for(var i=0,len=events.length;i<len;i++){
				Rainy.EventManager.register(events[i]);
			}
		},
		update:function(){
			this.renderComplete(true);
		},
		show:function(){
			if(!this.rendered){
				this.render();
			}
			this.setVisible(true);
		},
		hide:function(){
			this.setVisible(false);
		},
		/**
		 * @public
		 */
		remove:function(removeEventListeners){
			if(this.destroyed)return;
			
			this.fireEvent('beforeRemove',{},false);
			if(removeEventListeners){
				this.el.remove();
			}else{
				this.el.detach();
			}
			this.removed = true;
			this.fireEvent('afterRemove',{},false);
		},
		/**
		 * @public
		 * @description 销毁component。将该component的HTML元素从页面中移除，并释放监听的事件，同时也释放对HTML元素的引用。
		 */
		destroy:function(){
			if(this.destroyed)return;
			
			var result = this.fireEvent("destroy",{},false);
			if(result === false){
				return;
			}
			
			//destroy child alipw components
			this.el.find('*[alipw_component=true]').each(function(i,el){
				var component = Alipw.getComp(el.id);
				if(component){
					component.destroy();
				}
			});
			
			this.remove(true);
			if(this.parentContainer)this.parentContainer = null;// release the parentContainer reference to avoid circular reference
			Alipw.ComponentManager.unregister(this);
			this.el = null;
			this.destroyed = true;
		},
		/**
		 * @public
		 * @description 设置component是否可见。
		 * @param {Boolean} visible 是否可见。
		 * @param {Boolean} [includeInLayout] 是否占位。默认与visible相同。
		 * @param {Boolean} [silent] 是否无声。如为true,则当可见属性改变时，不触发visibilityChange事件。默认为false.
		 */
		setVisible:function(visible,includeInLayout,silent){
			if(this.destroyed)return;
			
			if(!Alipw.isSet(includeInLayout)){
				includeInLayout = visible;
			}
			
			if(visible){
				this.el.show();
				this.el.css("visibility","visible");
			}else{
				this.el.hide();
				if(includeInLayout){
					this.el.show();
					this.el.css({
						visibility:"hidden"
					});
				}else{
					this.el.hide();
					this.el.css({
						visibility:"hidden"
					});
				}
			}
			
			var lastVisible = this.visible;
			this.visible = visible;
			
			if(lastVisible != visible && !silent){
				this.fireEvent("visibilityChange",{},false);
			}
		},
		getVisible:function(){
			if(this.el.is(':hidden')){
				return false;
			}else{
				return true;
			}
		},
		getZIndex:function(){
			return this.zIndex;
		},
		/**
		 * @public
		 * @description 获取该component的X坐标。
		 * @return {Number} X坐标
		 */
		getX:function(){
			var left = this.el.offset().left;
			if(this.position == "fixed"){
				return left - jQuery(window).scrollLeft();
			}else{
				return left;
			}
		},
		/**
		 * @public
		 * @description 获取该component的Y坐标。
		 * @return {Number} Y坐标
		 */
		getY:function(){
			var top = this.el.offset().top;
			if(this.position == "fixed"){
				return top - jQuery(window).scrollTop();
			}else{
				return top;
			}
		},
		/**
		 * @public
		 * @description 设置该component在浏览器中的坐标及层级顺序。
		 * @param {Number} [x] X坐标
		 * @param {Number} [y] Y坐标
		 * @param {Integer} [zIndex] 层级顺序索引
		 * @param {Boolean} [triggerEvent] 是否触发move事件。默认为true.
		 * @param {Boolean} [useOffset] 若为ture，则会根据该component当前的position计算出top和left值，是的component在浏览器中的位置与设定的x，y值保持一致。若为false，则仅将x,y值赋值为元素的left和top属性值。默认为true。
		 */
		setPosition:function(x,y,zIndex,triggerEvent,useOffset){
			if(!Alipw.isSet(triggerEvent)){
				triggerEvent = true;
			}
			if(!Alipw.isSet(useOffset)){
				useOffset = true;
			}
			
			if(Alipw.isSet(x)){
				if(this.position == "fixed"){
					if(parseInt(Alipw.ie()) == 6){
						this.el.css("left", (x + jQuery(window).scrollLeft()) + "px");
						this._ie6_fixedX = x;
					}else{
						this.el.css("left", x + "px");
					}
				}else{
					if(useOffset){
						this.el.offset({left:x});
					}else{
						this.el.css({left:x});
					}
				}
			}
			if(Alipw.isSet(y)){
				if(this.position == "fixed"){
					if(parseInt(Alipw.ie()) == 6){
						this.el.css("top", (y + jQuery(window).scrollTop()) + "px");
						this._ie6_fixedY = y;
					}else{
						this.el.css("top", y + "px");
					}
				}else{
					if(useOffset){
						this.el.offset({top:y});
					}else{
						this.el.css("top", y + "px");
					}
				}
			}
			
			if(Alipw.isSet(zIndex))this.el.css("z-index",zIndex);
			
			if(triggerEvent){
				this.fireEvent("move",{},false);
			}
		},
		/**
		 * @public
		 * @description 设置该component为可用。
		 */
		enable:function(){
			this.enabled = true;
		},
		/**
		 * @public
		 * @description 设置该component为不用。
		 */
		disable:function(){
			this.enabled = false;
		},
		/**
		 * @public
		 * @description 重新计算该component的布局。此方法通常在component的布局发生变化或需要更新时自动执行，在复杂的界面控件中，此方法可能会占用较多的计算资源，若需要手动调用，请谨慎使用。
		 */
		doLayout:function(buffer){
			var _this = this;
			
			var layoutAction = function(){
				_this.fireEvent('beforeLayout',{},false);
				_this._doLayout();
				_this.fireEvent('afterLayout',{},false);
			};
			
			if(this.__doLayoutBuffer)clearTimeout(this.__doLayoutBuffer);
			if(buffer){
				this.__doLayoutBuffer = setTimeout(layoutAction,1);
			}else{
				layoutAction();
			}
		},
		//protected
		_doLayout:function(){
			
		},
		//private
		_runAutoRender:function(){
			if(this.autoRender){
				this.render();
			}
		},
		//private
		afterLayoutHandler_Component:function(e){
			if(this.parentContainer){
				this.parentContainer.doLayout(true);
			}
		},
		//private
		scrollHandler_Component:function(){
			var jWin = jQuery(window);
			if(this.position == "fixed"){
				if(parseInt(Alipw.ie()) == 6){
					this.el.css({
						left:jWin.scrollLeft() + this._ie6_fixedX,
						top:jWin.scrollTop() + this._ie6_fixedY
					});
				}
			}
		},
		//private
		creationCompleteFn_Component:function(){
			if(this.draggable){
				var customizedDragConfig = typeof(this.draggable) == "object"?this.draggable:{};
				this.dragSupporter = new Alipw.DragSupporter(jQuery.extend({
					target:this
				},customizedDragConfig));
				this.addEventListener('destroy',function(){
					if(this.dragSupporter){
						this.dragSupporter.destroy();
						this.dragSupporter = null;
					}
				},this);
				
				this.addEventListener("dragstart",this.dragStartHandler_Component,this);
				this.addEventListener("dragend",this.dragEndHandler_Component,this);
			}
			
			if(this.tooltip){
				var customizedToolTipConfig;
				if(typeof(this.tooltip) == "object"){
					customizedToolTipConfig = this.draggable;
				}else if(typeof(this.tooltip) == "string"){
					customizedToolTipConfig = {html:this.tooltip};
				}
				this.tooltip = new Alipw.ToolTip(jQuery.extend({
					target:this
				},customizedToolTipConfig));
			}
		},
		//private
		dragStartHandler_Component:function(){
			if(!this.dragSupporter.useProxy){
				if(this.shadow){
					this.shadow.disable();
				}
			}
		},
		//private
		dragEndHandler_Component:function(e,ep){
			if(this.shadow){
				this.shadow.enable();
			}
		},
		//private
		mouseOverHandlerForOverCls_Component:function(e){
			if(this.destroyed || !this.enabled)return;
			this.el.addClass(this.overCls);
		},
		//private
		mouseOutHandlerForOverCls_Component:function(e){
			if(this.destroyed || !this.enabled)return;
			this.el.removeClass(this.overCls);
		},
		//private
		mouseDownHandlerForDownCls_Component:function(e){
			if(this.destroyed || !this.enabled)return;
			this.el.addClass(this.downCls);
		},
		//private
		mouseUpHandlerForDownCls_Component:function(e){
			if(this.destroyed || !this.enabled)return;
			this.el.removeClass(this.downCls);
		}
	};
	
	return pub;
}();



/**
 * @name Alipw.Component#destroy
 * @event
 * @description 在执行destroy方法后，会先触发此事件，再进行销毁操作。
 * @param {Alipw.Event} e
 * 
 */


/**
 * @name Alipw.Component#move
 * @event
 * @description 在component的位置或层级顺序发生变化时，会触发此事件。
 * @param {Alipw.Event} e
 * 
 */

/**
 * @name Alipw.Component#dragstart
 * @event
 * @description 在component开始被拖拽时，触发此事件。此事件仅当draggable属性为true或者成为Alipw.DragSupporter的应用对象时才有效。
 * @param {Alipw.Event} e
 */

/**
 * @name Alipw.Component#drag
 * @event
 * @description 在component被拖拽移动时，触发此事件。此事件仅当draggable属性为true或者成为Alipw.DragSupporter的应用对象时才有效。
 * @param {Alipw.Event} e e拥有以下附加属性:<ul><li>left:Number 当前component的水平坐标值。</li><li>top:Number 当前component的垂直坐标值。</li></ul>
 */


/**
 * @name Alipw.Component#dragend
 * @event
 * @description 在component被拖拽结束时，触发此事件。此事件仅当draggable属性为true或者成为Alipw.DragSupporter的应用对象时才有效。
 * @param {Alipw.Event} e e拥有以下附加属性:<ul><li>left:Number 当前component的水平坐标值。</li><li>top:Number 当前component的垂直坐标值。</li></ul>
 */