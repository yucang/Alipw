/** 
* @class
* @type singleton
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description URL参数字串格式数据转换工具。
* @demo http://aliyun-ued.com/alipw/samples/query-string.html
*/
Alipw.utils.QueryString = function(){
	var pub = 
	/**
	 * @lends Alipw.utils.QueryString
	 */ 
	{
		encode:function(queryString,stringDecoder){
			if(!Alipw.isSet(stringDecoder))stringDecoder = window.decodeURIComponent;
			
			var object = new Object();
			var arr = queryString.split('&');
			var data;
			for(var i=0,len=arr.length;i<len;i++){
				data = arr[i].split('=');
				object[stringDecoder(data[0])] = stringDecoder(data[1]);
			}
			
			return object;
		},
		decode:function(queryObject,stringEncoder){
			if(!Alipw.isSet(stringEncoder))stringEncoder = window.encodeURIComponent;
			
			var array = new Array();
			for(var i in queryObject){
				array.push(stringEncoder(i) + '=' + stringEncoder(queryObject[i]));
			}
			
			return array.join('&');
		}
	};
	
	return pub;
}();