/**
 * @constructor Alipw.ScrollView
 * @extends Alipw.BorderContainer
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 支持无限量数据展示的滚动视图
 * @example
 * 
 */

Alipw.ScrollView = Alipw.extend(Alipw.BorderContainer,
/** @lends Alipw.ScrollView.prototype */
{
	/**
	 * @property
	 * @default 'alipw-scrollview'
	 * @type String
	 * @description [config option]定义基础CSS类名。
	 */
	baseCls:'alipw-scrollview',
	total:100,
	itemHeight:20,
	displayedStartIndex:0,
	displayedLength:0,
	constructor:function(){
		Alipw.ScrollView.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.ScrollView.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.ScrollView.superclass.initialize.apply(this,arguments);
		
		var scrollview = this;
		this.itemManager = function(){
			var items = new Array();
			var itemDisplayStatus = new Object();
			
			var pub = {
				setItemDisplayStatus:function(index,display){
					itemDisplayStatus[index] = display;
				},
				getItemDisplayStatus:function(index){
					return itemDisplayStatus[index];
				},
				getItem:function(index){
					var indexInRenderedItems = index - scrollview.displayedStartIndex;
					if(items[indexInRenderedItems]){
						return items[indexInRenderedItems];
					}else{
						return null;
					}
				},
				getItems:function(){
					return items;
				},
				adjustDisplayedItemNum:function(){
					var actualLength = scrollview.displayedLength;
					
					if(items.length > actualLength){
						for(var i=0;i<items.length;i++){
							if(i < actualLength){
								items[i].show();
							}else{
								items[i].hide();
							}
						}
					}else if(items.length < actualLength){
						for(var i=0;i<actualLength;i++){
							if(items[i]){
								items[i].show();
							}else{
								items[i] = jQuery('<div style="height:' + scrollview.itemHeight + 'px;"></div>');
								items[i].insertBefore(scrollview.footerPlaceHolder);
								scrollview.fireEvent('itemShow',{
									itemIndex:i,
									item:items[i]
								},false);
							}
						}
					}else if(items.length == actualLength){
						for(var i=0;i<actualLength;i++){
							items[i].show();
						}
					}
				}
			};
			
			return pub;
		}();
	},
	createDom:function(){
		Alipw.ScrollView.superclass.createDom.apply(this,arguments);
		
		this.headerPlaceHolder = jQuery('<div></div>');
		this.appendChild(this.headerPlaceHolder);
		this.footerPlaceHolder = jQuery('<div></div>');
		this.appendChild(this.footerPlaceHolder);
	},
	renderComplete:function(){
		Alipw.ScrollView.superclass.renderComplete.apply(this,arguments);

		this.checkViewChange();
		this.getBody().bind('scroll',jQuery.proxy(this.checkViewChange,this));
	},
	//protected
	_doLayout:function(){
		Alipw.ScrollView.superclass._doLayout.apply(this,arguments);
	},
	checkViewChange:function(){
		var oldDisplayedStartIndex = this.displayedStartIndex;
		var oldDisplayedLength = this.displayedLength;
		
		this.updateDisplayedItems_ScrollView();
		
		//if no change for displayed area
		if(this.displayedStartIndex == oldDisplayedStartIndex && this.displayedLength == oldDisplayedLength){
			return;
		}
		
		for(var i=oldDisplayedStartIndex;i<oldDisplayedStartIndex + oldDisplayedLength;i++){
			this.itemManager.setItemDisplayStatus(i,false);
		}
		
		this.itemManager.adjustDisplayedItemNum();
		for(var i=this.displayedStartIndex;i<this.displayedStartIndex + this.displayedLength;i++){
			this.itemManager.setItemDisplayStatus(i,true);
			this.fireEvent('itemShow',{
				itemIndex:i,
				item:this.itemManager.getItem(i)
			});
		}
		
		for(var i=oldDisplayedStartIndex;i<oldDisplayedStartIndex + oldDisplayedLength;i++){
			var displayed = this.itemManager.getItemDisplayStatus(i);
			if(!displayed){
				this.fireEvent('itemHide',{
					itemIndex:i
				});
			}
		}
		var headerPlaceHolderHeight = this.displayedStartIndex * this.itemHeight;
		this.headerPlaceHolder.height(headerPlaceHolderHeight);
		var footerPlaceHolderHeight = (this.total - (this.displayedStartIndex + this.displayedLength))*this.itemHeight;
		this.footerPlaceHolder.height(footerPlaceHolderHeight);
	},
	//private
	renderItems_ScrollView:function(){
		
	},
	//private
	updateDisplayedItems_ScrollView:function(){
		var body = this.getBody();
		var bodyHeight = body.height();
		var scrollTop = body.scrollTop();
		var startIndex = parseInt(scrollTop / this.itemHeight);
		var remainder = scrollTop - startIndex * this.itemHeight;
		var length = Math.ceil((bodyHeight + remainder) / this.itemHeight);
		if(length > this.total - startIndex){
			length = this.total - startIndex;
		}
		this.displayedStartIndex = startIndex;
		this.displayedLength = length;
	}
});