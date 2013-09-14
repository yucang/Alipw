/**
 * @constructor Alipw.ValidatorGroup
 * @extends Alipw.Nonvisual
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 表单验证工具组。
 */

Alipw.ValidatorGroup = Alipw.extend(Alipw.Nonvisual,
/** @lends Alipw.ValidatorGroup.prototype */
{
	validators:[],
	success:false,
	commitProperties:function(){
		Alipw.ValidatorGroup.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.ValidatorGroup.superclass.initialize.apply(this,arguments);
		
		this.validatorItems = new Array();
		this.validatorStatus = new Object();
		
		Alipw.each(this.validators,function(i,config){
			var validator = new Alipw.Validator(config);
			validator.addEventListener('validateComplete',this.validateCompleteHandler_ValidatorGroup,this);
			this.validatorStatus[validator.id] = '';
			this.validatorItems.push(validator);
		},this);
	},
	validate:function(){
		if(this.validators.length == 0)return;
		
		var success = true;
		Alipw.each(this.validatorItems,function(i,validator){
			this.validatorStatus[validator.id] = 'standby';
			
			var valid = validator.validate();
			if(valid == false){
				success = false;
			}else if(valid == 'validating'){
				if(success == true){
					success = 'validating';
				};
			};
		},this);
		
		this.success = success;
		return this.success;
	},
	reset:function(){
		Alipw.each(this.validatorItems,function(i,validator){
			validator.reset();
		},this);
	},
	//private
	validateCompleteHandler_ValidatorGroup:function(e){
		var validator = e.currentTarget;
		if(this.validatorStatus[validator.id] != 'standby')return;
		this.validatorStatus[validator.id] = 'complete';
		
		var allComplete = true;
		Alipw.each(this.validatorStatus,function(i,status){
			if(status == 'standby' || status == ''){
				allComplete = false;
				return false;
			}
		},this);
		if(!allComplete)return;
		
		//reset status
		Alipw.each(this.validatorStatus,function(i,status){
			this.validatorStatus[i] = '';
		},this);
		
		var success = true;
		Alipw.each(this.validatorItems,function(i,v){
			if(v.success == false){
				success = false;
			}
		},this);
		
		this.success = success;
		this.fireEvent('validateComplete',{
			'success':success
		},false);
	}
});