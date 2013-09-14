/**
 * @class Alipw.WinProxy
 * @type singleton
 * @extends Alipw.Nonvisual
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description Window对象的代理对象。
 */

Alipw.WinProxy = function(){
	var pub = new Alipw.Nonvisual({
		autoInit:false
	});

	return pub;
}();