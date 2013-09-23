/**
 * @constructor Alipw.List
 * @extends Alipw.BorderContainer
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 数据展示列表。用于展示列表型数据的容器。
 * @demo http://aliyun-ued.com/alipw/samples/list.html
 * @example
 * 
 */

Alipw.List = Alipw.extend(Alipw.BorderContainer,
/** @lends Alipw.List.prototype */
{
	baseCls:'alipw-list',
	selectedCls:'alipw-listitem-selected',
	scroll:true,
	store:null,
	selectable:true,
	multipleSelection:false,
	displayField:'text',
	valueField:'value',
	value:null,
	width:200,
	maxHeight:null,
	createFieldEl:true,
	applyTo:null,
	autoWidth:false,
	commitProperties:function(){
		Alipw.List.superclass.commitProperties.apply(this,arguments);
		
		//private and cannot be common
		this.storeChangeHandler_List = function(){
			if(this.destroyed)return;
			this.updateListItems();
		};
	},
	initialize:function(){
		Alipw.List.superclass.initialize.apply(this,arguments);
		this.listItems = new Array();
		this.selectedItems = new Array();
	},
	createDom:function(){
		Alipw.List.superclass.createDom.apply(this,arguments);
		this.renderListItem();
	},
	renderComplete:function(){
		Alipw.List.superclass.renderComplete.apply(this,arguments);
		
		if(this.scroll){
			this.getBody().css('overflow-y','auto');
		}
		
		if(this.store instanceof Alipw.DataStore){
			this.store.addEventListener('change',this.storeChangeHandler_List,this);
		}
	},
	destroy:function(){
		Alipw.List.superclass.destroy.apply(this,arguments);
		
		if(this.store instanceof Alipw.DataStore){
			this.store.removeEventListener('change',this.storeChangeHandler_List);
		}
	},
	getContentWidth:function(){
		var maxListItemWidth = 0;
		var listItemWidth;
		Alipw.each(this.listItems,function(i,o){
			listItemWidth = o.getTextWidth();
			if(listItemWidth > maxListItemWidth){
				maxListItemWidth = listItemWidth;
			}
		});
		
		var width = this.getWidthByBody(maxListItemWidth);
		
		var listbody = this.getBody();
		if(listbody[0].scrollHeight > listbody.innerHeight() && this.scroll){
			width += Alipw.getScrollbarSize().width;
		}
		return width;
	},
	//protected
	_doLayout:function(){
		if(this.autoWidth){
			this.width = this.getContentWidth();
		}
		
		Alipw.List.superclass._doLayout.apply(this,arguments);
		
		//for IE6,7 bug
		if(Alipw.isIE6 || Alipw.isIE7){
			if(this.getBody()[0].style.height == 'auto'){
				this.getBody().css('overflow-y','hidden');
			}else if(this.scroll){
				this.getBody().css('overflow-y','auto');
			}
		}
	},
	renderListItem:function(){
		if(!(this.store instanceof Alipw.DataStore)) return;
		
		var data = this.store.getData();
		Alipw.each(data,function(i,o){
			var listItem = new Alipw.ListItem({
				text:data[i][this.displayField],
				value:data[i][this.valueField],
				data:data[i],
				selectedCls:this.selectedCls,
				index:i,
				renderTo:this
			});
			
			if(this.value && this.value == data[i][this.valueField]){
				if(this.multipleSelection || (!this.multipleSelection && this.selectedItems.length == 0)){
					listItem.select();
					this.selectedItems.push(listItem);
				}
			}
			
			listItem.addEventListener('itemclick',this.itemClickHandler_List,this);
			listItem.addEventListener('select',this.selectHandler_List,this);
			this.listItems.push(listItem);
			
		},this);
	},
	setValue:function(value){
		if(Alipw.isSet(value) && this.listItems.length > 0){
			var muti = this.multipleSelection;
			var valueArray = muti?value.split(','):null;
			
			var foundSelected = false;
			Alipw.each(this.listItems,function(i,item){
				if(!muti){
					if(item.value == value && !foundSelected){
						foundSelected = true;
						item.select();
					}else{
						item.unselect();
						Alipw.removeItemFromArray(item,this.selectedItems);
					}
				}else{
					if(Alipw.indexOfArray(item.value,valueArray) != -1){
						item.select();
					}
				}
			},this);
			
			if(!muti){
				if(!foundSelected){
					this.value = '';
				}
			}else{
				
			}
		}
	},
	setStore:function(store){
		if(store instanceof Alipw.DataStore){
			if(this.store instanceof Alipw.DataStore){
				this.store.removeEventListener('change',this.storeChangeHandler_List);
			}
			this.store = store;
			this.storeChangeHandler_List();
			this.store.addEventListener('change',this.storeChangeHandler_List,this);
		}
	},
	updateListItems:function(){
		Alipw.each(this.listItems,function(index,el){
			el.destroy();
		});
		this.listItems.splice(0,999999999);
		this.selectedItems.splice(0,99999999);
		
		this.renderListItem();
	},
	//private
	applyValue_List:function(value,fireChangeEvent){
		var oldValue = this.value;
		this.value = value;
		if(oldValue != value){
			this.fireEvent('valueChange',{},false);
			if(fireChangeEvent){
				this.fireEvent('change',{},false);
			}
		}
	},
	//private
	itemClickHandler_List:function(e){
		var listItem = e.currentTarget;
		
		var oldValue = this.value;
		if(this.selectable){
			listItem.select(true);
		}
		this.fireEvent('itemclick',{
			index:listItem.index,
			item:listItem
		},false);
	},
	//private
	selectHandler_List:function(e){
		var listItem = e.currentTarget;
		
		if(!this.multipleSelection){
			if(Alipw.indexOfArray(listItem,this.selectedItems) != -1)return;
			Alipw.each(this.selectedItems,function(index,item){
				item.unselect();
				Alipw.removeItemFromArray(item,this.selectedItems);
			},this);
		}else{
			if(Alipw.indexOfArray(listItem,this.selectedItems) != -1){
				listItem.unselect();
				Alipw.removeItemFromArray(listItem,this.selectedItems);
				return;
			}
		}

		this.selectedItems.push(listItem);
		
		if(!this.multipleSelection){
			this.applyValue_List(listItem.value,e.isUserOperation);
		}else{
			
		}

		this.fireEvent('select',{
			index:listItem.index,
			item:listItem
		},false);
	}
});