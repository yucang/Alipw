/**
 * @constructor Alipw.ToolTip
 * @extends Alipw.BorderContainer
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 浮动的消息提示。
 * @demo http://aliyun-ued.com/alipw/samples/tooltip.html
 * @example
 * 
 */

Alipw.ToolTip = Alipw.extend(Alipw.BorderContainer,
/** @lends Alipw.ToolTip.prototype */
{
	html:"",
	target:null,
	showDelay:0.5,
	hideDelay:0.2,
	position:"auto",
	floating:true,
	showShadow:true,
	textMaxWidth:300,
	offsetX:0,
	offsetY:20,
	/**
	 * @property
	 * @description 使该ToolTip显示的事件。默认为['mouseover']
	 * */
	triggerEvents:["mouseover"],
	hideEvents:["mouseout"],
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
	},
	renderComplete:function(){
		Alipw.ToolTip.superclass.renderComplete.apply(this,arguments);
		
		this.addEventListener("mouseover",this.showHandler,this,true);
		this.addEventListener("mouseout",this.hideHandler,this,true);
	},
	showTip:function(){
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
		if(this.visible && this.rendered){
			this.refreshLayout_ToolTip();
		}else{
			this.__layoutChanged = true;
		}
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