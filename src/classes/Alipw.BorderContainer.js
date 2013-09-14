/**
 * @constructor Alipw.BorderContainer
 * @extends Alipw.BoxComponent
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 带边框的盒状控件。支持九宫格皮肤。
 */

Alipw.BorderContainer = Alipw.extend(Alipw.Container,
/** @lends Alipw.BorderContainer.prototype */
{
	/**
	 * @property
	 * @type String
	 * @default 'alipw-bordercontainer'
	 * @description [config option]HTML元素的class名称的基本前缀。
	 */
	baseCls:"alipw-bordercontainer",
	constructor:function(){
		Alipw.BorderContainer.superclass.constructor.apply(this,arguments);
	},
	initialize:function(){
		Alipw.BorderContainer.superclass.initialize.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.BorderContainer.superclass.commitProperties.apply(this,arguments);
	},
	createDom:function(){
		Alipw.BorderContainer.superclass.createDom.apply(this,arguments);
		//this.el.append(['<div class="' + this.baseCls + '-wrap"></div>'].join(""));
		
		this.el.append(new Alipw.Template([
			'<div class="{$baseCls}-wrap">',
	    		'<div class="{$baseCls}-header">',
		    		'<div class="{$baseCls}-header-left">',
			    		'<div class="{$baseCls}-header-right">',
				    		'<div class="{$baseCls}-header-center">',
				    		'</div>',
			    		'</div>',
		    		'</div>',
	    		'</div>',
	    		'<div class="{$baseCls}-body">',
		    		'<div class="{$baseCls}-body-left">',
			    		'<div class="{$baseCls}-body-right">',
				    		'<div class="{$baseCls}-body-center">',
					    		'<div class="{$baseCls}-body-content"></div>',
				    		'</div>',
			    		'</div>',
		    		'</div>',
	    		'</div>',
	    		'<div class="{$baseCls}-footer">',
		    		'<div class="{$baseCls}-footer-left">',
			    		'<div class="{$baseCls}-footer-right">',
				    		'<div class="{$baseCls}-footer-center">',
				    		'</div>',
			    		'</div>',
		    		'</div>',
	    		'</div>',
	    	'</div>']
		).set({baseCls:this.baseCls})
		.compile());
	},
	renderComplete:function(){
		Alipw.BorderContainer.superclass.renderComplete.apply(this,arguments);
	},
	/**
	 * @public
	 * @description 通过已知的内容区域宽度计算盒状容器的宽度。在内容区域宽度固定的情况下，盒装容器的宽度可能受到边框、边距等CSS样式影响。
	 * @param {Number} width 以像素为单位的内容区域宽度。
	 */
	getWidthByBody:function(width){
		return width + (this.getWidth() - this.getBody().width());
	},
	/**
	 * @public
	 * @description 通过已知的内容区域高度计算盒状容器的高度。在内容区域宽度固定的情况下，盒装容器的高度可能受到边框、边距等CSS样式影响。
	 * @param {Number} height 以像素为单位的内容区域高度。
	 */
	getHeightByBody:function(height){
		return height + (this.getHeight() - this.getBody().height());
	},
	//protected
	_doLayout:function(){
		Alipw.BorderContainer.superclass._doLayout.apply(this,arguments);
		var body = this.getBody();
		var wrap = this.el.find("." + this.baseCls + "-wrap");
		
		if(this.autoHeight){
			this.height = null;
			this.el.css('height','auto');
			body.css('height','auto');
			
			if(this.minHeight && this.getHeight() < this.minHeight){
				this.height = this.minHeight;
			}
			
			if(this.maxHeight && this.getHeight() > this.maxHeight){
				this.height = this.maxHeight;
			}
		}
		
		if(this.height){
			body.height(10);//for ie6 bug -- when there's no content there the height is 1px but not 0
			var heightDetla = wrap.outerHeight(true) - body.height();
			body.height(this.height - heightDetla);
		}
		
		if(this.width){
			body.css('width','auto');
			var widthDetla = wrap.outerWidth(true) - body.width();
			body.width(this.width - widthDetla);
		}
	},
	remove:function(){
		Alipw.BorderContainer.superclass.remove.apply(this,arguments);
	},
	//protected
	getBody:function(){
		if(!this.__getBodyCache){
			this.__getBodyCache = this.el.find('.' + this.baseCls + '-body-content');
			this.addEventListener('destroy',function(){
				this.__getBodyCache = null;
			},this);
		}
		return this.__getBodyCache;
	}
});