/**
 * @constructor Alipw.ColorPicker
 * @extends Alipw.BoxComponent
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 颜色拾取器。可以单独展示，也可以应用于一个指定的文本输入框(input).
 * @demo http://aliyun-ued.com/alipw/samples/colorpicker.html
 * @example
 * 
 */

Alipw.ColorPicker = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.ColorPicker.prototype */
{
	/**
	 * @property
	 * @type Mixed HTML Element/selector
	 * @default null
	 * @description 指定color picker应用与一个文本输入框。
	 */
	applyTo:null,
	/**
	 * @property
	 * @type Number
	 * @default 253
	 * @description [config option]定义color picker的宽度。
	 */
	width:253,
	/**
	 * @property
	 * @type Array
	 * @default 默认的颜色数组
	 * @description [config option]定义供选择的颜色。
	 */
	colors:[],
	/**
	 * @property
	 * @type String
	 * @default 'alipw-colorpicker'
	 * @description [config option]HTML元素的class名称的基本前缀。
	 */
	baseCls:"alipw-colorpicker",
	/**
	 * @property 
	 * @type Boolean
	 * @description [config option]是否自动渲染。如果为true,则在实例初始化时自动渲染到renderTo属性指定的位置。
	 * @default false
	 */
	autoRender:false,
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]定义当前color picker是否为浮动的可视对象。
	 */
	floating:true,
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]定义是否显示阴影。
	 */
	showShadow:true,
	constructor:function(){
		Alipw.ColorPicker.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.ColorPicker.superclass.commitProperties.apply(this,arguments);
		if(this.colors.length == 0){
			this.colors = this.getDefaultColors_ColorPicker();
		}
		if(this.applyTo){
			this._applyToEl = Alipw.convertEl(this.applyTo);
		}
	},
	initialize:function(){
		Alipw.ColorPicker.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.ColorPicker.superclass.createDom.apply(this,arguments);
		
		var statusbar = new Alipw.Template([
			'<div class="{$baseCls}-statusbar">',
	    		'<div class="{$baseCls}-color-preview"></div>',
	    		'<div class="{$baseCls}-color-info"></div>',
	    	'</div>']
		).set({baseCls:this.baseCls})
		.compile();
		
		this._colorPreivewBox = statusbar.find("." + this.baseCls + "-color-preview");
		this._colorInfoBox = statusbar.find("." + this.baseCls + "-color-info");
		this.el.append(statusbar);
		
		var wrap = jQuery('<div class="' + this.baseCls + '-wrap"></div>');
		this.el.append(wrap);

		var tpl;
		for(var i=0,len=this.colors.length;i<len;i++){
			tpl = new Alipw.Template(['<div class="{$baseCls}-cell" _color="{$color}" style="background:{$color}">',
			                          	'<div class="{$baseCls}-cell-highlight-border"></div>',
			                          '</div>']);
			tpl.set({
				baseCls:this.baseCls,
				color:this.colors[i]
			});
			var cell = tpl.compile();
			cell.bind("click",jQuery.proxy(this.cellClickHandler_ColorPicker,this));
			cell.bind("mouseover",jQuery.proxy(this.cellMouseOverHandler_ColorPicker,this));
			cell.bind("mouseout",jQuery.proxy(this.cellMouseOutHandler_ColorPicker,this));
			wrap.append(cell);
		}
		
		if(this._applyToEl){
			this._applyToEl.bind("focus",jQuery.proxy(this.applyToElement_ColorPicker,this));
			jQuery(document).bind("click",jQuery.proxy(this.documentClickHandler_ColorPicker,this));
			this.addEventListener("select",function(e){
				this._applyToEl.val(e.color);
				this.hide();
			},this);
		}
	},
	renderComplete:function(){
		Alipw.ColorPicker.superclass.renderComplete.apply(this,arguments);
	},
	//private
	getDefaultColors_ColorPicker:function(){
		var colors = new Array();
		var r,g,b;
		var n=0;
		var usuallyUsedColors = new Array(
			["#000000","#000000","#000000"],
			["#000000","#333333","#000000"],
			["#000000","#666666","#000000"],
			["#000000","#999999","#000000"],
			["#000000","#CCCCCC","#000000"],
			["#000000","#FFFFFF","#000000"],
			["#000000","#FF0000","#000000"],
			["#000000","#00FF00","#000000"],
			["#000000","#0000FF","#000000"],
			["#000000","#FFFF00","#000000"],
			["#000000","#00FFFF","#000000"],
			["#000000","#FF00FF","#000000"]
		);
		for(r=0;r<16;r=r+3){
		   for(g=0;g<7;g=g+3){
			   for(b=0;b<16;b=b+3){
				   if((colors.length - n * 3) % 18 == 0){
					   colors.push(usuallyUsedColors[n][0]);
					   colors.push(usuallyUsedColors[n][1]);
					   colors.push(usuallyUsedColors[n][2]);
					   n++;
				   }
				   c = '#'+g.toString(16)+g.toString(16)+b.toString(16)+b.toString(16)+r.toString(16)+r.toString(16);
				   colors.push(c);
		      }
		   }
		}
		for(r=0;r<16;r=r+3){
			for(g=9;g<16;g=g+3){
				for(b=0;b<16;b=b+3){
					if((colors.length - n * 3) % 18 == 0){
						colors.push(usuallyUsedColors[n][0]);
						colors.push(usuallyUsedColors[n][1]);
						colors.push(usuallyUsedColors[n][2]);
						n++;
					}
					c = '#'+g.toString(16)+g.toString(16)+b.toString(16)+b.toString(16)+r.toString(16)+r.toString(16);
					colors.push(c);
				}
			}
		}

		return colors;
	},
	//private
	cellClickHandler_ColorPicker:function(e){
		var cell = jQuery(e.currentTarget);
		this.fireEvent("select",{
			color:cell.attr("_color").toUpperCase()
		},false);
	},
	//private
	cellMouseOverHandler_ColorPicker:function(e){
		var cell = jQuery(e.currentTarget);
		cell.addClass(this.baseCls + "-cell-hover");
		
		var color = cell.attr("_color").toUpperCase();
		this._colorPreivewBox.css("background-color",color);
		this._colorInfoBox.html(color);
	},
	//private
	cellMouseOutHandler_ColorPicker:function(e){
		var cell = jQuery(e.currentTarget);
		cell.removeClass(this.baseCls + "-cell-hover");
		
		var color = "";
		this._colorPreivewBox.css("background-color",color);
		this._colorInfoBox.html(color);
	},
	//private
	applyToElement_ColorPicker:function(e){
		var input = jQuery(e.currentTarget);
		this.show();
		Alipw.ComponentManager.bringToFront(this);
		
		var winHeight = jQuery(window).height();
		var inputPos = input.offset();
		var height = this.el.outerHeight();
		var inputSize = [input.innerWidth(),input.innerHeight()];
		
		var left = inputPos.left;
		var top;
		
		if(winHeight - (inputPos.top - jQuery(document).scrollTop()) >= height){
			top = inputPos.top + inputSize[1];
		}else{
			top = inputPos.top - height;
		}
		this.setPosition(left,top);
	},
	//private
	documentClickHandler_ColorPicker:function(e){
		if(Alipw.isInNode(e.target,this._applyToEl[0]) || e.target == this._applyToEl[0] || Alipw.isInNode(e.target,this.el[0]) || e.target == this.el[0]){
			return;
		}
		this.hide();
	}
});