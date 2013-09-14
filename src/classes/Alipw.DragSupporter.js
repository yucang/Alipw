/**
 * @constructor Alipw.DragSupporter
 * @extends Alipw.Nonvisual
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 拖拽支持类，可应用于可视控件，使其可被鼠标拖拽。
 */

Alipw.DragSupporter = Alipw.extend(Alipw.Nonvisual,
/** @lends Alipw.DragSupporter.prototype */
{
	/**
	 * @property
	 * @type HTML Element/Selector/Alipw.Component
	 * @description [config option]指定需要支持拖拽的目标。
	 * @default ''
	 */
	target:"",
	/**
	 * @property
	 * @type HTML Element/Selector
	 * @description [config option]指定鼠标的拖拽点。
	 * @default ''
	 */
	dragEl:"",
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]定义拖拽时是否使用代理显示对象。
	 * @default true
	 */
	useProxy:true,
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]定义是否支持拖拽动作的响应。
	 * @default true
	 */
	draggable:true,
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]定义是否支持放下动作的响应。
	 * @default false
	 */
	droppable:false,
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]定义拖拽时拖拽对象的class名称。
	 * @default 'alipw-component-dragging'
	 */
	draggingCls:"alipw-component-dragging",
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]定义拖是否可用。
	 * @default true
	 */
	enabled:true,
	constructor:function(){
		Alipw.DragSupporter.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.DragSupporter.superclass.commitProperties.apply(this,arguments);
		
		if(this.target instanceof Alipw.Component){
			this.targetEl = this.target.el;
		}else{
			this.targetEl = Alipw.convertEl(this.target);
		}
		
	},
	initialize:function(){
		Alipw.DragSupporter.superclass.initialize.apply(this,arguments);
		
		if(this.targetEl[0]){
			var dragEl = this.dragEl?jQuery(this.dragEl):this.targetEl;
			
			dragEl.bind("mousedown",jQuery.proxy(this.getReady,this));
			jQuery(document).bind("mousemove",jQuery.proxy(this.move,this));
			jQuery(document).bind("mouseup",jQuery.proxy(this.release,this));
		}
	},
	//private
	getReady:function(e){
		if(!this.enabled)return;
		
		e.preventDefault();
		this.ready = true;
		this._dx = this.targetEl.offset().left - e.pageX;
		this._dy = this.targetEl.offset().top - e.pageY;
	},
	//private
	move:function(e){
		if(!this.enabled || !this.ready)return;
		e.preventDefault();

		if(!this.dragging){
			this.dragging = true;
			
			if(this.useProxy){
				if(!this.proxy){
					this.proxy = new Alipw.BorderContainer({
						cls:"alipw-dragproxy",
						floating:true,
						position:(this.target instanceof Alipw.Component)?this.target.position:""
					});
					this.addEventListener('destroy',function(){
						if(this.proxy){
							this.proxy.destroy();
							this.proxy = null;
						}
					},this);
				}
				this.proxy.show();
				this.proxy.setWidth(this.targetEl.width());
				this.proxy.setHeight(this.targetEl.height());
				Alipw.ComponentManager.bringToFront(this.proxy);
			}else{
				if(this.draggingCls){
					this.targetEl.addClass(this.draggingCls);
				}
			}
			
			if(this.target instanceof Alipw.Component){
				this.originalPosition = [this.target.getX(),this.target.getY()];
				this.target.fireEvent("dragstart",{},false);
			}else{
				this.originalPosition = [this.targetEl.offset().left,this.targetEl.offset().top];
				this.targetEl.triggerHandler("alipw-dragstart");
			}
		}
		if(this.target instanceof Alipw.Component){
			if(this.target.position == "fixed"){
				this._currCoord = this.getHandledPosition_DragSupporter(e.clientX + this._dx, e.clientY + this._dy);
				(this.proxy || this.target).setPosition(this._currCoord[0],this._currCoord[1],null,false);
			}else{
				this._currCoord = this.getHandledPosition_DragSupporter(e.pageX + this._dx,e.pageY + this._dy);
				(this.proxy || this.target).el.offset({
					left:this._currCoord[0],
					top:this._currCoord[1]
				});
				//this.target.setPosition(e.pageX + this._dx,e.pageY + this._dy);
			}
			this.target.fireEvent("drag",{
				left:this._currCoord[0],
				top:this._currCoord[1]
			},false);
		}else{
			this._currCoord = this.getHandledPosition_DragSupporter(e.pageX + this._dx,e.pageY + this._dy);
			if(this.proxy){
				this.proxy.el.offset({
					left:this._currCoord[0],
					top:this._currCoord[1]
				});
			}else{
				this.targetEl.offset({
					left:this._currCoord[0],
					top:this._currCoord[1]
				});
			}
			
			this.targetEl.triggerHandler("alipw-drag",{
				left:this._currCoord[0],
				top:this._currCoord[1]
			});
		}
	},
	//private
	release:function(e){
		if(!this.enabled)return;
		
		if(this.dragging){
			this.dragging = false;
			if(this.target instanceof Alipw.Component){
				this.target.setPosition(this.originalPosition[0],this.originalPosition[1],null,false);
				
				this.target.fireEvent("dragend",{
					left:this._currCoord[0],
					top:this._currCoord[1]
				},false);
			}else{
				this.targetEl.offset({
					left:this.originalPosition[0],
					top:this.originalPosition[1]
				});
				this.targetEl.triggerHandler("alipw-dragend",{
					left:this._currCoord[0],
					top:this._currCoord[1]
				});
			}
		}
		if(this.draggingCls){
			this.targetEl.removeClass(this.draggingCls);
		}
		if(this.proxy){
			this.proxy.setVisible(false);
		}
		this.dragging = false;
		this.ready = false;
	},
	//private
	getHandledPosition_DragSupporter:function(left,top){
		var jWin = jQuery(window);
		var winWidth = jWin.width();
		var winHeight = jWin.height();
		var docWidth = Alipw.getDocWidth();
		var docHeight = Alipw.getDocHeight();
		var targetWidth,targetHeight; 
		targetWidth = this.targetEl.outerWidth();
		targetHeight = this.targetEl.outerHeight();

		
		if(this.target.position == "fixed"){
			
			if(left + targetWidth > winWidth - 10){
				left = winWidth - targetWidth - 10;
			}
			
			if(left < 10){
				left = 10;
			}
			
			if(top + targetHeight > winHeight - 10){
				top = winHeight - targetHeight - 10;
			}
			
			if(top < 10){
				top = 10;
			}
		}else{
			var conWidth = winWidth > docWidth? winWidth : docWidth;
			var conHeight = winHeight > docHeight? winHeight : docHeight;
			
			if(left + targetWidth > conWidth - 10){
				left = conWidth - targetWidth - 10;
			}
			
			if(left < 10){
				left = 10;
			}			
			
			if(top + targetHeight > conHeight - 10){
				top = conHeight - targetHeight - 10;
			}
			
			if(top < 10){
				top = 10;
			}
		}
		
		return [left,top];
	}
});