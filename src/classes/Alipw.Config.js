/**
 * @class Alipw.Config
 * @type singleton
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 用于设定Alipw中所有类的默认配置。
 */

Alipw.Config = function(){
	var configs = new Object();
	
	var pub = {
		/**
		 * @public
		 * @description 设定指定类的默认属性
		 * @param {String} className 需要设定属性的类名。例如：'Alipw.Window'
		 * @param {Object} config 需要设定属性集合。
		 */
		set:function(className, config){
			if(!configs[className]){
				configs[className] = new Object();
			}
			
			Alipw.apply(configs[className],config);
			
			pub.applySettings(className);
		},
		get:function(className){
			return configs[className];
		},
		applySettings:function(className){
			var classObject = Alipw.getObjectByName(className);
			if(classObject){
				if(classObject.prototype){
					Alipw.apply(classObject.prototype,configs[className]);
				}else{
					Alipw.apply(classObject,configs[className]);
				}
			}
		}
	};

	return pub;
}();