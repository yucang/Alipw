/**
 * @constructor Alipw.Window
 * @extends Alipw.Panel
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 窗口。
 * @demo http://aliyun-ued.com/alipw/samples/window.html
 * @example
 * 
 */

Alipw.Window = Alipw.extend(Alipw.Panel,
/** @lends Alipw.Window.prototype */
{
	/**
	 * @property
	 * @type String
	 * @default 'alipw-window'
	 * @description [config option]HTML元素的扩展子类追加的class名称。
	 */
	subCls:"alipw-window",
	/**
	 * @property
	 * @type Boolean
	 * @default false
	 * @description [config option]是否为模态窗口。
	 */
	modal:false,
	/**
	 * @property
	 * @type Number
	 * @default 0.3
	 * @description [config option]模态遮罩层透明度。
	 */
	modalOverlayOpacity:0.3,
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]是否显示窗口关闭按钮。
	 */
	closable:true,
	/**
	 * @property
	 * @type Boolean
	 * @default false
	 * @description [config option]是否允许窗口最大化。
	 */
	maximizable:false,
	/**
	 * @property
	 * @type Boolean
	 * @default false
	 * @description [config option]是否允许窗口最小化。
	 */
	minimizable:false,
	/**
	 * @property
	 * @type Array
	 * @default null
	 * @description [config option]窗口起始位置。若为null，则默认显示在居中的位置
	 */
	initPosition:null,
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]窗口是否可被拖拽
	 */
	draggable:true,
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]窗口是否可被鼠标进行尺寸调整。
	 */
	resizable:true,
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]是否为漂浮对象
	 */
	floating:true,
	/**
	 * @property
	 * @type String
	 * @default 'fixed'
	 * @description [config option]窗口的定位类型
	 */
	position:"fixed",
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]窗口是否显示阴影
	 */
	showShadow:true,
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]窗口是否在初始化以及浏览器窗口尺寸变化时自动调整到居中位置
	 */
	autoCenter:false,
	/**
	 * @property
	 * @type Boolean
	 * @default false
	 * @description [config option]是否显示最大最小化等动画效果。
	 */
	animated:false,
	/**
	 * @property
	 * @type Alipw.Taskbar
	 * @default null
	 * @description [config option]指定窗口依赖的Taskbar。窗口在进行最小化时需要指定一个Taskbar对象
	 */
	taskbar:null,
	constructor:function(){
		Alipw.Window.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Window.superclass.commitProperties.apply(this,arguments);
		if(this.draggable === true){
			this.draggable = {
				useProxy:false
			};
		}
	},
	initialize:function(){
		Alipw.Window.superclass.initialize.apply(this,arguments);
		Alipw.WindowManager.register(this);
	},
	createDom:function(){
		Alipw.Window.superclass.createDom.apply(this,arguments);
		
		this.animationProxy = new Alipw.AnimationProxy();
		
		Alipw.getBody().append(this.animationProxy);
		this.addEventListener("destroy",function(e){
			this.animationProxy.remove();
			this.animationProxy = null;
		},this);
		
		this.addEventListener("creationComplete",this.completeHandler_Window,this);
		
		this.addEventListener("dragend",this.dragEndHandler_Window,this);
		this.addEventListener("drag",this.dragHandler_Window,this);
	},
	renderComplete:function(){
		Alipw.Window.superclass.renderComplete.apply(this,arguments);
		
		if(this.draggable){
			var customizedDragConfig = typeof(this.draggable) == "object"?this.draggable:{};
			this.draggable = jQuery.extend({
				dragEl:this.getDragEl_Window()
			},customizedDragConfig);
		}
		
		if(this.modal){
			if(!this.modalOverlay){
				this.modalOverlay = new Alipw.ScreenMask({
					floatingManagement:false,
					opacity:this.modalOverlayOpacity
				});
				this.addEventListener('destroy',function(){
					if(this.modalOverlay){
						this.modalOverlay.destroy();
						this.modalOverlay = null;
					}
				},this);
				this.modalOverlay.setPosition(null,null,this.zIndex - 2);
			}
			this.modalOverlay.show();
		}else{
			if(this.modalOverlay){
				this.modalOverlay.setVisible(false);
			}
		}
		
		if(this.taskbar){
			if(typeof(this.taskbar) == 'string'){
				this.taskbar = Alipw.getComp(this.taskbar);
			}
		
			if(this.taskbar instanceof Alipw.Taskbar){
				var taskbaritem = this.taskbar.addItem(this);
				taskbaritem.activate();
				this.addEventListener('destroy',function(){
					this.taskbar.removeItem(this);
				},this);
			}
		}
		
		this.addEventListener("visibilityChange",this.visibilityChangeHandler_Window,this);
		this.addEventListener("move",this.moveHandler_Window,this);
	},
	destroy:function(){
		Alipw.WindowManager.unregister(this);
		Alipw.Window.superclass.destroy.apply(this,arguments);
	},
	//protected
	renderHeaderBtns:function(){
		if(this.minimizable && this.taskbar){
			if(!this.minimizeBtn){
				this.minimizeBtn = new Alipw.Button({
					label:"",
					cls:"button-alipw-panel-header-grey alipw-panel-btn-min",
					width:30,
					height:22,
					inlineStyle:{"margin-right":"-1px"},
					iconCls:"icon-alipw-panel-minimizeBtn",
					renderTo:this.el.find("." + this.baseCls + "-header-buttons"),
					handler:this.minimizeHandler_Window,
					scope:this
				});
				if(this.closeBtn){
					this.el.find("." + this.baseCls + "-header-buttons").append(this.closeBtn.el);
				}
			}
		}
		
		if(this.maximizable){
			if(!this.maximizeBtn){
				this.maximizeBtn = new Alipw.Button({
					label:"",
					cls:"button-alipw-panel-header-grey alipw-panel-btn-max",
					width:30,
					height:22,
					inlineStyle:{"margin-right":"-1px"},
					iconCls:"icon-alipw-panel-maximizeBtn",
					renderTo:this.el.find("." + this.baseCls + "-header-buttons"),
					handler:this.maximizeRestoreHandler_Window,
					scope:this
				});
				if(this.closeBtn){
					this.el.find("." + this.baseCls + "-header-buttons").append(this.closeBtn.el);
				}
				this.header.bind("dblclick",jQuery.proxy(this.maximizeRestoreHandler_Window,this));
			}
		}
		
		Alipw.Window.superclass.renderHeaderBtns.apply(this,arguments);
	},
	/**
	 * @public
	 * @description 使窗口在浏览器中居中
	 */
	center:function(){
		var jWin = jQuery(window);
		
		var w = this.getWidth();
		var h = this.getHeight();
		var x = parseInt((jWin.width() - w)/2);
		var y = parseInt((jWin.height() - h)/2);
		if(x < 10){
			x = 10;
		}
		
		if(y < 10){
			y = 10;
		}
		
		if(this.position == "fixed"){
			this.setPosition(x,y);
		}else{
			this.setPosition(x + jWin.scrollLeft(), y + jWin.scrollTop());
		}
	},
	/**
	 * @public
	 * @description 使窗口最小化
	 * @param {Boolean} animated 是否显示最小化动画效果。
	 */
	minimize:function(animated){
		if(animated){
			this.animationProxy.animate(
				this,
				this.taskbar.getBarItemByWindow(this),
				0.3,
				0.1,
				300
			);
		}
		
		this.remove();
		this.taskbar.getBarItemByWindow(this).deactivate();
		
		this.minimized = true;
	},
	/**
	 * @public
	 * @description 使窗口最大化
	 */
	maximize:function(){
		this._storage_for_restore = [this.getX(),this.getY(),this.width,this.height];
		
		this.maximized = true;
		this.maximizeBtn.el.removeClass('alipw-panel-btn-max');
		this.maximizeBtn.el.addClass('alipw-panel-btn-restore');
		this.maximizeBtn.setIconCls("icon-alipw-panel-restoreBtn");

		if(this.shadow){
			this.shadow.disable();
		}
		if(this.dragSupporter){
			this.dragSupporter.disable();
		}
		
		this.setPosition(0,0);
		this.setWidth(jQuery(window).width());
		this.setHeight(jQuery(window).height());
		
		if(this.resizeSupporter){
			this.resizeSupporter.disable();
		}
	},
	/**
	 * @public
	 * @description 使处于最小化状态的窗口恢复至最小化前的状态
	 * @param {Boolean} animated 是否显示恢复最小化动画效果。
	 */
	restore:function(animated){
		if(this.minimized){
			this.minimized = false;
			this.render();
			if(animated){
				this.setVisible(false,true);
				
				var _this = this;
				this.animationProxy.animate(
					this.taskbar.getBarItemByWindow(this),
					this,
					0.3,
					0.1,
					300,
					function(){
						_this.setVisible(true);
					}
				);
			}else{
				this.setVisible(true);
			}
		}else if(this.maximized){
			this.maximized = false;
			
			this.maximizeBtn.el.removeClass('alipw-panel-btn-restore');
			this.maximizeBtn.el.addClass('alipw-panel-btn-max');
			this.maximizeBtn.setIconCls("icon-alipw-panel-maximizeBtn");
	
			if(this.shadow){
				this.shadow.enable();
			}
			if(this.dragSupporter){
				this.dragSupporter.enable();
			}
			
			this.setPosition(this._storage_for_restore[0],this._storage_for_restore[1]);
			this.setWidth(this._storage_for_restore[2]);
			this.setHeight(this._storage_for_restore[3]);
			
			if(this.resizeSupporter){
				this.resizeSupporter.enable();
			}
		}
	},
	//private
	maximizeRestoreHandler_Window:function(){
		if(this.maximized){
			this.restore(this.animated);
		}else{
			this.maximize(this.animated);
		}
	},
	//private
	minimizeHandler_Window:function(){
		this.minimize(this.animated);
	},
	//private
	completeHandler_Window:function(){
		if(!this.initPosition){
			this.center();
		}else if(this.initPosition instanceof Array){
			this.setPosition(this.initPosition[0],this.initPosition[1]);
		}
		
		this.addEventListener("mousedown",this.mouseDownHandler_Window,this,true);
		
		var resizeHandler = Alipw.createFuncProxy(this.resizeHandler_Window,this);
		jQuery(window).bind("resize",resizeHandler);
		this.addEventListener('destroy',function(){
			jQuery(window).unbind('resize',resizeHandler);
		},this);
	},
	//private
	visibilityChangeHandler_Window:function(e){
		if(this.modalOverlay){
			this.modalOverlay.setVisible(this.visible);
		}
	},
	//private
	moveHandler_Window:function(){
		if(this.modalOverlay){
			this.modalOverlay.setPosition(null,null,this.zIndex - 2);
		}
	},
	//private
	resizeHandler_Window:function(){
		if(this.maximized){
			this.setWidth(jQuery(window).width());
			this.setHeight(jQuery(window).height());
		}
		
		if(!this.maximized && this.autoCenter){
			var _this = this;
			clearTimeout(this.centerTimer);
			this.centerTimer = setTimeout(function(){
				if(_this.destroyed)return;
				_this.center();
			},10);
		}
	},
	//private
	mouseDownHandler_Window:function(e,ep){
		Alipw.ComponentManager.bringToFront(this);
	},
	//private
	dragEndHandler_Window:function(e,ep){
		this.setPosition(ep.left,ep.top);
	},
	//private
	dragHandler_Window:function(e,ep){
		
	},
	//private
	getDragEl_Window:function(){
		if(this.showHeader && this.header){
			return this.header;
		}else if(!this.showHeader && this.body){
			return this.body;
		}
	}
});