/**
 * @constructor Alipw.Validator
 * @extends Alipw.BoxComponent
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 表单验证工具。
 * @example
 * var validator = new Alipw.Validator({
 *	target:"textbox",
 *	msgPosition:"right",
 *	conditions:[{
 *		exp:"abc",
 *		errorMsg:"requires 'abc'",
 *	},{
 *		exp:"rainy",
 *		errorMsg:"requires 'rainy'",
 *	}],
 *	correctMsg:"correct string!",
 *	triggerEvents:["keyup","blur"]
 *});
 * 
 */

Alipw.Validator = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.Validator.prototype */
{
	zIndex:100,
	/**
	 * @property
	 * @type Array
	 * */
	conditions:null,
	/**
	 * @property
	 * */
	correctMsg:"Correct!",
	/**
	 * @property
	 * @description the position of the message box. defaults to "right". this configure is invalid only when the renderTo is not set.
	 * */
	msgPosition:"right",
	/**
	 * @property
	 * @description the target which is validated
	 * */
	target:null,
	/**
	 * @property
	 * @description 
	 * */
	targetAttr:"value",
	/**
	 * @property
	 * @description the event that fires the validation
	 * */
	triggerEvents:"change",
	baseCls:"alipw-validator",
	/**
	 * @property
	 * @description defaults to false
	 * */
	autoRender:false,
	/**
	 * @property
	 * @description [read only] tells if the specific value passed the validation
	 * */
	success:false,
	isPending:false,
	pendingIndex:null,
	constructor:function(){
		Alipw.Validator.superclass.constructor.apply(this,arguments);
	},
	initialize:function(){
		Alipw.Validator.superclass.initialize.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Validator.superclass.commitProperties.apply(this,arguments);
		
		this.targetEl = Alipw.convertEl(this.target);
		
		if(typeof(this.triggerEvents)=="string"){
			this.triggerEvents = [this.triggerEvents];
		}
		
		for(var i=0,len=this.triggerEvents.length;i<len;i++){
			this.targetEl.bind(this.triggerEvents[i],jQuery.proxy(this.validate,this));
		}
	},
	createDom:function(){
		Alipw.Validator.superclass.createDom.apply(this,arguments);
		var msgBoxHTML = ['<div class="' + this.baseCls + '-wrap">',
		                  	'<div class="' + this.baseCls + '-errorMsg"></div>',
		                  	'<div class="' + this.baseCls + '-correctMsg">' + this.correctMsg + '</div>',
		                  	'<div class="' + this.baseCls + '-pendingMsg"></div>',
		                  '</div>'].join("");
		this.el.append(msgBoxHTML);
	},
	renderComplete:function(){
		Alipw.Validator.superclass.renderComplete.apply(this,arguments);
		
		if(!this.renderTo){
			this.el.css("position","absolute");
			$(window).bind("resize",jQuery.proxy(this.setPosition_Validator,this));
		}
	},
	/**
	 * @public
	 * @description validate the target
	 * @return Boolean isValid
	 * */
	validate:function(){
		if(this.isPending){
			return this.success;
		}
		
		if(!this.rendered){
			this.render();
		}
		this.setVisible(true);
		if(!this.renderTo){
			this.setPosition_Validator();
		}
		
		var wrap = this.el.find("." + this.baseCls + "-wrap");
		
		
		var isCorrect = true;
		var i = 0, len = this.conditions.length;
		if(Alipw.isSet(this.pendingIndex)){
			i = this.pendingIndex + 1;
		}
		
		var faildFn = function(i){
			this.isPending = false;
			wrap.removeClass(this.baseCls + "-wrap-correct");
			wrap.removeClass(this.baseCls + "-wrap-pending");
			wrap.addClass(this.baseCls + "-wrap-error");
			
			this.el.find("." + this.baseCls + "-errorMsg").html(this.conditions[i].errorMsg);
			isCorrect = false;
			this.pendingIndex = null;
			this.success = false;
			
			this.fireEvent('validateComplete',{},false);
		};
		for(i;i<len;i++){
			//for expression validation
			if(this.conditions[i].exp){
				if(!this.targetEl.attr(this.targetAttr).match(this.conditions[i].exp)){
					wrap.removeClass(this.baseCls + "-wrap-correct");
					wrap.removeClass(this.baseCls + "-wrap-pending");
					wrap.addClass(this.baseCls + "-wrap-error");
					
					this.el.find("." + this.baseCls + "-errorMsg").html(this.conditions[i].errorMsg);
					isCorrect = false;
					break;
				}
			//for remote validation
			}else if(this.conditions[i].url && this.conditions[i].fn){
				this.isPending = true;
				this.pendingIndex = i;
				this.success = 'validating';
				wrap.removeClass(this.baseCls + "-wrap-correct");
				wrap.removeClass(this.baseCls + "-wrap-error");
				wrap.addClass(this.baseCls + "-wrap-pending");
				this.el.find("." + this.baseCls + "-pendingMsg").html(this.conditions[i].pendingMsg || '');
				
				var valueParam = this.conditions[i].valueParamName || 'value';
				var ajaxData = new Object();
				ajaxData[valueParam] = this.targetEl.attr(this.targetAttr);
				jQuery.ajax({
					url:this.conditions[i].url,
					method:this.conditions[i].method || 'GET',
					data:ajaxData,
					success:jQuery.proxy(function(response){
						this.isPending = false;
						if(this.conditions[i].fn.call(this.conditions[i],response) == false){
							faildFn.call(this,i);
						}else{
							this.validate();
						}
					},this),
					error:jQuery.proxy(function(){
						faildFn.call(this,i);
					},this)
				});
				return this.success;
			}
		}
		
		this.pendingIndex = null;
		if(isCorrect){
			wrap.removeClass(this.baseCls + "-wrap-pending");
			wrap.removeClass(this.baseCls + "-wrap-error");
			wrap.addClass(this.baseCls + "-wrap-correct");
			this.el.find("." + this.baseCls + "-correctMsg").html(this.correctMsg);
			this.success = true;
		}else{
			this.success = false;
		};
		
		this.fireEvent('validateComplete',{},false);
		return this.success;
	},
	/**
	 * @public
	 * @description reset the validator
	 * */
	reset:function(){
		this.success = false;
		var wrap = this.el.find("." + this.baseCls + "-wrap");
		wrap.removeClass(this.baseCls + "-wrap-error");
		wrap.removeClass(this.baseCls + "-wrap-correct");
		this.setVisible(false);
	},
	//private
	setPosition_Validator:function(){
		var x,y;
		var targPos = this.targetEl.offset();		
		
		if(this.msgPosition == "top"){
			x = targPos.left;
			y = targPos.top - this.el.outerHeight();
		}else if (this.msgPosition == "right"){
			x = targPos.left + this.targetEl.outerWidth();
			y = targPos.top;
		}else if(this.msgPosition == "bottom"){
			x = targPos.left;
			y = targPos.top + this.targetEl.outerHeight();
		}else if(this.msgPosition == "left"){
			x = targPos.left - this.el.outerWidth();
			y = targPos.top;
		}
		
		this.el.css({
			left:x+ "px",
			top:y + "px"
		});
	}
});