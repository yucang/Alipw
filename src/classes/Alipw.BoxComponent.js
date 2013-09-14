/**
 * @constructor
 * @extends Alipw.Component
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 盒状可视控件。指具有可自定义宽度和高度的可视控件。
 */

Alipw.BoxComponent = Alipw.extend(Alipw.Component,
/**
 * @lends Alipw.BoxComponent.prototype
 */
{
	/**
	 * @property
	 * @type Number
	 * @default null
	 * @description [config option]定义BoxComponent的宽度。
	 */
	width:null,
	/**
	 * @property
	 * @type Number
	 * @default null
	 * @description [config option]定义BoxComponent的高度。
	 */
	height:null,
	/**
	 * @property
	 * @type Number
	 * @default 1
	 * @description [config option]定义BoxComponent的最小宽度。
	 */
	minWidth:1,
	/**
	 * @property
	 * @type Number
	 * @default 1
	 * @description [config option]定义BoxComponent的最小高度。
	 */
	minHeight:1,
	/**
	 * @property
	 * @type Number
	 * @default null
	 * @description [config option]定义BoxComponent的最大宽度。
	 */
	maxWidth:null,
	/**
	 * @property
	 * @type Number
	 * @default null
	 * @description [config option]定义BoxComponent的最大高度。
	 */
	maxHeight:null,
	/**
	 * @property
	 * @type Boolean
	 * @description 指示当前是否为自动高度。
	 * @default null
	 */
	autoHeight:null,
	/**
	 * @property
	 * @type Boolean
	 * @default false
	 * @description [config option]定义是否可通过鼠标拖拽来缩放尺寸。
	 */
	resizable:false,
	/**
	 * @property
	 * @type Boolean
	 * @default false
	 * @description [config option]定义是否显示阴影。
	 */
	showShadow:false,
	/**
	 * @property
	 * @type String
	 * @default 'drop'
	 * @description [config option]定义阴影的显示模式，可选值有'drop','frame','sides'。
	 */
	shadowMode:"drop",
	constructor:function(config){
		Alipw.BoxComponent.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.BoxComponent.superclass.commitProperties.apply(this,arguments);
		if(!this.height && !Alipw.isSet(this.autoHeight)){
			this.autoHeight = true;
		}
	},
	initialize:function(){
		Alipw.BoxComponent.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.BoxComponent.superclass.createDom.apply(this,arguments);
	},
	render:function(obj){
		Alipw.BoxComponent.superclass.render.apply(this,arguments);
	},
	renderComplete:function(updating){
		Alipw.BoxComponent.superclass.renderComplete.apply(this,arguments);
		if(this.showShadow){
			if(!this.shadow){
				this.createShadow_BoxComponent();
			}
			this.shadow.show();
		}else{
			if(this.shadow){
				this.shadow.setVisible(false);
			}
		}
		
		if(this.resizable){
			var customizedResizeConfig = typeof(this.resizable) == "object"?this.resizable:{};
			this.resizeSupporter = new Alipw.ResizeSupporter(jQuery.extend({
				target:this,
				maxWidth:this.maxWidth,
				maxHeight:this.maxHeight,
				minWidth:this.minWidth,
				minHeight:this.minHeight
			},customizedResizeConfig));
			
			this.addEventListener('destroy',function(){
				if(this.resizeSupporter){
					this.resizeSupporter.destroy();
					this.resizeSupporter = null;
				}
			},this);
		}
	},
	//protected
	_doLayout:function(){
		Alipw.BoxComponent.superclass._doLayout.apply(this,arguments);
		if(this.width){
			this.el.width(this.width);
		}

		if(this.autoHeight){
			this.height = null;
			this.el.css('height','auto');
			
			var curHeight = this.getHeight();
			
			if(this.maxHeight && curHeight > this.maxHeight){
				this.height = this.maxHeight;
				this.el.height(this.maxHeight);
			}
			
			if(this.minHeight && curHeight < this.maxHeight){
				this.height = this.minHeight;
				this.el.height(this.minHeight);
			}
			
		}else if(this.height){
			this.el.height(this.height);
		}
	},
	/**
	 * @property
	 * @description 设定BoxComponent的宽度。
	 * @param {Number} width 以像素为单位的宽度。
	 */
	setWidth:function(width){
		this.width = width;
		this.doLayout();
		
		this.fireEvent("resize",{},false);
	},
	/**
	 * @public
	 * @description 设定BoxComponent的高度。
	 * @param {Number} width 以像素为单位的高度。
	 */
	setHeight:function(height){
		this.height = height;
		this.autoHeight = false;
		this.doLayout();
		
		this.fireEvent("resize",{},false);
	},
	/**
	 * @public
	 * @description 设定BoxComponent的宽度和高度。
	 * @param {Number} width 以像素为单位的宽度。
	 * @param {Number} height 以像素为单位的高度。
	 */
	setSize:function(width,height){
		this.width = width;
		this.height = height;
		this.doLayout();
		
		this.fireEvent("resize",{},false);
	},
	/**
	 * @public
	 * @description 获取BoxComponent的宽度。
	 * @return {Number} 以像素为单位的宽度。
	 */
	getWidth:function(){
		return this.el.innerWidth();
	},
	/**
	 * @public
	 * @description 获取BoxComponent的高度。
	 * @return {Number} 以像素为单位的高度。
	 */
	getHeight:function(){
		return this.el.innerHeight();
	},
	//private
	createShadow_BoxComponent:function(e){
		if(this.shadow){
			return;
		}
		
		if(this instanceof Alipw.Shadow){
			return;
		}
		
		this.shadow = new Alipw.Shadow({
			target:this,
			position:this.position,
			mode:this.shadowMode
		});
		this.addEventListener("destroy",function(){
			if(this.shadow){
				this.shadow.destroy();
			}
		},this);
	}
});