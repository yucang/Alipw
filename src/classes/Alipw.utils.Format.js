/** 
* @class
* @type singleton
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description 格式处理工具
* @demo http://aliyun-ued.com/alipw/samples/format.html
*/
Alipw.utils.Format = function(){
	
	
	var pub = 
	/**
	 * @lends Alipw.utils.Format
	 */ 
	{
		/**
		* YY,YYYY - year
		* MM,M - month
		* DD,D - day
		*/
		date:function(date,format){
			date = new Date(date);
			if(isNaN(date) || date == 'Invalid Date'){
				return 'Invalid Date';
			}
			
			var year = date.getFullYear().toString();
			var month = (date.getMonth() + 1).toString();
			var day = date.getDate().toString();
			
			var YY = year.substr(2,2);
			var YYYY = year;
			var MM = month.length < 2 ? '0' + month : month;
			var M = month;
			var DD = day.length < 2 ? '0' + day : day;
			var D = day;
			
			var output = format;
			output = output.replace(/YYYY/g,YYYY);
			output = output.replace(/YY/g,YY);
			output = output.replace(/MM/g,MM);
			output = output.replace(/M/g,M);
			output = output.replace(/DD/g,DD);
			output = output.replace(/D/g,D);
			
			return output;
		}
	};
	
	return pub;
}();