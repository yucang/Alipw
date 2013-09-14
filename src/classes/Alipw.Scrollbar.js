/**
 * @constructor Alipw.Scrollbar
 * @extends Alipw.Slider
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 滚动条。应用与Alipw.Container或者普通的HTML容器，替代浏览器自带的滚动条。
 * @demo http://aliyun-ued.com/alipw/samples/scrollbar.html
 * @example
 * 
 */

Alipw.Scrollbar = Alipw.extend(Alipw.Slider,
/** @lends Alipw.Scrollbar.prototype */
{
	subCls:"alipw-scrollbar",
	target:null,
	mouseWheelDelta:120,
	width:0,
	showFill:false,
	tween:false,
	constructor:function(){
		Alipw.Scrollbar.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Scrollbar.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.Scrollbar.superclass.initialize.apply(this,arguments);
		if(this.target){
			if(this.target instanceof Alipw.Container){
				
			}else{
				this._targetEl = Alipw.convertEl(this.target);
				this.renderTo = this._targetEl;
				
				if(this._targetEl[0]){
					this._targetEl.css("overflow","hidden");
					
					var allChildNodes = this._targetEl.contents();
					for(var i=0,len=allChildNodes.length;i<len;i++){
						if(allChildNodes[i].className && allChildNodes[i].className.indexOf("alipw-scrollbar-container") != -1){
							this._container = jQuery(allChildNodes[i]);
							allChildNodes.splice(i,1);
							len=allChildNodes.length;
							i--;
							continue;
						}
						
						if(allChildNodes[i].className && allChildNodes[i].className.indexOf("alipw-scrollbar") != -1){
							allChildNodes.splice(i,1);
							len=allChildNodes.length;
							i--;
							continue;
						}
					}
					
					if(!this._container){
						this._container = jQuery('<div class="alipw-scrollbar-container"></div>');
						this._targetEl.append(this._container);
					}
					this._container.append(allChildNodes);
				}
			}
		}
	},
	createDom:function(){
		Alipw.Scrollbar.superclass.createDom.apply(this,arguments);
	},
	renderComplete:function(){
		Alipw.Scrollbar.superclass.renderComplete.apply(this,arguments);
		if(this.type == "vertical"){
			this.el.css({
				right:"0",
				top:"0"
			});
		}else{
			this.el.css({
				bottom:"0",
				left:"0"
			});
		}
		
		this.addEventListener('valueChange',this.scrollHandler_Scrollbar,this);
		
		if(jQuery.browser.mozilla){
			this._targetEl.bind("DOMMouseScroll",jQuery.proxy(function(e){
				
				var d = - e.detail / 3;
				this.mouseWheelHandler_Scrollbar(e,d);
			},this));
		}else{
			this._targetEl.bind("mousewheel",jQuery.proxy(function(e){
				
				var d;
				if(e.wheelDelta){
					d = e.wheelDelta / 120;
				}else if(e.detail){
					d = e.detail / 3;
				}
				this.mouseWheelHandler_Scrollbar(e,d);
			},this));
		}
	},
	disable:function(){
		Alipw.Scrollbar.superclass.disable.apply(this,arguments);
		this._container.css('height','auto');
		this.setVisible(false);
	},
	enable:function(){
		Alipw.Scrollbar.superclass.enable.apply(this,arguments);
		this.setVisible(true);
		this.doLayout();
	},
	//protected
	_doLayout:function(){
		if(!this._targetEl || !this._targetEl[0]){
			return;
		}
		this.refreshContents_Scrollbar();
		this.refreshScrollbar_Scrollbar();
		
		Alipw.Scrollbar.superclass._doLayout.apply(this,arguments);
	},
	//private
	mouseWheelHandler_Scrollbar:function(e,delta){
		if(this.type != "vertical" || !this.visible){
			return;
		}
		
		e.stopPropagation();
		e.preventDefault();
		this.setValue(this.value + (-delta) * this.mouseWheelDelta);
	},
	//private
	refreshContents_Scrollbar:function(){
		//add new appended nodes to the scroll container
		var allChildNodes = this._targetEl.contents();
		for(var i=0,len=allChildNodes.length;i<len;i++){
			if(allChildNodes[i].className && allChildNodes[i].className.indexOf("alipw-scrollbar") != -1){
				allChildNodes.splice(i,1);
				len=allChildNodes.length;
				i--;
				continue;
			}
		}
		if(allChildNodes.length > 0){
			this._container.append(allChildNodes);
		}
	},
	//private
	refreshScrollbar_Scrollbar:function(){
		var pb = parseInt(this._container.css("padding-bottom"));
		this._container.height(this._targetEl.height() - pb);
		
		var pr = parseInt(this._container.css("padding-right"));
		this._container.width(this._targetEl.width() - pr);
		
		var sh = this._container[0].scrollHeight;
		var h = this._container.height();
		var sw = this._container[0].scrollWidth;
		var w = this._container.width();
		
		
		this.setVisible(true);
		if(this.type == "vertical"){
			if(sh > h){
				this.width = this._targetEl.innerHeight();
				if(this._targetEl.css("position") == "static"){
					this._targetEl.css("position","relative");
				}

				this._block.setHeight((h / sh) * this.width);
				this.maxValue = sh - h;
				
				this._container.css("padding-right",this.el.outerWidth() + "px");
				this._container.width(this._targetEl.width() - this.el.outerWidth());
			}else{
				this._container.css("padding-right","0");
				this._container.width(this._targetEl.width());
				
				//IE6,7 bug
				if(jQuery.browser.msie){
					this.setVisible(false,true);
				}else{
					this.setVisible(false);
				}
			}
		}else{
			if(sw > w){
				this.width = this._targetEl.innerWidth();
				if(this._targetEl.css("position") == "static"){
					this._targetEl.css("position","relative");
				}
				
				this._block.width((w / sw) * this.width);
				this.maxValue = sw - w;
				
				this._container.css("padding-bottom",this.el.outerHeight() + "px");
				this._container.height(this._targetEl.height() - this.el.outerHeight());
			}else{
				this._container.css("padding-bottom","0");
				this._container.height(this._targetEl.height());
				
				//IE6,7 bug
				if(jQuery.browser.msie){
					this.setVisible(false,true);
				}else{
					this.setVisible(false);
				}
			}
		}
		
		this.setValue(this.value);
	},
	//private
	scrollHandler_Scrollbar:function(e){
		if(this._targetEl && this._targetEl[0]){
			if(this.type == "vertical"){
				if(this.tween){
					this._container.stop();
					this._container.animate({
						scrollTop:parseInt(e.value)
					},800,"easeOutExpo");
				}else{
					this._container[0].scrollTop = parseInt(e.value);
				}
			}else{
				if(this.tween){
					this._container.stop();
					this._container.animate({
						scrollLeft:parseInt(e.value)
					},800,"easeOutExpo");
				}else{
					this._container[0].scrollLeft = parseInt(e.value);
				}
			}
		}
	}
});