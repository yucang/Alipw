/**
 * @constructor Alipw.DataStore
 * @extends Alipw.Nonvisual
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 数据存储器。
 */

Alipw.DataStore = Alipw.extend(Alipw.Nonvisual,
/** @lends Alipw.DataStore.prototype */
{
	/**
	 * @property
	 * @type Array
	 * @description 数据记录集。
	 */
	data:null,
	constructor:function(){
		Alipw.DataStore.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.DataStore.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.DataStore.superclass.initialize.apply(this,arguments);
	},
	/**
	 * @public
	 * @description 获取数据
	 * @return {Array} 数据记录集
	 */
	getData:function(){
		return this.data;
	},
	/**
	 * @public
	 * @description 查询数据记录
	 * @param {Object} query 查询条件。查询条件包含以下属性：<ul><li>filter {Object} 过滤条件</li><li>count {Number}条数</li>sort {String} 配需规则<li></li></ul>
	 * @return {Array} 数据记录集
	 */
	get:function(query){
		var filter = query.filter;
		var count = query.count;
		var sort = query.sort?query.sort.split(' '):null;
		
		var output = new Array();
		for(var i=0,len=this.data.length;i<len;i++){
			if(filter){
				var match = true;
				for(var prop in filter){
					if(this.data[i][prop] != filter[prop]){
						match = false;
					}
				}
				if(match){
					output.push(this.data[i]);
				}
			}else{
				output.push(this.data[i]);
			}
		}
		
		if(sort){
			this.sortByField_DataStore(output, sort[0], sort[1]);
		}
		
		if(count){
			output.splice(count, Number.MAX_VALUE);
		}
		
		return output;
	},
	/**
	 * @public
	 * @description 插入数据
	 * @param {Array} records 要插入的数据集
	 */
	insert:function(records){
		if(!(records instanceof Array)){
			return;
		}
		
		for(var i=0,len=records.length;i<len;i++){
			this.data.push(records[i]);
		}
		
		this.fireEvent('change');
	},
	/**
	 * @public
	 * @description 更新数据
	 * @param {Array} records 要更新的数据集
	 * @param {Object} query 更新的字段和值
	 */
	update:function(records, query){
		if(!(records instanceof Array) || !query || typeof(query) != 'object'){
			return;
		}
		
		for(var i=0,len=records.length;i<len;i++){
			jQuery.extend(records[i],query);
		}
		
		this.fireEvent('change');
	},
	/**
	 * @public
	 * @description 删除数据
	 * @param {Array} records 要删除的数据集
	 */
	del:function(records){
		for(var i=0,len=this.data.length;i<len;i++){
			for(var rec=0,reclen=records.length;rec<reclen;rec++){
				if(this.data[i] === records[rec]){
					this.data.splice(i,1);
					len = this.data.length;
					i--;
					break;
				}
			}
		}
		
		this.fireEvent('change');
	},
	/**
	 * @public
	 * @description 对数据进行排序
	 * @param {String} field 排序的字段
	 * @param {String} order 升序或降序。可选值有 'asc','desc'
	 */
	sort:function(field, order){
		this.sortByField_DataStore(this.data, field, order);
		this.fireEvent('change');
	},
	//private
	sortByField_DataStore:function(records, field, order){
		if(!(records instanceof Array)){
			return;
		}
		
		if(!Alipw.isSet(order)){
			order = 'asc';
		}
		//if sort by a function
		if(arguments[1] instanceof Function){
			records.sort(arguments[1]);
			return;
		}
		
		records.sort(function(a,b){
			var aValue = a[field];
			var bValue = b[field];
			var result;
			
			if(Alipw.isSet(aValue) && !Alipw.isSet(bValue)){
				result = 1;
			}else if(!Alipw.isSet(aValue) && Alipw.isSet(bValue)){
				result = -1;
			}else if(!Alipw.isSet(aValue) && !Alipw.isSet(bValue)){
				result = -1;
			}else if(aValue > bValue){
				result = 1;
			}else{
				result = -1;
			}
			
			if(order == 'asc'){
				return result;	
			}else if(order == 'desc'){
				return result * -1;
			}
		});
	}
});