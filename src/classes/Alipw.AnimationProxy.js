/**
 * @constructor Alipw.AnimationProxy
 * @extends Alipw.BoxComponent
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 动画代理对象。当需要展示一个表现两种状态动态变化的动画表现时，可使用动画代理对象。例如：窗口最小化时表示窗口缩小至任务栏的动画效果。
 * @example
 * 
 */

Alipw.AnimationProxy = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.AnimationProxy.prototype */
{
	/**
	 * @property
	 * @default 'alipw-animationproxy'
	 * @type String
	 * @description [config option]定义基础CSS类名。
	 */
	baseCls:'alipw-animationproxy',
	constructor:function(){
		Alipw.AnimationProxy.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.AnimationProxy.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.AnimationProxy.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.AnimationProxy.superclass.createDom.apply(this,arguments);
		this.setVisible(false);
	},
	renderComplete:function(){
		Alipw.AnimationProxy.superclass.renderComplete.apply(this,arguments);
	},
	//protected
	_doLayout:function(){
		Alipw.AnimationProxy.superclass._doLayout.apply(this,arguments);
	},
	/**
	 * @public
	 * @description 开始动画。
	 * @param {Array/HTML Node/HTML Selector} objectFrom 动画对象的起始状态。当其为Array时，其必须包含4个元素，依次是横坐标、纵坐标、宽，高。当其为HTML Node或HTML selector时，会自动计算指定节点对象或第一个匹配指定的HTML Selector节点的坐标和尺寸。
	 * @param {Array/HTML Node/HTML Selector} objectTo 动画对象的结束状态。当其为Array时，其必须包含4个元素，依次是横坐标、纵坐标、宽，高。当其为HTML Node或HTML selector时，会自动计算指定节点对象或第一个匹配指定的HTML Selector节点的坐标和尺寸。
	 * @param {Number} opacityFrom 动画对象的起始透明度。
	 * @param {Number} opacityTo 动画对象的结束透明度。
	 * @param {Number} duration 动画对象的动画运行时间。
	 * @param {Function} onComplete 动画对象运动结束后的回调函数。
	 */
	animate:function(objectFrom,objectTo,opacityFrom,opacityTo,duration,onComplete){
		var from = new Object();
		var to = new Object();
		
		var rectFrom = this.convertObjectToRect_AnimationProxy(objectFrom);
		from.width = rectFrom[2];
		from.height = rectFrom[3];
		from.left = rectFrom[0];
		from.top = rectFrom[1];
		from.opacity = opacityFrom;
		
		var rectTo = this.convertObjectToRect_AnimationProxy(objectTo);
		to.width = rectTo[2];
		to.height = rectTo[3];
		to.left = rectTo[0];
		to.top = rectTo[1];
		to.opacity = opacityTo;
		
		this.el.stop();
		this.setVisible(true);
		this.el.css({
			width:from.width + 'px',
			height:from.height + 'px',
			left:from.left + 'px',
			top:from.top + 'px',
			opacity:from.opacity
		});
		
		var _this = this;
		this.el.animate(to,duration,null,function(){
			_this.setVisible(false);
			if(onComplete instanceof Function){
				onComplete.call();
			}
		});
	},
	//private
	convertObjectToRect_AnimationProxy:function(obj){
		if(obj instanceof Alipw.Component){
			var offset = obj.el.offset();
			return [offset.left,offset.top,obj.el.outerWidth(),obj.el.outerHeight()];
		}else if(obj instanceof jQuery || obj.nodeType == 1 || obj.nodeType == 9){
			var el = jQuery(obj);
			var offset = el.offset();
			return [offset.left,offset.top,el.outerWidth(),el.outerHeight()];
		}else if(obj instanceof Array){
			return obj;
		}
	}
});