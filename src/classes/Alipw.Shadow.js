/**
 * @constructor Alipw.Shadow
 * @extends Alipw.BoxComponent
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 阴影。应用于盒状的可视控件使其具有阴影效果。
 * @example
 * 
 */

Alipw.Shadow = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.Shadow.prototype */
{
	floating:true,
	/*
	 * sides : Shadow displays on both sides and bottom only
 	 * frame : Shadow displays equally on all four sides
	 * drop : Traditional bottom-right drop shadow
	 * */
	mode:"drop",
	target:null,
	floatingManagement:false,
	baseCls:"alipw-shadow",
	constructor:function(config){
		Alipw.Shadow.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Shadow.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.Shadow.superclass.initialize.apply(this,arguments);		
	},
	createDom:function(){
		Alipw.Shadow.superclass.createDom.apply(this,arguments);
		
		if(Alipw.ie() && parseInt(Alipw.ie())<7){
			this.el.attr("class","alipw-ie-shadow");
		}else{
			this.el.append([
				'<div class="xst">',
				'<div class="xstl"></div>',
				'<div class="xstc"></div>',
				'<div class="xstr"></div>',
				'</div>',
				'<div class="xsc">',
				'<div class="xsml"></div>',
				'<div class="xsmc"></div>',
				'<div class="xsmr"></div>',
				'</div>',
				'<div class="xsb">',
				'<div class="xsbl"></div>',
				'<div class="xsbc"></div>',
				'<div class="xsbr"></div>',
				'</div>'
			].join(""));
		}
		
		if(this.target instanceof Alipw.BoxComponent){
			var applyToElement = Alipw.createFuncProxy(this.applyToElement,this);
			
			this.target.addEventListener("resize",applyToElement);
			this.target.addEventListener("move",applyToElement);
			this.target.addEventListener("visibilityChange",applyToElement);
			this.target.addEventListener("afterRemove",applyToElement);
			this.target.addEventListener("afterRender",applyToElement);
			
			this.addEventListener('destroy',function(){
				this.target.removeEventListener("resize",applyToElement);
				this.target.removeEventListener("move",applyToElement);
				this.target.removeEventListener("visibilityChange",applyToElement);
				this.target.removeEventListener("afterRemove",applyToElement);
				this.target.removeEventListener("afterRender",applyToElement);
			},this);
		}
	},
	render:function(o){
		Alipw.Shadow.superclass.render.apply(this,arguments);
		if(this.target){
			this.applyToElement();
		}
	},
	renderComplete:function(){
		Alipw.Shadow.superclass.renderComplete.apply(this,arguments);
	},
	//protected
	_doLayout:function(){
		Alipw.Shadow.superclass._doLayout.apply(this,arguments);
		if(!(Alipw.ie() && parseInt(Alipw.ie())<7)){
			if(this.width){
				if(this.width<12){
					this.width = 12;
				}
				this.el.find(".xstc").width(this.width - 12);
				this.el.find(".xsmc").width(this.width - 12);
				this.el.find(".xsbc").width(this.width - 12);
			}
			if(this.height){
				if(this.height<12){
					this.height = 12;
				}
				this.el.find(".xsc").height(this.height - 12);
			}
		}else{
			this.el.width(this.width - 9);
			this.el.height(this.height - 9);
		}
	},
	enable:function(){
		Alipw.Shadow.superclass.enable.apply(this,arguments);
		this.setVisible(true);
		this.applyToElement();
	},
	disable:function(){
		Alipw.Shadow.superclass.disable.apply(this,arguments);
		this.setVisible(false);
	},
	applyToElement:function(e){
		var o = this.target;
		//var shadowHorEdge = parseInt(Alipw.ie())<7?0:5;
		//var shadowVerEdge = parseInt(Alipw.ie())<7?0:4;
		if(o instanceof Alipw.BoxComponent && o.floating){
			var deltaX,deltaY,deltaW,deltaH;
			if(this.mode == "drop"){
				deltaX = deltaY = -3;
				deltaW = deltaH = 8; 
			}else if(this.mode == "frame"){
				deltaX = deltaY = -5;
				deltaW = deltaH = 10; 
			}else if(this.mode == "sides"){
				deltaX = -5;
				deltaY = -3;
				deltaW = 10;
				deltaH = 8;
			}
			
			this.setWidth(o.getWidth() + deltaW);
			this.setHeight(o.getHeight() + deltaH);
			
			this.setPosition(o.getX() + deltaX, o.getY() + deltaY, o.getZIndex() - 1, true, false);
			
			if(this.enabled){
				var visible;
				if(o.removed){
					visible = false;
				}else{
					visible = o.visible;
				}
				this.setVisible(visible);
			}else{
				this.setVisible(false);
			}
		}
	}
});