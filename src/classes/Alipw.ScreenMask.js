/**
 * @constructor Alipw.ScreenMask
 * @extends Alipw.FixedWrapper
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 屏幕遮罩。一个半透明的屏幕遮罩，通常用于模态效果。
 * @demo http://aliyun-ued.com/alipw/samples/screenMask.html
 */

Alipw.ScreenMask = Alipw.extend(Alipw.FixedWrapper,
/** @lends Alipw.ScreenMask.prototype */
{
	baseCls:"alipw-screenMask",
	opacity:0.5,
	constructor:function(){
		Alipw.ScreenMask.superclass.constructor.apply(this,arguments);
	},
	initialize:function(){
		Alipw.ScreenMask.superclass.initialize.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.ScreenMask.superclass.commitProperties.apply(this,arguments);
	},
	createDom:function(){
		Alipw.ScreenMask.superclass.createDom.apply(this,arguments);
	},
	renderComplete:function(){
		Alipw.ScreenMask.superclass.renderComplete.apply(this,arguments);
		this.setOpacity(this.opacity);
	},
	setOpacity:function(opacity){
		this.el.css("opacity",opacity);
	},
	remove:function(){
		Alipw.ScreenMask.superclass.remove.apply(this,arguments);
	}
});