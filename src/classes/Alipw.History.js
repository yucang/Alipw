/**
 * @class
 * @type singleton
 * @extends Alipw.Nonvisual
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 用于支持浏览器的前进、后退按钮。在浏览器前进和后退按钮被点击、或是手动更改地址栏的hash时，会触发History的change事件。
 * @demo http://aliyun-ued.com/alipw/samples/history.html
 */
Alipw.History = function(){
	var stack = new Array();
	var iframe;
	var pub = new Alipw.Nonvisual({
		/**
		 * @memberOf Alipw.History
		 * @property
		 * @type Boolean
		 * @description [config]自动初始化。在实例化对象时自动初始化。
		 * @default false
		 */
		autoInit:false
	});
	
	Alipw.apply(pub,
	/** @lends Alipw.History */
	{
		/**
		 * @property
		 * @type String
		 * @description [config option]定义用于支持浏览器前进和后退按钮的空白页面，此URL需要与当前站点在同一域下，用于支持IE6，7下的浏览器按钮动作。如果alipw库的访问地址与站点地址在同一域下，则不需要设置此项。
		 * @default ''
		 */
		blankURL:'',
		currentIndex:0,
		/**
		 * @public
		 * @description 添加一个历史标记到hash中。
		 * @param {String} token 标记名称
		 */
		add:function(token){
			stack.push(token);
			this.currentIndex = stack.length - 1;
			
			//if add action cause hash change,set a flag to ignore the hash change event
			if(Alipw.getHash() != token){
				this.status = "adding";
			}
			
			window.location.hash = token;
		},
		forward:function(){
			if(this.iframe){
				this.iframe.contentWindow.history.forward();
			}else{
				history.forward();
			}
		},
		back:function(){
			if(this.iframe){
				this.iframe.contentWindow.history.back();
			}else{
				history.back();
			}
		},
		/**
		 * @public
		 * @description 初始化。在使用History前， 必须先执行此方法，此方法中会自动执行Nonvisual类的initialize方法。
		 */
		init:function(){
			this.initialize();
			
			var me = this;
			Alipw.EventManager.enableHashChangeEvent();
			
			if(Alipw.isIE && parseInt(Alipw.ieVersion) < 8){
				iframe = document.createElement("iframe");
				iframe.settingSrc = true;
				iframe.style.position = "absolute";
				iframe.style.width = "1px";
				iframe.style.height = "1px";
				iframe.style.visibility = "hidden";
				iframe.style.left = "-10000px";
				iframe.style.top = "-10000px";
				var url = this.blankURL?this.blankURL:(Alipw.getPath() + 'alipw/resources/assets/blank.html');
				iframe.src = url + '?' + Alipw.getHash();
				if(Alipw.isReady){
					document.body.appendChild(iframe);
				}else{
					Alipw.onReady(function(){
						document.body.appendChild(iframe);
					},this);
				}
				
				iframe.onreadystatechange = function(){
					if(iframe.readyState != "interactive"){
						return;
					}
					if(iframe.settingSrc){
						iframe.settingSrc = false;
						return;
					}
					
					var hash = unescape(iframe.contentWindow.location.href.toString().split("?")[1]);
					iframe.changingHash = true;
					window.location.hash = hash;
				};
				
				this.iframe = iframe;
			}
			
			Alipw.getWinProxy().addEventListener("hashChange",function(e){
				if(parseInt(Alipw.ieVersion) < 8){
					if(iframe && iframe.changingHash){
						iframe.changingHash = false;
					}else{
						
						//damn ie 6 bug. when changing hash manually in the address bar. 
						//then we can't set hash normally by javascript.
						if(Alipw.isIE6 && me.status != "adding"){
							window.location.reload();
						}
						
						iframe.settingSrc = true;
						var url = me.blankURL?me.blankURL:(Alipw.getPath() + 'alipw/resources/assets/blank.html');
						iframe.src = url + '?' + Alipw.getHash();
					}
				}
				
				if(me.status=="adding"){
					me.status = "added";
					return;
				}
				var evt = new Object();
				evt.token = e.hash;
				evt.lastToken = e.lastHash;
				me.fireEvent("change",evt);
			});
		},
		/**
		 * @public
		 * @description 获取当前浏览器的hash。
		 */
		getToken:function(){
			return Alipw.getHash();
		}
	});
	
	return pub;

}();



/**
 * @name Alipw.History#change
 * @event
 * @description 在浏览器前进和后退按钮被点击、或是手动更改地址栏的hash而导致hash改变时，会触发History的change事件。
 * @param {Alipw.Event} e e拥有以下附加属性:<ul><li>token:String 历史标记。</li></ul>
 */