/**
 * @constructor
 * @extends Alipw.BoxComponent
 */

Alipw.FixedWrapper = Alipw.extend(Alipw.Container,
/** @lends Alipw.FixedWrapper.prototype */
{
	floating:true,
	baseCls:"alipw-fixedWrapper",
	constructor:function(){
		Alipw.FixedWrapper.superclass.constructor.apply(this,arguments);
	},
	initialize:function(){
		Alipw.FixedWrapper.superclass.initialize.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.FixedWrapper.superclass.commitProperties.apply(this,arguments);
	},
	createDom:function(){
		Alipw.FixedWrapper.superclass.createDom.apply(this,arguments);
		this.el.append(['<div class="' + this.baseCls + '-innerWrap"></div>'].join(""));
	},
	renderComplete:function(){
		Alipw.FixedWrapper.superclass.renderComplete.apply(this,arguments);
		
		if(Alipw.useShims == true && Alipw.isIE6){
			this.shim = $(['<iframe frameborder="0" class="' + this.baseCls + '-shim"></iframe>'].join(""));
			Alipw.getBody().append(this.shim);
		}
		
		var resizeHandler = Alipw.createFuncProxy(this.resizeHandler_FixedWrapper,this);
		var scrollHandler = Alipw.createFuncProxy(this.scrollHandler_FixedWrapper,this);
		jQuery(window).bind("resize",resizeHandler);
		jQuery(window).bind("scroll",scrollHandler);
		this.addEventListener('destroy',function(e){
			jQuery(window).unbind('resize',resizeHandler);
			jQuery(window).unbind('scroll',scrollHandler);
			if(this.shim){
				this.shim.remove();
				this.shim = null;
			}
		},this);
		
		this.resizeHandler_FixedWrapper();
		this.scrollHandler_FixedWrapper();
	},
	remove:function(){
		Alipw.FixedWrapper.superclass.remove.apply(this,arguments);
	},
	getBody:function(){
		return this.el.find("." + this.baseCls + "-innerWrap");
	},
	//private
	resizeHandler_FixedWrapper:function(){
		if(Alipw.isIE6){
			var winWidth = jQuery(window).width();
			var winHeight = jQuery(window).height();
			this.setWidth(winWidth);
			this.setHeight(winHeight);
			if(this.shim){
				this.shim.attr({
					'width':winWidth,
					'height':winHeight
				});
				this.shim.css({
					'width':winWidth + 'px',
					'height':winHeight + 'px'
				});
			}
		}
	},
	//private
	scrollHandler_FixedWrapper:function(){
		if(Alipw.isIE6){
			var scrollLeft = jQuery(document).scrollLeft();
			var scrollTop = jQuery(document).scrollTop();
			
			this.el.css({
				left:scrollLeft + "px",
				top:scrollTop + "px"
			});
			
			if(this.shim){
				this.shim.css({
					left:scrollLeft + "px",
					top:scrollTop + "px"
				});
			}
		}
	}
});