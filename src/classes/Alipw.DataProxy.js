/**
 * @constructor Alipw.DataProxy
 * @extends Alipw.Nonvisual
 * @description 
 */

Alipw.DataProxy = Alipw.extend(Alipw.Nonvisual,
/** @lends Alipw.DataProxy.prototype */
{
	/**
	 * @property
	 * */
	total:1,
	/**
	 * @property
	 * */
	limit:1,
	/**
	 * @property
	 * */
	indexFrom:0,
	/**
	 * @property
	 * */
	limitParamName:"limit",
	/**
	 * @property
	 * */
	pageParamName:"page",
	constructor:function(){
		Alipw.DataProxy.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.DataProxy.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.DataProxy.superclass.initialize.apply(this,arguments);
	},
	/**
	 * @public
	 */
	load:function(index){
		if(this.limit * index >= this.total){
			//throw
			return;
		}
		var dpx = this;
		var sendingData = new Object();
		sendingData[this.limitParamName] = this.limit;
		sendingData[this.pageParamName] = index + this.indexFrom;
		jQuery.ajax({
			url:this.url,
			data:sendingData,
			success:function(data){
				dpx.fireEvent("complete",{
					content:data,
					index:index
				});
			}
		});
	}
});





/**
 * @name Alipw.DataProxy#complete
 * @event
 * @param {Object} e 
 */