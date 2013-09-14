/**
 * @constructor Alipw.Template
 * @extends Alipw.Nonvisual
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 模板。用于创建HTML模板，并方便地进行数据替换。
 */

Alipw.Template = Alipw.extend(Alipw.Nonvisual,
/** @lends Alipw.Template.prototype */
{
	constructor:function(){
		Alipw.Template.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Template.superclass.commitProperties.apply(this,arguments);
		if(typeof(this.config) == "string"){
			this.html = this.config;
		}else if(this.config instanceof Array){
			this.html = this.config.join("");
		}
	},
	initialize:function(){
		Alipw.Template.superclass.initialize.apply(this,arguments);
	},
	set:function(o){
		for(var i in o){
			var exp = new RegExp("\\{\\$" + i + "\\}","g");
			this.html = this.html.replace(exp,o[i]);
		}
		
		return this;
	},
	compile:function(){
		this.el = jQuery(this.html);
		return this.el;
	}
});