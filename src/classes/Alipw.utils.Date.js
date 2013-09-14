/** 
* @class
* @type singleton
* @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
* @description 日期数据处理工具。可将日期数据转换为制定格式的字符串，也可以将字符串按照指定格式转换为日期数据。
* @demo http://aliyun-ued.com/alipw/samples/date.html
*/
Alipw.utils.Date = function(){
	
	
	var pub = 
	/**
	 * @lends Alipw.utils.Date
	 */ 
	{
		/**
		* YY,YYYY - year
		* MM,M - month
		* DD,D - day
		*/
		format:function(date,format){
			if(!(date instanceof Date) || isNaN(date) || date == 'Invalid Date')return 'Invalid Date';
			
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
		},
		parse:function(string,format){
			var exp = /YYYY|MM|DD|YY|M|D/g;
			var str = format;
			str = str.replace(/([\$\^\*\(\)\+\=\{\}\[\]\|\/\:\<\>\.\?\'\"])/g,"\\$1");
			var groups = new Array();
			str = str.replace(exp,function(string){
				groups.push(string);
				if(string == 'YYYY'){
					return '(\\d{4})';
					
				}else if(string == 'MM'){
					return '([0-1][0-9])';
					
				}else if(string == 'DD'){
					return '([0-3][0-9])';
					
				}else if(string == 'YY'){
					return '(\\d{2})';
					
				}else if(string == 'M'){
					return '([1]?[0-9])';
					
				}else if(string == 'D'){
					return '([1-3]?[0-9])';
				}
			});
			str = '^' + str + '$';
			var regex = new RegExp(str);
			
			var matches = string.match(regex);
			
			var year,month,day;
			if(matches){
				for(var i=1,len=matches.length;i<len;i++){
					var value = matches[i];
					var type = groups[i-1];
					if(type == 'YYYY'){
						year = value;
					}else if(type == 'YY'){
						year = (new Date()).getFullYear().toString().substr(0,2) + value;
					}else if(type == 'MM'){
						month = value;
					}else if(type =='M'){
						if(value.length == 1){
							value = '0' + value;
						}
						month = value;
					}else if(type == 'DD'){
						day = value;
					}else if(type == 'D'){
						if(value.length == 1){
							value = '0' + value;
						}
						day = value;
					}
				}
			}
			
			return new Date(year + '/' + month + '/' + day);
		}
	};
	
	return pub;
}();