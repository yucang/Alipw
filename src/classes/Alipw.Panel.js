/**
 * @constructor Alipw.Panel
 * @extends Alipw.Container
 * @description 面板。面板是指一个含有标题栏，底部按钮栏的内容展示容器。
 * @demo http://aliyun-ued.com/alipw/samples/panel.html
 * @example
 * 
 */

Alipw.Panel = Alipw.extend(Alipw.Container,
/** @lends Alipw.Panel.prototype */
{
	baseCls:"alipw-panel",
	showHeader:true,
	closable:false,
	closeAction:"remove",
	closeBtnConfig:{},
	minWidth:200,
	minHeight:150,
	width:200,
	height:150,
	title:"",
	buttons:"",
	buttonAlign:"center",
	defaultButtonWidth:60,
	buttonGap:6,
	constructor:function(){
		Alipw.Panel.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Panel.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.Panel.superclass.initialize.apply(this,arguments);
		this.headerButtonItems = new Array();
		this.buttonItems = new Array();
	},
	createDom:function(){
		Alipw.Panel.superclass.createDom.apply(this,arguments);
		this.el.append([
				    '<div class="' + this.baseCls +'-wrap">',
						'<div class="' + this.baseCls +'-header">',
					    	'<span class="' + this.baseCls +'-header-left">',
					        	'<span class="' + this.baseCls +'-header-right">',
					            	'<span class="' + this.baseCls +'-header-center">',
					                	'<span class="' + this.baseCls +'-header-text">',
					                    	'<span class="' + this.baseCls +'-header-text-shadow"></span>',
					                        '<span class="' + this.baseCls +'-header-text-fore"></span>',
					                    '</span>',
					                    '<div class="' + this.baseCls +'-header-buttons"></div>',
					                '</span>',
					            '</span>',
					        '</span>',
					    '</div>',
					    '<div class="' + this.baseCls +'-body-wrap">',
					    	'<div class="' + this.baseCls +'-body-left">',
					    		'<div class="' + this.baseCls +'-body-right">',
					    			'<div class="' + this.baseCls +'-body">',
					    				'<div class="' + this.baseCls +'-body-content">',
					    				'</div>',
						    			'<div class="' + this.baseCls +'-body-buttonbar">',
									    '</div>',
					    			'</div>',
					    		'</div>',
					    	'</div>',
					    '</div>',
					    '<div class="' + this.baseCls +'-footer">',
						    '<span class="' + this.baseCls +'-footer-left">',
					    		'<span class="' + this.baseCls +'-footer-right">',
					    			'<span class="' + this.baseCls +'-footer-center"></span>',
					    		'</span>',
					    	'</span>',
					    '</div>',
				    '</div>'
				].join(""));
		
		this.header = this.el.find("." + this.baseCls +"-header");
		this.body = this.getBody();
		this.footer = this.el.find("." + this.baseCls +"-footer");
		this.buttonBar = this.el.find("." + this.baseCls +"-body-buttonbar");
		this.bodyWrap = this.el.find("." + this.baseCls +"-body-wrap");
		
		this.addEventListener('destroy',function(){
			this.headerButtonItems = null;
			this.buttonItems = null;
		},this);
	},
	renderComplete:function(){
		Alipw.Panel.superclass.renderComplete.apply(this,arguments);

		this.setTitle(this.title);
		this.renderHeaderBtns();
		
		if(this.buttons instanceof Array && this.buttons.length > 0){
			this.addButtons(this.buttons);
		}
	},
	//protected
	_doLayout:function(){
		Alipw.Panel.superclass._doLayout.apply(this,arguments);
		
		var wrap = this.el.find("." + this.baseCls + "-wrap");
		if(this.showHeader){
			wrap.removeClass(this.baseCls + "-noheader");
		}else{
			wrap.addClass(this.baseCls + "-noheader");
		}
		
		if(this.buttonItems.length > 0){
			this.buttonBar.css("text-align",this.buttonAlign);
			this.buttonBar.show();
		}else{
			this.buttonBar.hide();
		}
		
		var wrap = this.el.find("." + this.baseCls + "-wrap");
		var wrapHeight = wrap.outerHeight();
		var wrapWidth = wrap.outerWidth();
		
		if(this.height){
			//this.body.height(this.height - (this.showHeader?this.header.outerHeight():0) - (hasButton?this.buttonBar.outerHeight():0) - (this.bodyWrap.outerHeight() - this.body.parent().height()) - this.footer.height());
			this.body.height(this.height - (wrapHeight - this.body.height()));
		}
		
		if(this.width){
			this.buttonBar.width(10);
			this.body.width('auto');
			this.body.width(this.width - (wrapWidth - this.body.width()));
			//keep the button bar the same width as body
			this.buttonBar.width(this.body.outerWidth() - (this.buttonBar.outerWidth() - this.buttonBar.width()));
		}
	},
	setTitle:function(title){
		this.el.find("." + this.baseCls + "-header-text-shadow").html(title);
		this.el.find("." + this.baseCls + "-header-text-fore").html(title);
	},
	//protected
	renderHeaderBtns:function(){
		if(this.closable){
			if(!this.closeBtn){
				this.closeBtn = new Alipw.Button(jQuery.extend({
					cls:"button-alipw-panel-header-red alipw-panel-btn-close",
					iconCls:"icon-alipw-panel-closeBtn",
					label:"",
					width:45,
					height:22,
					inlineStyle:{"margin-right":"-1px"},
					renderTo:this.el.find("." + this.baseCls + "-header-buttons"),
					handler:this.closeBtnHandler,
					scope:this
				},this.closeBtnConfig));
				this.headerButtonItems.push(this.closeBtn);
				
				this.closeBtn.addEventListener('mousedown',function(e){
					e.preventDefault();
					e.stopPropagation();
				},this,true);
			}
		}

		if(this.headerButtonItems.length < 1){
			this.el.find("." + this.baseCls + "-header-buttons").hide();
		}else{
			this.el.find("." + this.baseCls + "-header-buttons").show();
		}
	},
	close:function(){
		var result = this.fireEvent('beforeClose',{},false);
		if(result == false)return;
		
		if(this.closeAction == "remove"){
			this.destroy();
		}else if(this.closeAction = "hide"){
			this.setVisible(false);
		}
	},
	getWidthByBody:function(width){
		return width + (this.getWidth() - this.body.width());
	},
	getHeightByBody:function(height){
		return height + (this.getHeight() - this.body.height());
	},
	addButtons:function(config){
		if(config instanceof Array){
			for(var i=0,len=config.length;i<len;i++){
				this.createButton(config[i]);
			}
			this.doLayout();
		}else if(typeof(config) == "object"){
			var button = this.createButton(config);
			this.doLayout();
			return button;
		}
	},
	getButton:function(id){
		
	},
	//protected
	getBody:function(){
		return this.el.find("." + this.baseCls + "-body-content");
	},
	closeBtnHandler:function(e){
		e.stopPropagation();
		this.close();
	},
	//private
	createButton:function(config){
		var button = new Alipw.Button(jQuery.extend({
			renderTo:this.buttonBar,
			width:this.defaultButtonWidth,
			inlineStyle:{
				margin:"0 " + this.buttonGap/2 + "px"
			}
		},config));
		this.buttonItems.push(button);
		button.ownerComp = this;
		
		return button;
	},
	//private
	createButtons_Panel:function(){
		this.addButtons(this.buttons);
	}
});