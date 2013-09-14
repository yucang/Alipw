/**
 * @constructor Alipw.Button
 * @extends Alipw.BoxComponent
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 按钮。支持九宫格方式的按钮皮肤。
 * @demo http://aliyun-ued.com/alipw/samples/button.html
 * @example
 * 
 */

Alipw.Button = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.Button.prototype */
{
	/**
	 * @property
	 * @default null
	 * @type Number
	 * @description [config option]定义点击事件的监听函数。
	 */
	handler:null,
	/**
	 * @property
	 * @default null
	 * @type Object
	 * @description [config option]定义点击事件的监听函数中的this指针所指向的对象。
	 */
	scope:null,
	/**
	 * @property
	 * @default 22
	 * @type Number
	 * @description [config option]定义最小高度。
	 */
	minHeight:22,
	/**
	 * @property
	 * @default 10
	 * @type Number
	 * @description [config option]定义最小宽度。
	 */
	minWidth:10,
	/**
	 * @property
	 * @default 65
	 * @type Number
	 * @description [config option]定义最大高度。
	 */
	maxHeight:65,
	/**
	 * @property
	 * @default true
	 * @type Boolean
	 * @description [config option]是否使用九宫格皮肤。
	 */
	gridScale:true,
	/**
	 * @property
	 * @default ''
	 * @type String
	 * @description [config option]定义按钮图标的class名称。
	 */
	iconCls:"",
	/**
	 * @property
	 * @default 'Button'
	 * @type String
	 * @description [config option]定义按钮的文本。
	 */
	label:"Button",
	/**
	 * @property
	 * @default 'alipw-button'
	 * @type String
	 * @description [config option]HTML元素的class名称的基本前缀。
	 */
	baseCls:"alipw-button",
	/**
	 * @property
	 * @type String
	 * @default 'a'
	 * @description [config option]默认的HTML元素tag name。
	 */
	defaultEl:"a",
	constructor:function(){
		Alipw.Button.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Button.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.Button.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.Button.superclass.createDom.apply(this,arguments);
		this.el.attr("href","#");
		var wrap = jQuery('<span class="' + this.baseCls + '-wrap"></span>');
		this.el.append(wrap);
		if(this.gridScale){
			wrap.append(['<table>',
			    '<tr class="' + this.baseCls + '-top">',
			    	'<td class="' + this.baseCls + '-left"></td>',
			        '<td class="' + this.baseCls + '-center"></td>',
			        '<td class="' + this.baseCls + '-right"></td>',
			    '</tr>',
			    '<tr class="' + this.baseCls + '-middle">',
			    	'<td class="' + this.baseCls + '-left"></td>',
			        '<td class="' + this.baseCls + '-center">',
			        	'<span class="' + this.baseCls + '-icon"></span>',
			        	'<span class="' + this.baseCls + '-text"></span>',
			        '</td>',
			        '<td class="' + this.baseCls + '-right"></td>',
			    '</tr>',
			    '<tr class="' + this.baseCls + '-bottom">',
			    	'<td class="' + this.baseCls + '-left"></td>',
			        '<td class="' + this.baseCls + '-center"></td>',
			        '<td class="' + this.baseCls + '-right"></td>',
			    '</tr>',
			'</table>'].join(""));
		}else{
			wrap.append([
                '<span class="' + this.baseCls + '-icon"></span>',
                '<span class="' + this.baseCls + '-text"></span>'
        	].join(''));
		}
		
		this.addEventListener("click",this.defaultClickHandler,this,true);
		
		if(this.handler){
			this.addEventListener("click",this.handler,this.scope || this,true);
		}
	},
	renderComplete:function(){
		Alipw.Button.superclass.renderComplete.apply(this,arguments);
		
		this.el.find("." + this.baseCls + "-text").html(this.label);
		
		this.setIconCls(this.iconCls);
		
		if(this.label){
			this.el.find("." + this.baseCls + "-text").show();
		}else{
			this.el.find("." + this.baseCls + "-text").hide();
		}
	},
	//protected
	_doLayout:function(){
		Alipw.Button.superclass._doLayout.apply(this,arguments);
		
		var textbox;
		var wrap = this.el.find("." + this.baseCls + "-wrap");
		
		if(this.gridScale){
			textbox = this.el.find("." + this.baseCls + "-middle " + "." + this.baseCls + "-center");
		}else{
			textbox = wrap;
		}
		
		if(this.width && this.width != 'auto'){
			var d = wrap.outerWidth(true) - textbox.width();
			textbox.width(this.width - d);
		}
		
		if(this.height && this.height != 'auto'){
			var d = wrap.outerHeight(true) - textbox.height();
			textbox.height(this.height - d);
		}
	},
	/**
	 * @public
	 * @description 设定Button的图标的class名称。
	 * @param {String} cls class名称。
	 */
	setIconCls:function(cls){
		var iconEl = this.el.find("." + this.baseCls + "-icon");
		if(this.iconCls){
			iconEl.removeClass(this.iconCls);
		}
		this.iconCls = cls;
		iconEl.addClass(cls);

		if(cls){
			iconEl.show();
		}else{
			iconEl.hide();
		}
	},
	defaultClickHandler:function(e){
		e.preventDefault();
	}
});