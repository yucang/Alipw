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
	 * @description 数据。
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
	 * @description 获取数据。
	 * @return {Array} 数据。
	 */
	getData:function(){
		return this.data;
	}
});