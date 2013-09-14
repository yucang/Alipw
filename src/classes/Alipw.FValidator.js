/**
 * @class
 * @type		class
 * @constructor Alipw.FValidator
 * @alias		Alipw.V
 * @extends		Alipw.Nonvisual
 * @description	表单校验类（别名：Alipw.V）
 * @author		lim[meng.limeng@alibaba-inc.com]
 */
(function(){
	Alipw.FValidator	= Alipw.extend(Alipw.Nonvisual, 
	/**
	 * @lends Alipw.FValidator.prototype
	 */
	{
		commitProperties:function(cfg){
			Alipw.FValidator.superclass.commitProperties.apply(this, arguments);
			var _cfg	= {
				//配置校验项列表
				items:[{
					//表单项选择器
					item:null,
					//表单项对应提示项选择器
					tip:null,
					//可否为空
					require:true,
					//校验规则
					rule:null,
					//配置ajax校验规则
					ajax:null,
					//单项提示信息,设置后可覆盖全局配置
					msg:null
				}],
				//校验规则(格式为key:value),支持RegExp、Function与二者混合校验([RegExp, Function])
				rules:{},
				//提示项className
				tipcls:{
					//通常
					normal:'alipw-tip-normal',
					//空
					empty:'alipw-tip-empty',
					//校验通过
					right:'alipw-tip-right',
					//校验未通过
					error:'alipw-tip-error',
					//ajax校验未通过
					ajaxError:'alipw-tip-ajaxError',
					//请求中
					pending:'alipw-tip-pending'
				},
				//提示信息
				msg:{
					normal:'请输入',
					empty:'此项不能空',
					right:'',
					error:'格式不正确',
					ajaxError:'服务器校验未通过',
					pending:'校验中...'
				},
				autoTrim:true,
				//值未变不重复校验
				noRepeat:false
			};
			cfg	= $.extend(true, _cfg, cfg || {});
			_load.call(this, cfg);
			//记录ajax校验是否结束
			this.ajaxCheckStatus	= {};
			this.result	= true;
			this.count	= 0;
			//记录校验项信息
			this.ico	= {};
		},
		initialize:function(){
			Alipw.FValidator.superclass.initialize.apply(this, arguments);
			this.add(this.items);
		},
		/**
		 * 添加校验项
		 * @param {object} ic	校验项配置信息(itemCfg)
		 * 
		 * @return {this}
		 */
		add:function(ic){
			var self	= this,
				icList	= _exactTypeof(ic) == 'Array' ? ic:[ic];
			for(var i=0,l=icList.length; i< l; i++){
				var item$	= $(icList[i].item);
				if(!item$.length){
					continue;
				}
				var ic	= this._configItem(icList[i]);
				item$.bind('focus blur', function(ic){return function(e){
					//focus显示normal提示信息,blur校验
					e.type == 'focus' ? _tip(ic, 'normal'):self.check(ic.item);
				};}(ic));
				this.count++;
			}
			return this;
		},
		/**
		 * 删除校验项
		 * @param {*} item	selector||[selector1, selector2, ...]
		 * 
		 * @return {this}
		 */
		remove:function(item){
			var itemList	= _exactTypeof(item) == 'Array' ? item:[item];
			for(var i=0,l=itemList.length; i< l; i++){
				$(itemList[i]).unbind('focus blur');
				var vid	= this._getItemVidentifier(itemList[i]);
				if(this.ico[vid] && this.ico[vid].tip$){
					this.ico[vid].tip$.remove();
					delete this.ico[vid];
					this.count--;
				}
			}
			return this;
		},
		/**
		 * 修改校验项
		 * @param {object} ic	单项配置信息(itemCfg)
		 * 
		 * @return {this}
		 */
		modify:function(ic){
			delete ic.result;
			var vid	= this._getItemVidentifier(ic.item);
			ic	= $.extend(true, this.ico[vid], ic);
			this._configItem(ic);
			ic.noRepeat && this.ico[vid] && (this.ico[vid].$isChked = false);
			this.check(this.ico[vid].item);
			return this;
		},
		/**
		 * 查询校验项
		 * @param {*} item		selector||[selector1, selector2, ...]
		 * 
		 * @return {object} ic	单项信息(itemCfg)
		 */
		search:function(item){
			return $.extend(true, {}, this.ico[this._getItemVidentifier(item)]);
		},
		/**
		 * 校验结果
		 * 
		 * @return {boolean}
		 */
		getResult:function(){
			return this.checkAll();
		},
		/**
		 * 验证通过后回调
		 * @param {function} fn					回调函数,回传参数校验结果[boolean]
		 * @param {boolean} checkFailed2cback	校验未通过执行回调
		 */
		v2c:function(fn, checkFailed2cback){
			var self	= this;
			this.checkAll();
			//ajax校验未完成
			if(getObjectLength(this.ajaxCheckStatus)){
				var sid	= setInterval(function(){
					if(getObjectLength(self.ajaxCheckStatus)){
						return;
					}
					clearInterval(sid);
					//checkFailed2cback为true或校验通过,执行回调
					checkFailed2cback ? fn(self.result):(self.result && fn(self.result));
				}, 10);
			}else{
				//checkFailed2cback为true或校验通过,执行回调
				checkFailed2cback ? fn(self.result):(self.result && fn(self.result));
			}
		},
		/**
		 * 单项检查
		 *  @param {*} item			selector||[selector1, selector2, ...]
		 *  @param {function} fn	Ajax校验完成回调[可选]
		 * 
		 * @return {mixed} boolean|pending:string
		 */
		check:function(item, fn){
			var vid	= this._getItemVidentifier(item),
				ic	= this.ico[vid],
				v	= ic.autoTrim ? $.trim($(ic.item).val()):$(ic.item).val(),
				self= this,
				result;
			//非重复校验
			if(ic.noRepeat){
				//值改变或无校验记录仍校验
				result	= ic.$oldValue === v && ic.$isChked ? ic.result:function(self){return _check(ic, self);}(this);
				ic.$oldValue	= v;
				ic.$isChked		= true;
			}else{
				result	= function(self){return _check(ic, self);}(this);
			}
			_tip(ic, result, true);
			if(result == 'pending' && fn){
				if(this.ajaxCheckStatus[vid]){
					var sid	= setInterval(function(){
						if(self.ajaxCheckStatus[vid]){
							return;
						}
						clearInterval(sid);
						fn($.inArray(ic.result, ['right', 'normal']) < 0 ? false:true);
					}, 10);
				}else{
					fn($.inArray(ic.result, ['right', 'normal']) < 0 ? false:true);
				}
			}
			result	= $.inArray(result, ['right', 'normal', 'pending']) < 0 ? false:result == 'pending' ? 'pending':true;
			return result;
		},
		/**
		 * 全部检查
		 * @param {boolean} hasPending	返回结果包含pending状态
		 * 
		 * @return {mixed} boolean|pending:string
		 */
		checkAll:function(hasPending){
			this.result	= true;
			for(var k in this.ico){
				var result	= this.check(this.ico[k].item);
				//按需返回pending
				if(hasPending){
					switch(this.result){
						case true:
							this.result	= result;
							break;
						case 'pending':
							result === false && (this.result = false);
							break;
					}
				//当前结果为true||pending,且单项校验为false||pending,结果置为false
				}else{
					this.result !== false && (!result || result === 'pending') && (this.result = false);
				}
			}
			return this.result;
		},
		/**
		 * 单项配置
		 * @param {object} ic	单项配置信息(itemCfg)
		 * 
		 * @return {object} ic
		 */
		_configItem:function(ic){
			//克隆
			var ic	= $.extend(true, {}, ic);
			if($.inArray(_exactTypeof(ic.rule), ['String', 'Array']) > -1){
				if(_exactTypeof(ic.rule) == 'Array'){
					for(var n=0,nl=ic.rule.length; n< nl; n++){
						_exactTypeof(ic.rule[n]) == 'String' && (ic.rule[n] = this.rules[ic.rule[n]]);
					}
				}else{
					ic.rule	= this.rules[ic.rule];
				}
			}
			ic.require	= ic.require !== undefined ? ic.require:true;
			ic.result	= ic.require ? 'empty':'normal';
			ic.tipcls	= $.extend(true, {}, this.tipcls, ic.tipcls || {});
			ic.msg		= $.extend(true, {}, this.msg, ic.msg || {});
			ic.tip$		= ic.tip ? $(ic.tip):$('<span class="'+ ic.tipcls.normal +'"></span>').insertAfter(ic.item);
			ic.autoTrim	= ic.autoTrim === undefined ? this.autoTrim:ic.autoTrim;
			ic.noRepeat	= ic.noRepeat === undefined ? this.noRepeat:ic.noRepeat;
			if(this.ico[this._getItemVidentifier(ic.item)]){
				$.extend(true, this.ico[this._getItemVidentifier(ic.item)] || {}, ic);
			}else{
				this.ico[this._getItemVidentifier(ic.item)]	= ic;
			}
			return ic;
		},
		_getItemVidentifier:function(item){
			var item$	= $(item),
				videntifier	= item$.attr('_videntifier');
			if(!videntifier){
				videntifier	= new Date().getTime() +'_'+ this.count;
				item$.attr('_videntifier', videntifier);
			}
			return videntifier;
		}
	});
	//模拟私有方法
	function _ce(name){
		return document.createElement(name);
	}
	function _load(cfg){
		for(var k in cfg){this[k] = cfg[k];}
	}
	function _check(ic,fv){
		var v	= ic.autoTrim ? $.trim($(ic.item).val()):$(ic.item).val(),
			rule= ic.rule,
			ajax= ic.ajax,
			result;
		ic.autoTrim && $(ic.item).val(v);
		//非空
		if(v !== ''){
			//rule检查
			var type	= _exactTypeof(rule);
			switch(type){
			case 'RegExp':
				result	= rule.test(v) ? 'right':'error';
				break;
			case 'Function':
				result	= rule(v) ? 'right':'error';
				break;
			//多个校验规则(数组)
			case 'Array':
				var tic	= $.extend({}, ic);
				for(var i=0,l=rule.length; i< l; i++){
					tic.rule	= rule[i];
					tic.ajax	= null;
					if((result = _check(tic, fv)) == 'error'){
						break;
					}
				}
				break;
			default:
				result	= 'right';
			}
			//ajax检查
			if(result == 'right' && ajax && !fv.ajaxCheckStatus[fv._getItemVidentifier(ic.item)]){
				//等待ajax校验结果
				result = ic.result = 'pending';
				fv.ajaxCheckStatus[fv._getItemVidentifier(ic.item)]	= 1;
				ajax(v, function(isSuccess, tip){
					result	= Boolean(isSuccess) ? 'right':'ajaxError';
					//记录当前项校验结果
					ic.result	= result;
					ic.msg[result]	= tip || ic.msg[result];
					if(result == 'right'){
						fv.result	= true;
						for(var k in fv.ico){
							if($.inArray(fv.ico[k].result, ['right', 'normal']) < 0){
								fv.result	= false;
								break;
							}
						}
					}else{
						fv.result	= false;
					}
					_tip(ic, result, true);
					delete fv.ajaxCheckStatus[fv._getItemVidentifier(ic.item)];
				});
			}
			ic.result == 'pending' && (result = 'pending');
			//记录当前项校验结果
			ic.result	= result;
		//为空
		}else{
			result	= ic.require ? 'empty':'normal';
			//记录当前项校验结果
			ic.result	= result;
		}
		return result;
	}
	function _tip(ic, result, ischeck){
		var tip$	= ic.tip$,
			hResult	= tip$[0].$history_result;
		//非必填||新校验结果
		if(!ic.require || hResult != result){
			var rmcls	= ic.tipcls[hResult],
				addcls	= ic.tipcls[result];
			tip$.removeClass(rmcls).addClass(addcls).text(ic.msg[result] || '');
			!ic.require && ischeck && result == 'normal' ? tip$.hide():tip$.show();
			tip$[0].$history_result	= result;
		}
	}
	//Number|String|Array|Object|Function|RegExp
	function _exactTypeof(v){
		if(v && v.constructor && v.constructor.toString){
			var fnname	= v.constructor.toString(),
				r	= /^[\s\(]*function\s+(.+)\(/.exec(fnname);
			return r && r[1] || 'undefined';
		}
		return 'undefined';
	}
	function getObjectLength(o){
		var l	= 0;
		for(var k in o){
			l++;
		}
		return l;
	}
	Alipw.V	= Alipw.FValidator;
})();