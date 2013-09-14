/** 
* @class
* @type singleton
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description 消息提示器。
* @demo http://aliyun-ued.com/alipw/samples/msg.html
*/
Alipw.Msg = function(){
	
	var createMsgWindow = function(title,msg,fn,windowConfig,msgConfig,buttonsConfig){
		var defaultConfig = {
			title:"Message",
			buttonAlign:"right"
		};
		
		var html = new Alipw.Template([
            '<div class="alipw-msg">',
            	'<div class="alipw-msg-text">',
           			'{$msg}',
           			'<div class="alipw-msg-icon {$iconCls}"></div>',
       			'</div>',
   			'</div>'
       	]).set({
   			msg:msg,
   			iconCls:msgConfig.iconCls
        }).html;
		
		var winConfig = jQuery.extend(defaultConfig, windowConfig, {
			html:html,
			title:title,
			resizable:false,
			autoCenter:true,
			autoRender:false
		});
		
		var win = new Alipw.Window(winConfig);
		win.setVisible(false,true);
		win.render();
		
		if(buttonsConfig instanceof Array){
			for(var i=0,len=buttonsConfig.length;i<len;i++){
				var button = win.addButtons(buttonsConfig[i]);
				button.addEventListener("click",function(e){
					if(typeof(fn) == "function"){
						fn(this._callbackToken);
					}
					win.close();
				},button,true);
			}
		}
		
		var msgBody = win.el.find(".alipw-msg");
		msgBody.css("white-space","nowrap");
		win.body.css("overflow","hidden");
		if(msgBody.width() > msgConfig.textMaxWidth){
			msgBody.width(msgConfig.textMaxWidth);
			msgBody.css("white-space","");
		}else if(msgBody.width() < msgConfig.textMinWidth){
			msgBody.width(msgConfig.textMinWidth);
			msgBody.css("white-space","");
		}
		
		var winWidth = win.getWidthByBody(msgBody.outerWidth());
		var winHeight = win.getHeightByBody(msgBody.outerHeight());
		
		win.setSize(winWidth,winHeight);
		win.center();
		Alipw.ComponentManager.bringToFront(win);
		win.setVisible(true);
		
		return win;
	};

	var pub = 
	/** @lends Alipw.Msg */
	{
		config:{
			dialog:{
				iconCls:"alipw-icon-msg-warning",
				textMaxWidth:500,
				textMinWidth:150
			},
			alert:{
				OKText:"OK",
				OKButtonCls:undefined,
				OKButtonGridScale:true,
				OKButtonWidth:60,
				iconCls:"alipw-icon-msg-warning",
				textMaxWidth:500,
				textMinWidth:150
			},
			prompt:{
				
			},
			confirm:{
				yesText:"Yes",
				yesButtonCls:undefined,
				yesButtonGridScale:true,
				yesButtonWidth:60,
				noText:"No",
				noButtonCls:undefined,
				noButtonGridScale:true,
				noButtonWidth:60,
				iconCls:"alipw-icon-msg-question",
				textMaxWidth:500,
				textMinWidth:150
			},
			tip:{
				iconCls:"alipw-icon-msg-success",
				textMaxWidth:500,
				textMinWidth:150,
				timeout:2000,
				gridScaleButton:true
			}
		},
		/**
		 * @public
		 * @description 对话框。
		 * @param {String} title 对话框标题。
		 * @param {String} msg 对话框显示内容
		 * @param {Object} [config] 配置选项以及额外的Alipw.Window配置选项。除Alipw.Window的配置选项外，还有一下可设置属性：<ul><li>iconCls : String  提示窗中icon的class名称。默认为'alipw-icon-msg-warning'</li><li>textMaxWidth : Number 显示的最大宽度。若超过此宽度，则文本将折行显示。默认为500</li><li>textMinWidth : Number 显示的最小宽度。默认为150</li></ul>
		 */
		dialog:function(title,msg,config){
			if(typeof(config) != "object"){
				config = new Object();
			}
			
			var msgConfig = jQuery.extend({},pub.config.dialog,{
				iconCls:config.iconCls,
				textMaxWidth:config.textMaxWidth,
				textMinWidth:config.textMinWidth
			});
			
			for(var i in msgConfig){
				delete config[i];
			}
			
			config = jQuery.extend({
				modal:true
			},config);
			
			var buttonsConfig = [];
			
			var win = createMsgWindow(title,msg,null,config,msgConfig,buttonsConfig);
			return win;
		},
		/**
		 * @public
		 * @description 警告提示窗。
		 * @param {String} title 提示窗标题。
		 * @param {String} msg 提示窗显示内容
		 * @param {Function} [fn] 点击确定后响应的function。
		 * @param {Object} [config] 配置选项以及额外的Alipw.Window配置选项。除Alipw.Window的配置选项外，还有一下可设置属性：<ul><li>iconCls : String  提示窗中icon的class名称。默认为'alipw-icon-msg-warning'</li><li>OKText : String  确定按钮的显示文本。默认为'OK'</li><li>textMaxWidth : Number 显示的最大宽度。若超过此宽度，则文本将折行显示。默认为500</li><li>textMinWidth : Number 显示的最小宽度。默认为150</li></ul>
		 */
		alert:function(title,msg,fn,config){
			if(typeof arguments[0] == 'object'){
				var	args	= arguments[0], 
					title	= args.title || '提醒',
					msg		= args.msg,
					fn		= args.fn,
					config	= args.config;
			}
			if(typeof(config) != "object"){
				config = new Object();
			}
			
			var msgConfig = jQuery.extend({},pub.config.alert,{
				OKText:config.OKText,
				OKButtonCls:config.OKButtonCls,
				OKButtonGridScale:config.OKButtonGridScale,
				OKButtonWidth:config.OKButtonWidth,
				iconCls:config.iconCls,
				textMaxWidth:config.textMaxWidth,
				textMinWidth:config.textMinWidth
			});
			
			for(var i in msgConfig){
				delete config[i];
			}
			
			config = jQuery.extend({
				modal:true
			},config);
			
			var buttonsConfig = [{
				label:msgConfig.OKText,
				cls:msgConfig.OKButtonCls,
				gridScale:msgConfig.OKButtonGridScale,
				width:msgConfig.OKButtonWidth,
				_callbackToken:"OK"
			}];
			
			var win = createMsgWindow(title,msg,fn,config,msgConfig,buttonsConfig);
			return win;
		},
		prompt:function(title,msg,fn,config){
			
		},
		/**
		 * @public
		 * @description 确认提示窗。
		 * @param {String} title 提示窗标题。
		 * @param {String} msg 提示窗显示内容
		 * @param {Function} [fn] 点击按钮后响应的function。function会被传入一个action参数，action的值为'yes'或'no'。
		 * @param {Object} [config] 配置选项以及额外的Alipw.Window配置选项。除Alipw.Window的配置选项外，还有一下可设置属性：<ul><li>iconCls : String  提示窗中icon的class名称。默认为'alipw-icon-msg-question'</li><li>yesText : String  '是'按钮的显示文本。默认为'Yes'</li><li>noText : String  '否'按钮的显示文本。默认为'No'</li><li>textMaxWidth : Number 显示的最大宽度。若超过此宽度，则文本将折行显示。默认为500</li><li>textMinWidth : Number 显示的最小宽度。默认为150</li></ul>
		 */
		confirm:function(title,msg,fn,config){
			if(typeof(config) != "object"){
				config = new Object();
			}
			
			var msgConfig = jQuery.extend({},pub.config.confirm,{
				yesText:config.yesText,
				yesButtonCls:config.yesButtonCls,
				yesButtonGridScale:config.yesButtonGridScale,
				yesButtonWidth:config.yesButtonWidth,
				noText:config.noText,
				noButtonCls:config.noButtonCls,
				noButtonGridScale:config.noButtonGridScale,
				noButtonWidth:config.noButtonWidth,
				iconCls:config.iconCls,
				textMaxWidth:config.textMaxWidth,
				textMinWidth:config.textMinWidth
			});
			
			for(var i in msgConfig){
				delete config[i];
			}
			
			config = jQuery.extend({
				modal:true
			},config);
			
			var buttonsConfig = [{
				label:msgConfig.yesText,
				cls:msgConfig.yesButtonCls,
				gridScale:msgConfig.yesButtonGridScale,
				width:msgConfig.yesButtonWidth,
				_callbackToken:"yes"
			},{
				label:msgConfig.noText,
				cls:msgConfig.noButtonCls,
				gridScale:msgConfig.noButtonGridScale,
				width:msgConfig.noButtonWidth,
				_callbackToken:"no"
			}];
			
			var win = createMsgWindow(title,msg,fn,config,msgConfig,buttonsConfig);
			return win;
		},
		tip:function(msg,config){
			if(typeof(config) != "object"){
				config = new Object();
			}
			
			var msgConfig = jQuery.extend({},pub.config.tip,{
				iconCls:config.iconCls,
				textMaxWidth:config.textMaxWidth,
				textMinWidth:config.textMinWidth,
				timeout:config.timeout
			});
			
			for(var i in msgConfig){
				delete config[i];
			}
			
			config = jQuery.extend({
				showHeader:false,
				modal:false,
				draggable:false
			},config);
			
			var win = createMsgWindow("",msg,null,config,msgConfig);
			
			if(msgConfig.timeout > 0){
				setTimeout(function(){
					win.close();
				},msgConfig.timeout);
			}
			
			return win;
		}
	};
	
	return pub;
}();