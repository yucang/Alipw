/** 
* @class
* @type singleton
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description Alipw核心类（单态），同时也是所有类的命名空间。
*/
var Alipw = function(){
	var ua = navigator.userAgent.toLowerCase();
	var ie = ua.match(/msie ([\d.]+)/)?ua.match(/msie ([\d.]+)/)[1]:undefined;
	var isIE = typeof(ie) != "undefined";
	var isIE6 = ie && parseInt(ie) == 6;
	var isIE7 = ie && parseInt(ie) == 7;
	var isIE8 = ie && parseInt(ie) == 8;
	var isIE9 = ie && parseInt(ie) == 9;
	var isWebKit = /applewebkit/.test(ua);
	var isOpera = ua.match(/opera\/([\d.]+)/);
	var jQueryDoc;
	var jQueryWin;
	var jQueryBody;
	var alipwPath;
	var alipwFileInfo;
	var scrollbarSize;
	
	var pendingFn = [];
	
	var pub = 
	/** @lends Alipw */	
	{
		initialize:function(){
			/**
			 * @namespace
			 */
			Alipw.utils = new Object();
			
			var fileInfo = Alipw.getFileInfo();
			Alipw.rootPath = fileInfo.rootPath;
			Alipw.classPath = fileInfo.classPath;
			Alipw.mode = fileInfo.mode;

			var root = Alipw.rootPath;
			if(typeof(jQuery) == "undefined"){
				document.write('<script type="text/javascript" src="' + root + 'alipw/baselib/baselib-all.js?v=' + Alipw.build + '"></script>');
			}else{
				document.write('<script type="text/javascript" src="' + root + 'alipw/baselib/jquery/jquery.easing.js?v=' + Alipw.build + '"></script>');
			}
			document.write('<link rel="stylesheet" type="text/css" href="' + root + 'alipw/resources/css/style.css?v=' + Alipw.build + '" />');
			
			Alipw.onDOMReady(function(){
				if(Alipw.theme){
					jQuery(document.body).addClass('alipw-theme-' + Alipw.theme);
				}
			});
		},
		build:'@ALIPW_BUILD@',
		version:'2.0',
		ieVersion:ie,
		isIE:isIE,
		isIE6:isIE6,
		isIE7:isIE7,
		isIE8:isIE8,
		isIE9:isIE9,
		isWebKit:isWebKit,
		isOpera:isOpera,
		theme:'default',
		useShims:false,
		apply : function(o, c, defaults){
		    // no "this" reference for friendly out of scope calls
		    if(defaults){
		    	Alipw.apply(o, defaults);
		    }
		    if(o && c && typeof c == 'object'){
		        for(var p in c){
		            o[p] = c[p];
		        }
		    }
		    return o;
		},
		override : function(origclass, overrides){
			if(overrides){
				var p = origclass.prototype;
				Alipw.apply(p, overrides);
				if(Alipw.ie() && overrides.hasOwnProperty('toString')){
					p.toString = overrides.toString;
				}
			}
		},
		/**
		 * @static
		 * @function
		 * @description 继承一个类。
		 * @param {Object} super 需要继承的类（构造函数） 
		 * @param {Object} [members] 用于扩展子类的类成员的集合对象
		 * @return {Object} 继承自指定超类的子类
		 */
		extend : function(){
			// inline overrides
			var io = function(o){
				for(var m in o){
					this[m] = o[m];
				}
			};
			var oc = Object.prototype.constructor;
	
			return function(sb, sp, overrides){
				if(typeof sp == 'object'){
					overrides = sp;
					sp = sb;
					sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
				};
				var F = function(){},
					sbp,
					spp = sp.prototype;
	
				F.prototype = spp;
				sbp = sb.prototype = new F();
				sbp.constructor=sb;
				sb.superclass=spp;
				if(spp.constructor == oc){
					spp.constructor=sp;
				};
				sb.override = function(o){
					Alipw.override(sb, o);
				};
				sbp.superclass = sbp.supr = (function(){
					return spp;
				});
				sbp.override = io;
				Alipw.override(sb, overrides);
				sb.extend = function(o){return Alipw.extend(sb, o);};
				return sb;
			};
		}(),
		/**
		 * @static
		 * @description 获取document的jQuery对象。
		 * @return {jQuery Object} document的jQuery对象。
		 */
		getDoc:function(){
			if(!jQueryDoc){
				jQueryDoc = jQuery(window.document);
			}
			
			return jQueryDoc;
		},
		/**
		 * @static
		 * @description 获取window的jQuery对象。
		 * @return {jQuery Object} window的jQuery对象。
		 */
		getWin:function(){
			if(!jQueryWin){
				jQueryWin = jQuery(window);
			}
			
			return jQueryWin;
		},
		/**
		 * @static
		 * @description 获取document.body的jQuery对象。
		 * @return {jQuery Object} document.body的jQuery对象。
		 */
		getBody:function(){
			if(!jQueryBody){
				jQueryBody = jQuery(window.document.body);
			}
			
			return jQueryBody;
		},
		/**
		 * @static
		 * @description 通过id获取一个Alipw.Component实例。
		 * @param {String} id 实例的id. 
		 * @return {Object} 指定id的实例.若没有符合条件的实例，则返回null.
		 */
		getComp:function(id){
			return Alipw.ComponentManager.getComponent(id);
		},
		/**
		 * @static
		 * @description 通过id获取一个Alipw.Module实例。
		 * @param {String} id 实例的id. 
		 * @return {Object} 指定id的Module实例.若没有符合条件的Module实例，则返回null.
		 */
		getModule:function(id){
			var comp = Alipw.ComponentManager.getComponent(id);
			if(comp instanceof Alipw.Module){
				return comp;
			}
			
			return null;
		},
		/**
		 * @static
		 * @description 通过id获取一个Alipw.Nonvisual实例。
		 * @param {String} id 实例的id. 
		 * @return {Object} 指定id的Alipw.Nonvisual实例.若没有符合条件的Alipw.Nonvisual实例，则返回null.
		 */
		getNonvisual:function(id){
			var instance = Alipw.Nonvisual.getInstance(id);
			if(instance){
				return instance;
			}
			
			return null;
		},
		/**
		 * @static
		 * @description 通过id获取一个Alipw.Component或者Alipw.Nonvisual实例。
		 * @param {String} id 实例的id. 
		 * @return {Object} 指定id的实例.若没有符合条件的实例，则返回null.
		 */
		getInstance:function(id){
			var instance;
			
			instance = Alipw.getComp(id);
			if(instance){
				return instance;
			}
			
			instance = Alipw.getNonvisual(id);
			if(instance){
				return instance;
			}
			
			return null;
		},
		/**
		 * @static
		 * @description 在Alipw.Module引用的script文件中，需要使用此方法为module添加脚本。
		 * @param {Function} fn 包含操作脚本的function. 
		 */
		addModuleScript:function(fn){
			Alipw.Module.__moduleScriptFn = fn;
			fn.__Alipw_needToReload = true;
		},
		adjustImgSize: function(imgObj,maxWidth,maxHeight,autoFill){
			if(typeof(autoFill) == "undefined")autoFill = true;
			
			var OriginImage=new Image();
			OriginImage.src=imgObj.src;		
			var OriginWidth = OriginImage.width;
			var OriginHeight = OriginImage.height;
			
			
			//ie6 bug. the size of the image cloud be 0 sometimes in IE6
			if(!imgObj._adjustSizeTryTime){
				imgObj._adjustSizeTryTime = 0;
			}
			if((OriginWidth == 0 || OriginHeight == 0) && imgObj._adjustSizeTryTime < 100){
				imgObj._adjustSizeTryTime ++;
				setTimeout(function(){
					Alipw.adjustImgSize(imgObj, maxWidth, maxHeight, autoFill);
				},10);
				return;
			}
			
			if(OriginWidth <= maxWidth && OriginHeight <= maxHeight){
				imgObj.style.width = OriginWidth + "px";
				imgObj.style.height = OriginHeight + "px";
				if(autoFill){
					imgObj.style.paddingLeft = imgObj.style.paddingRight = parseInt((maxWidth - OriginWidth)/2) + "px";
					imgObj.style.paddingTop = imgObj.style.paddingBottom = parseInt((maxHeight - OriginHeight)/2) + "px";
				}
			}else{
				var width = maxWidth;
				var height = (maxWidth * OriginHeight)/OriginWidth;
				if(height>maxHeight){
					height = parseInt(maxHeight);
					width = parseInt((maxHeight * OriginWidth)/OriginHeight);
				}
				imgObj.style.width = width + "px";
				imgObj.style.height = height + "px";
				if(autoFill){
					imgObj.style.paddingLeft = imgObj.style.paddingRight = parseInt((maxWidth - width)/2) + "px";
					imgObj.style.paddingTop = imgObj.style.paddingBottom = parseInt((maxHeight - height)/2) + "px";
				}
			}
		},
		/**
		 * @static
		 * @description 检测一个对象是否有值。
		 * @param {Object} value 需要检测的对象. 
		 * @return {Boolean} 如果value为undefined或null,则返回false。反之，则返回true.
		 */
		isSet:function(v){
			if(typeof(v) != "undefined" && v != null){
				return true;
			}else{
				return false;
			}
		},
		ie:function(){
			var iev = navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/);
			return iev?iev[1]:undefined;
		},
		/**
		 * @static
		 * @description 获取当前alipw库所在路径。
		 * @return {String} 当前alipw库所在路径，不包含alipw目录名。
		 */
		getPath:function(){
			if(!alipwPath){
				var scriptTags = document.getElementsByTagName("script");
				var matchArr;
				for(var i=0, len=scriptTags.length;i<len;i++){
					matchArr = scriptTags[i].src.toString().match(/(.*)alipw\/classes\//i);
					if(matchArr){
						alipwPath = matchArr[1];
						break;
					}
				}
			}
			
			return alipwPath;
		},
		/**
		 * @static
		 * @description 获取当前alipw库的引用文件信息。
		 * @return {Object} 该对象有以下属性：<ul><li>rootPath : String alipw库所在路径。</li><li>classPath : String alipw库的类文件所在路径。</li><li>mode : String base或all。</li></ul>
		 */
		getFileInfo:function(){
			if(!alipwFileInfo){
				var scriptTags = document.getElementsByTagName("script");
				var matchArr;
				for(var i=0, len=scriptTags.length;i<len;i++){
					matchArr = scriptTags[i].src.toString().match(/(.*)alipw\/classes\/(.+)\.js/i);
					if(matchArr){
						alipwFileInfo = {
							rootPath:matchArr[1],
							classPath:matchArr[1] + "alipw/classes/",
							mode:matchArr[2].replace("alipw-","")
						};
					}
				}
			}
			
			return alipwFileInfo;
		},
		removeItemFromArray:function(o,arr){
			for(var i=0,len=arr.length;i<len;i++){
				if(arr[i] == o){
					arr.splice(i,1);
					i--;
					len=arr.length;
				}
			}
		},
		indexOfArray:function(o,arr){
			for(var i=0,len=arr.length;i<len;i++){
				if(arr[i] === o){
					return i;
				}
			}
			
			return -1;
		},
		//fix jQuery document size calculating bug for IE
		//for IE8,9 the size of the document we get is including the width of the scroll bar.
		getDocWidth:function(){
			if(Alipw.ie()){
				if(document.compatMode == "BackCompat"){
					return document.body.scrollWidth;
				}else{
					return document.documentElement.scrollWidth;
				}
			}else{
				return jQuery(document).width();
			}
		},
		getDocHeight:function(){
			if(Alipw.ie()){
				if(document.compatMode == "BackCompat"){
					return document.body.scrollHeight;
				}else{
					return document.documentElement.scrollHeight;
				}
			}else{
				return jQuery(document).height();
			}
		},
		isInNode:function(node1,node2){
			var innerNodes = node2.getElementsByTagName("*");
			for(var i=0;i<innerNodes.length;i++){
				if (innerNodes[i] == node1){
				  return true;
				}
			};
			return false;
		},
		/**
		 * @static
		 * @description 指示当前类加载和页面DOM是否准备完毕。
		 * @return {Boolean} 类加载和页面DOM是否准备完毕。
		 */
		isReady:function(){
			return Alipw.isDOMReady && Alipw.ClassManager.getStatus() == "complete";
		},
		/**
		 * @property
		 * @description 指示当前页面DOM是否准备完毕。
		 * @type Boolean
		 */
		isDOMReady:false,
		/**
		 * @static
		 * @function
		 * @description 在DOM准备完毕时执行指定function。
		 * @param {Function} fn 需要执行的function。
		 */
		onDOMReady:function(fn){
			var isReady=false;
			var readyList= [];
			var timer;
			var ready = function(fn) {
				if (Alipw.isDOMReady)
					fn.call( document);
				else
					readyList.push( function() { return fn.call(this);});
					return this;
				};
				var onDOMReady=function(){
				for(var i=0;i<readyList.length;i++){
					readyList[i].apply(document);
				}
				readyList = null;
			};
			var bindReady = function(evt){
				if(Alipw.isDOMReady) return;
					Alipw.isDOMReady=true;
					onDOMReady.call(window);
				if(document.removeEventListener){
					document.removeEventListener("DOMContentLoaded", bindReady, false);
				}else if(document.attachEvent){
					document.detachEvent("onreadystatechange", bindReady);
					if(window == window.top){
						clearInterval(timer);
						timer = null;
					}
				}
			};
			if(document.addEventListener){
				document.addEventListener("DOMContentLoaded", bindReady, false);
			}else if(document.attachEvent){
				document.attachEvent("onreadystatechange", function(){
					if((/loaded|complete/).test(document.readyState)){
						bindReady();
					}
				});
				if(window == window.top){
					timer = setInterval(function(){
						try{
							Alipw.isDOMReady||document.documentElement.doScroll('left');
						}catch(e){
							return;
						}
						bindReady();
					},5);
				}
			}
			
			return ready;
		}(),
		/**
		 * @static
		 * @description 在DOM和类加载都准备完毕时执行指定function。
		 * @param {Function} fn 需要执行的function。
		 */
		onReady:function(fn){
			Alipw.onDOMReady(function(){
				if(Alipw.ClassManager.getStatus() == "complete"){
					fn();
				}else{
					pendingFn.push(fn);
				}
			});
		},
		/**
		 * @static
		 * @description 在DOM、页面资源和类加载都准备完毕时执行指定function。
		 * @param {Function} fn 需要执行的function。
		 */
		onLoad:function(fn){
			jQuery(window).bind("load",function(){
				if(Alipw.isReady()){
					fn();
				}else{
					Alipw.onReady(fn);
				}
			});
		},
		/**
		 * @static
		 * @description 载入指定类。
		 * @param {Object} class1，class2，class3... 需要载入的类。
		 */
		importClass:function(){
			if(Alipw.mode == "all"){
				return;
			}
			
			Alipw.ClassManager.loadClass.apply(Alipw.ClassManager,arguments);
		},
		/**
		 * @static
		 * @description 遍历一个数组的元素或对象的所有属性。
		 * @param {Object} object 需要遍历的数组或对象。
		 * @param {Function} fn 遍历时执行的function,该function会被传入2个形参：<ul><li>index: 索引</li><li>element: 元素或属性值</li></ul>。如果在该function中返回false,则停止对象的遍历。
		 * @param {Object} scope fn中this指针所指向的对象。
		 */
		each:function(object,fn,scope){
			if(!(fn instanceof Function))return;
			
			if(object instanceof Array){
				for(var i=0,len=object.length;i<len;i++){
					if(fn.call(scope,i,object[i]) == false){
						break;
					};
				}
			}else if(object instanceof Object){
				for(var i in object){
					if(fn.call(scope,i,object[i]) == false){
						break;
					};
				}
			}
		},
		/**
		 * @static
		 * @description 克隆一个对象。
		 * @param {Object} object 需要被克隆的对象。
		 * @param {Boolean} [deep] 是否为深度克隆。默认为false.
		 * @return {Object} 克隆出的新对象。
		 */
		clone:function(object,deep){
			return jQuery.extend(deep,{},ect);
		},
		createFuncProxy:function(fn,scope){
			return function(){
				fn.apply(scope,arguments);
			};
		},
		getScrollbarSize: function (force) {
            if (!Alipw.isReady()) {
                return {};
            }

            if (force || !scrollbarSize) {
                var db = document.body,
                    div = document.createElement('div');

                div.style.width = div.style.height = '100px';
                div.style.overflow = 'scroll';
                div.style.position = 'absolute';

                db.appendChild(div); // now we can measure the div...

                // at least in iE9 the div is not 100px - the scrollbar size is removed!
                scrollbarSize = {
                    width: div.offsetWidth - div.clientWidth,
                    height: div.offsetHeight - div.clientHeight
                };

                db.removeChild(div);
            }

            return scrollbarSize;
        },
		/**
		 * @static
		 * @description 获取当前hash。通过window.location.hash取得的hash在不同浏览器有略微差异，比如：Firefox会自作多情给hash进行decodeURI,此方法会做兼容性处理。
		 */
		getHash:function(){
			//firefox will decodeURI automatically when use location.hash to get hash.
			var url = window.location.href;
			if(url.indexOf('#') == -1){
				return '';
			}
			return url.replace(/^[^\#]*#/,'');
		},
		/**
		 * @static
		 * @description 异步加载一个javascript文件，并在加载完毕时执行指定function。此方法可实现跨域调用，但缺陷是调取的script文件会立即执行，并且无法在callback中获取已调用的文件内容。
		 * @param {Object} params 参数对象。包含以下可设置属性：<ul><li>url : String javascript文件的url</li><li>success : Function 读取成功后执行的callback function。</li></ul>
		 */
		loadScript:function(params){
			var url = params.url;
			var successFn = params.success;
			
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", url);
			
			if(Alipw.isIE){
				script.onreadystatechange = function(){
					if(script.readyState == "complete" || script.readyState == "loaded"){
						if(successFn instanceof Function){
							successFn.call();
						}
					}
				};
			}else{
				script.onload = function(){
					if(successFn instanceof Function){
						successFn.call();
					}
				};
			};
			
			head.appendChild(script);
			
			return script;
		},
		/**
		 * @static
		 * @description 获取window代理对象，并自动进行初始化。某些事件会在WinProxy对象上触发，如hashChange事件。
		 * @return {Alipw.WinProxy} Window对象的代理对象。
		 */
		getWinProxy:function(){
			if(!Alipw.WinProxy.initialized){
				Alipw.WinProxy.initialize();
			}
			return Alipw.WinProxy;
		},
		getObjectByName:function(name){
			var names = name.split('.');
			var classObject;
			for(var i=0,len=names.length;i<len;i++){
				if(!classObject && i==0){
					classObject = window[names[i]];
				}else if(classObject){
					classObject = classObject[names[i]];
				}else{
					break;
				};
			}
			
			return classObject;
		},
		isNumeric:function(value){
            return !isNaN(parseFloat(value)) && isFinite(value);
        },
        isIntegral:function(value){
        	return !isNaN(value) && parseInt(value).toString() == value.toString();
        },
		//private
		classLoadedHandler:function(){
			for(var i=0,len=pendingFn.length;i<len;i++){
				pendingFn[i]();
			}
			pendingFn = [];
		},
		//internal
		convertEl:function(el){
			var element;
			if(typeof(el) == "string" && el.substr(0,1) != "#"){
				element = jQuery("#" + el);
			}else{
				element = jQuery(el);
				if(element.length > 1){
					element = jQuery(element[0]);
				}
			}
			
			return element;
		}
	};
	
	return pub;
}();

Alipw.initialize();
var A = Alipw;