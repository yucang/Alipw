/**
 * @constructor Alipw.Container
 * @extends Alipw.BoxComponent
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 容器，容器型可视控件的基类。容器型可视控件是指用于显示其它内容的控件。如：Panel,Window等。
 * @demo http://aliyun-ued.com/alipw/samples/container.html
 * @example
 * 
 */

Alipw.Container = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.Container.prototype */
{
	/**
	 * @property
	 * @type String
	 * @default ''
	 * @description 显示在内容区域的HTML代码
	 * */
	html:"",
	constructor:function(){
		Alipw.Container.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Container.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.Container.superclass.initialize.apply(this,arguments);
		this.items = new Array();
	},
	createDom:function(){
		Alipw.Container.superclass.createDom.apply(this,arguments);
	},
	renderComplete:function(){
		Alipw.Container.superclass.renderComplete.apply(this,arguments);
		if(this.html){
			this.appendChild(this.html);
		}
	},
	/**
	 * @public
	 * @param {HTML Element/Alipw.Component} o 需要被插入的对象
	 * @param {Boolean} updateLayout 需要被插入的对象
	 * @description 向容器中插入指定的HTML元素或Component实例
	 * */
	appendChild:function(o,updateLayout){
		if(!Alipw.isSet(updateLayout)){
			updateLayout = true;
		}
		
		var body = this.getBody();
		if(o instanceof Alipw.Component){
			body.append(o.el);
			this.items.push(o);
			o.parentContainer = this;
		}else{
			body.append(o);
		}
		if(updateLayout){
			this.doLayout();
		}
	},
	/**
	 * @public
	 * @param {HTML Element/Alipw.Component} o 需要被移除的对象
	 * @description 从容器中移除指定的HTML元素或Component实例
	 * */
	removeChild:function(o,updateLayout){
		if(!Alipw.isSet(updateLayout)){
			updateLayout = true;
		}
		var body = this.getBody();
		if(o instanceof Alipw.Component){
			o.remove();
			o.parentContainer = null;
			Alipw.removeItemFromArray(o,this.items);
		}else{
			jQuery(o).detach();
		}
		if(updateLayout){
			this.doLayout();
		}
	},
	/**
	 * @public
	 * @description 获取当前容器用于包含其它内容的HTML节点。
	 * @return {jQuery Object} jQuery HTML元素对象
	 * */
	getBody:function(){
		return this.el;
	},
	scrollX:function(length){
		var container = this.getBody();
		
		container.scrollTop(container.scrollLeft() + length); 
	},
	scrollY:function(length){
		var container = this.getBody();
		
		container.scrollTop(container.scrollTop() + length); 
	}
});