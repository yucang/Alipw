/** 
* @class
* @type singleton
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description JSON格式数据转换工具。
*/
Alipw.utils.JSON = function(){
	var pub = 
	/**
	 * @lends Alipw.utils.JSON
	 */ 
	{
		encode:function(jsonString){
			return jQuery.parseJSON(jsonString);
		},
		decode:function(jsonObject,stringEncoder){
			if(!Alipw.isSet(stringEncoder))stringEncoder = window.escape;
			
			var array = new Array();
			for(var i in jsonObject){
				array.push('"' + i + '":' + ((typeof(jsonObject[i]) == 'object' && Alipw.isSet(jsonObject[i]))?this.decode(jsonObject[i]):'"' + stringEncoder(jsonObject[i]) + '"'));
			}
			
			return '{' + array.join(',') + '}';
		}
	};
	
	return pub;
}();