/**
 * @constructor Alipw.ToolTip
 * @extends Alipw.BorderContainer
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 浮动的消息提示。
 * @demo http://aliyun-ued.com/alipw/samples/tooltip.html
 * 
 */

Alipw.ToolTip = Alipw.extend(Alipw.BorderContainer,
/** @lends Alipw.ToolTip.prototype */
{
	html:"",
	/**
	 * @property
	 * @type HTML Element/HTML Selector
	 * @description [config option]定义ToolTip的宿主对象
	 * @default null
	 */
	target:null,
	/**
	 * @property
	 * @type String
	 * @description [config option]ToolTip的展现模式。可选值有'anchor'和'follow'
	 * @default 'follow'
	 */
	mode:'follow',
	/**
	 * @property
	 * @type String
	 * @description [config option]ToolTip相对锚点的展现位置。此配置仅当mode为'anchor'时有效，可选值有'top','bottom','left','right','vertical','horizontal'
	 * @default 'vertical'
	 */
	tipPosition:'vertical',
	/**
	 * @property
	 * @type Number
	 * @description [config option]定义ToolTip的展示延迟时间
	 * @default 0.5
	 */
	showDelay:0.5,
	/**
	 * @property
	 * @type Number
	 * @description [config option]定义ToolTip的隐藏延迟时间
	 * @default 0.2
	 */
	hideDelay:0.2,
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]定义是否为漂浮对象
	 * @default true
	 */
	floating:true,
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]定义是否显示阴影
	 * @default true
	 */
	showShadow:true,
	/**
	 * @property
	 * @type Number
	 * @description [config option]定义文本区域最大宽度
	 * @default 300
	 */
	textMaxWidth:300,
	/**
	 * @property
	 * @type Number
	 * @description [config option]定义ToolTip展示时水平方向与鼠标位置的偏移量
	 * @default 0
	 */
	offsetX:0,
	/**
	 * @property
	 * @type Number
	 * @description [config option]定义ToolTip展示时垂直方向与鼠标位置的偏移量
	 * @default 20
	 */
	offsetY:20,
	/**
	 * @property
	 * @type Number
	 * @description [config option]定义ToolTip展示时与锚点的距离。此配置仅当mode为anchor时有效
	 * @default 20
	 */
	offsetAnchor:15,
	/**
	 * @property
	 * @type Array
	 * @description 使该ToolTip显示的事件。
	 * @default ['mouseover']
	 * */
	triggerEvents:["mouseover"],
	/**
	 * @property
	 * @type Array
	 * @description 使该ToolTip隐藏的事件。
	 * @default ['mouseout']
	 * */
	hideEvents:["mouseout"],
	/**
	 * @property
	 * @type Array
	 * @description ToolTip对象自身的使其显示的事件。
	 * @default ['mouseover']
	 * */
	tipShowEvents:["mouseover"],
	/**
	 * @property
	 * @type Array
	 * @description ToolTip对象自身的使其隐藏的事件。
	 * @default ['mouseout']
	 * */
	tipHideEvents:["mouseout"],
	/**
	 * @property
	 * @type String
	 * @description 基本前缀。
	 * @default 'alipw-tooltip'
	 * */
	baseCls:"alipw-tooltip",
	/**
	 * @property
	 * @description defaults to false
	 * */
	autoRender:false,
	constructor:function(){
		Alipw.ToolTip.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.ToolTip.superclass.commitProperties.apply(this,arguments);
		
		this.targetEl = Alipw.convertEl(this.target);
	},
	initialize:function(){
		Alipw.ToolTip.superclass.initialize.apply(this,arguments);
		if(this.targetEl){
			for(var i=0,len=this.triggerEvents.length;i<len;i++){
				this.targetEl.bind(this.triggerEvents[i],jQuery.proxy(this.showHandler,this));
			}
			
			for(var i=0,len=this.hideEvents.length;i<len;i++){
				this.targetEl.bind(this.hideEvents[i],jQuery.proxy(this.hideHandler,this));
			}
			
			this.targetEl.bind("mousemove",jQuery.proxy(this.updateTipPos,this));
		}	
	},
	createDom:function(){
		Alipw.ToolTip.superclass.createDom.apply(this,arguments);
		
		var wrap = this.el.find('.' + this.baseCls + '-wrap');
		if(this.mode == 'anchor'){
			wrap.addClass(this.baseCls + '-anchormode');
		}
		wrap.append('<div class="' + this.baseCls + '-arrow"></div>');
	},
	renderComplete:function(){
		Alipw.ToolTip.superclass.renderComplete.apply(this,arguments);
		
		for(var i=0,len=this.tipShowEvents.length;i<len;i++){
			this.addEventListener(this.tipShowEvents[i],this.showHandler,this,true);
		}
		
		for(var i=0,len=this.tipHideEvents.length;i<len;i++){
			this.addEventListener(this.tipHideEvents[i],this.hideHandler,this,true);
		}
	},
	showTip:function(){
		if(this.mode == 'anchor'){
			(function(){
				this.show();
				if(this.__layoutChanged == true){
					this.refreshLayout_ToolTip();
					this.__layoutChanged = false;
				}
				var overflow;
				if(this.tipPosition == 'top' || this.tipPosition == 'bottom'  || this.tipPosition == 'left' || this.tipPosition == 'right'){
					this.adjustAnchorTooltipPosition_ToolTip(this.tipPosition);
				}else if(this.tipPosition == 'vertical'){
					overflow = this.adjustAnchorTooltipPosition_ToolTip('top');
					if(overflow){
						this.adjustAnchorTooltipPosition_ToolTip('bottom');
					}
				}else if(this.tipPosition == 'horizontal'){
					overflow = this.adjustAnchorTooltipPosition_ToolTip('left');
					if(overflow){
						this.adjustAnchorTooltipPosition_ToolTip('right');
					}
				}
			}).call(this);
			return;
		}
		
		if(!this.lastPos)return;
		
		this.show();
		if(this.__layoutChanged == true){
			this.refreshLayout_ToolTip();
			this.__layoutChanged = false;
		}
		var x = this.lastPos[0];
		var y = this.lastPos[1];

		var windowSize = [Alipw.getWin().width(),Alipw.getWin().height()];
		
		var maxX = windowSize[0] + Alipw.getWin().scrollLeft() - 5;
		var maxY = windowSize[1] + Alipw.getWin().scrollTop() - 5;
		if(x + this.el.outerWidth() > maxX){
			x = maxX - this.el.outerWidth();
		}
		
		if(y + this.el.outerHeight() > maxY){
			y = maxY - this.el.outerHeight();
		}
		
		if(x < 0)x = 0;
		if(y < 0)y = 0;
		
		this.setPosition(x,y);
		Alipw.ComponentManager.bringToFront(this);
	},
	/**
	 * @public
	 * @description 设置或重新设置ToolTip内容，并重新渲染布局。
	 * @param {String} html 要设置的HTML字符串。
	 */
	setHtml:function(html){
		this.html = html;
		if(this.rendered){
			this.getBody().html(html);
		}
		this.refreshLayout();
	},
	refreshLayout:function(){
		if(this.visible && this.rendered){
			this.__layoutChanged = true;
			this.showTip();
		}else{
			this.__layoutChanged = true;
		}
	},
	//private
	//return {Boolean} whether the tip overflows the visual area
	adjustAnchorTooltipPosition_ToolTip:function(type){
		var wrap = this.el.find('.' + this.baseCls + '-wrap');
		
		if(type == 'top' || type == 'bottom' || type == 'left' || type == 'right'){
			wrap.removeClass(this.baseCls + '-anchormode-top');
			wrap.removeClass(this.baseCls + '-anchormode-bottom');
			wrap.removeClass(this.baseCls + '-anchormode-left');
			wrap.removeClass(this.baseCls + '-anchormode-right');
			wrap.addClass(this.baseCls + '-anchormode-' + type);
		}
		
		var overflow = false,x,y,rectification,anchorOffset;
		var targetPos = this.targetEl.offset();
		var targetWidth = this.targetEl.outerWidth();
		var targetHeight = this.targetEl.outerHeight();
		var tipWidth = this.getWidth();
		var tipHeight = this.getHeight();
		var winWidth = Alipw.getWin().width();
		var winHeight = Alipw.getWin().height();
		var scrollLeft = Alipw.getWin().scrollLeft();
		var scrollTop = Alipw.getWin().scrollTop();
		var minX = 10 + scrollLeft;
		var maxX = scrollLeft + winWidth - tipWidth - 10;
		var minY = 10 + scrollTop;
		var maxY = scrollTop + winHeight - tipHeight - 10;
		var arrow = this.el.find('.' + this.baseCls + '-arrow');
		
		arrow.css({'left':'',top:''});

		if(type == 'top'){
			x = targetPos.left + parseInt((targetWidth - tipWidth)/2);
			y = targetPos.top - tipHeight - this.offsetAnchor;
			
			if(x < minX){
				rectification = x - minX;
				x = minX;
				anchorOffset = parseInt(tipWidth/2) + rectification;
				if(anchorOffset < 10){
					anchorOffset = 10;
				}
				arrow.css('left',anchorOffset + 'px');
			}else if(x > maxX){
				rectification = x - maxX;
				x = maxX;
				anchorOffset = parseInt(tipWidth/2) + rectification;
				if(anchorOffset < 10){
					anchorOffset = 10;
				}
				arrow.css('left',anchorOffset + 'px');
			}
			
			if(y < minY){
				overflow = true;
			}
			
		}else if(type == 'bottom'){
			x = targetPos.left + parseInt((targetWidth - tipWidth)/2);
			y = targetPos.top + targetHeight + this.offsetAnchor;
			if(x < minX){
				rectification = x - minX;
				x = minX;
				anchorOffset = parseInt(tipWidth/2) + rectification;
				if(anchorOffset < 10){
					anchorOffset = 10;
				}
				arrow.css('left',anchorOffset + 'px');
			}else if(x > maxX){
				rectification = x - maxX;
				x = maxX;
				anchorOffset = parseInt(tipWidth/2) + rectification;
				if(anchorOffset < 10){
					anchorOffset = 10;
				}
				arrow.css('left',anchorOffset + 'px');
			}
			
			if(y > maxY){
				overflow = true;
			}
			
		}else if(type == 'left'){
			x = targetPos.left - tipWidth - this.offsetAnchor;
			y = targetPos.top + parseInt((targetHeight - tipHeight)/2);
			
			if(y < minY){
				rectification = y - minY;
				y = minY;
				anchorOffset = parseInt(tipHeight/2) + rectification;
				if(anchorOffset < 10){
					anchorOffset = 10;
				}
				arrow.css('top',anchorOffset + 'px');
			}else if(y > maxY){
				rectification = y - maxY;
				y = maxY;
				anchorOffset = parseInt(tipHeight/2) + rectification;
				if(anchorOffset < 10){
					anchorOffset = 10;
				}
				arrow.css('top',anchorOffset + 'px');
			}
			
			if(x < minX){
				overflow = true;
			}
		}else if(type == 'right'){
			x = targetPos.left + targetWidth + this.offsetAnchor;
			y = targetPos.top + parseInt((targetHeight - tipHeight)/2);
			
			if(y < minY){
				rectification = y - minY;
				y = minY;
				anchorOffset = parseInt(tipHeight/2) + rectification;
				if(anchorOffset < 10){
					anchorOffset = 10;
				}
				arrow.css('top',anchorOffset + 'px');
			}else if(y > maxY){
				rectification = y - maxY;
				y = maxY;
				anchorOffset = parseInt(tipHeight/2) + rectification;
				if(anchorOffset < 10){
					anchorOffset = 10;
				}
				arrow.css('top',anchorOffset + 'px');
			}
			
			if(x > maxX){
				overflow = true;
			}
		}
		this.setPosition(x,y);
		
		return overflow;
	},
	//private
	refreshLayout_ToolTip:function(){
		this.width = null;
		var body = this.getBody();
		body.css({
			'width':'',
			'height':''
		});
		this.el.css({
			'width':'',
			'height':''
		});
		this.doLayout();
		this.fireEvent('resize');
	},
	//protected
	_doLayout:function(){
		if(this.textMaxWidth){
			var body = this.getBody();
			body.css("white-space","nowrap");
			if(this.textMaxWidth < body.width()){
				this.width = this.getWidthByBody(this.textMaxWidth);
			}
			body.css("white-space","");
		}
		
		Alipw.ToolTip.superclass._doLayout.apply(this,arguments);
	},
	//private
	showHandler:function(e){		
		clearTimeout(this.hideDelayTimer);
		clearTimeout(this.showDelayTimer);
		if(this.visible && this.rendered){
			return;
		}
		this.updateTipPos(e);
		this.showDelayTimer = setTimeout(jQuery.proxy(this.showTip,this),this.showDelay * 1000);
	},
	//private
	hideHandler:function(e){
		clearTimeout(this.showDelayTimer);
		clearTimeout(this.hideDelayTimer);
		if(this.rendered){
			this.hideDelayTimer = setTimeout(jQuery.proxy(this.hide,this),this.hideDelay * 1000);
		}
	},
	//private
	updateTipPos:function(e){
		this.lastPos = [e.pageX + this.offsetX,e.pageY + this.offsetY];
	}
});