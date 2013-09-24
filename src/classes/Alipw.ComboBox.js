/**
 * @constructor Alipw.ComboBox
 * @extends Alipw.BorderContainer
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 下拉菜单数据选择器。
 * @demo http://aliyun-ued.com/alipw/samples/combobox.html
 * @example
 * 
 */

Alipw.ComboBox = Alipw.extend(Alipw.BorderContainer,
/** @lends Alipw.ComboBox.prototype */
{
	/**
	 * @property
	 * @type String
	 * @default 'alipw-combobox'
	 * @description [config option]HTML元素的class名称的基本前缀。
	 */
	baseCls:'alipw-combobox',
	/**
	 * @property
	 * @type String
	 * @default 'alipw-combobox-over'
	 * @description [config option]鼠标经过时的HTML元素的class名称。
	 */
	overCls:'alipw-combobox-over',
	/**
	 * @property
	 * @type String
	 * @default 'alipw-combobox-down'
	 * @description [config option]鼠标按下时的HTML元素的class名称。
	 */
	downCls:'alipw-combobox-down',
	/**
	 * @property
	 * @type String
	 * @default 'alipw-combobox-disabled'
	 * @description [config option]disable状态的元素class名称。
	 */
	disabledCls:'alipw-combobox-disabled',
	/**
	 * @property
	 * @type String
	 * @default 'alipw-combobox-expanded'
	 * @description [config option]定义下拉菜单展开时的class名称。
	 */
	expandedCls:'alipw-combobox-expanded',
	/**
	 * @property
	 * @type String
	 * @default 'alipw-combobox-expanded-up'
	 * @description [config option]定义下拉菜单向上展开时的class名称。
	 */
	expandedUpCls:'alipw-combobox-expanded-up',
	/**
	 * @property
	 * @type String
	 * @default 'alipw-combobox-expanded-down'
	 * @description [config option]定义下拉菜单向下展开时的class名称。
	 */
	expandedDownCls:'alipw-combobox-expanded-down',
	/**
	 * @property
	 * @type String
	 * @default ''
	 * @description [config option]定义下拉菜单的自定义class名称。
	 */
	listCls:'',
	/**
	 * @property
	 * @type String
	 * @default 'alipw-combobox-list-above'
	 * @description [config option]定义下拉菜单向上展开时的class名称。
	 */
	listAboveCls:'alipw-combobox-list-above',
	/**
	 * @property
	 * @type String
	 * @default 'alipw-combobox-list-underneath'
	 * @description [config option]定义下拉菜单向下展开时的class名称。
	 */
	listUnderneathCls:'alipw-combobox-list-underneath',
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]定义是否显示下拉菜单的阴影。
	 */
	showListShadow:true,
	/**
	 * @property
	 * @type Number
	 * @default 300
	 * @description [config option]定义下拉菜单的最大高度。
	 */
	listMaxHeight:300,
	/**
	 * @property
	 * @type String
	 * @default null
	 * @description [config option]定义或指示当前combo box的值。
	 */
	value:null,
	/**
	 * @property
	 * @type String
	 * @description 指示当前是否为展开状态。
	 */
	expanded:false,
	/**
	 * @property
	 * @type Number
	 * @default 150
	 * @description [config option]定义combo box的宽度。
	 */
	width:150,
	/**
	 * @property
	 * @type Number
	 * @default 24
	 * @description [config option]定义combo box的高度。
	 */
	height:24,
	/**
	 * @property
	 * @type Boolean
	 * @default false
	 * @description [config option]下拉菜单是否自动扩展宽度。
	 */
	listAutoWidth:false,
	/**
	 * @property
	 * @type Alipw.DataStore
	 * @default null
	 * @description [config option]定义combo box的数据寄存器。
	 */
	store:null,
	/**
	 * @property
	 * @type String
	 * @default 'text'
	 * @description [config option]定义combo box的数据显示字段。
	 */
	displayField:'text',
	/**
	 * @property
	 * @type String
	 * @default 'value'
	 * @description [config option]定义combo box的数据值字段。
	 */
	valueField:'value',
	/**
	 * @property
	 * @type String
	 * @default ''
	 * @description [config option]定义combo box的name属性。name属性应用于form提交时的字段名。
	 */
	name:'',
	/**
	 * @property
	 * @type Mixed HTML Element/Selector
	 * @default null
	 * @description [config option]指定combo box通过一个select元素转换为combo box。
	 */
	applyTo:null,
	//read only
	fieldEl:null,
	constructor:function(){
		Alipw.ComboBox.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.ComboBox.superclass.commitProperties.apply(this,arguments);
		
		//private and cannot be common
		this.storeChangeHandler_ComboBox = function(){
			if(this.destroyed)return;
			this.updateStore();
		};
		
		if(this.applyTo){
			this.fieldEl = Alipw.convertEl(this.applyTo);
			if(this.fieldEl[0]){
				var data = new Array();
				this.displayField = 'text';
				this.valueField = 'value';
				this.fieldEl.find('option').each(function(i,el){
					
					var value = $(el).attr('value');
					
					if((Alipw.isIE6 || Alipw.isIE7) && el.attributes['value'].specified == false){
						value = el.innerHTML;
					}else if(!Alipw.isSet(value)){
						value = el.innerHTML;
					}
					
					data.push({
						text:el.innerHTML,
						value:value
					});
				});
				this.store = new Alipw.DataStore({
					'data':data
				});
				this.renderTo = this.fieldEl.parent();
				this.value = this.fieldEl.val();
				if(this.fieldEl.attr('disabled') || this.fieldEl[0].disabled == true){
					this.enabled = false;
				}
				
				//IE6 BUG. can't set js rendered options selected when the select is hidden 
				if(Alipw.isIE6){
					this.fieldEl.css({
						position:'absolute',
						top:'-99999999px',
						left:'-99999999px'
					});
				}else{
					this.fieldEl.hide();
				}
			}
		}
	},
	initialize:function(){
		Alipw.ComboBox.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.ComboBox.superclass.createDom.apply(this,arguments);
		this.appendChild(new Alipw.Template(
			['<div class="{$baseCls}-text"></div>']
		).set({'baseCls':this.baseCls}).compile());
	},
	renderComplete:function(){
		Alipw.ComboBox.superclass.renderComplete.apply(this,arguments);	
		
		this.addEventListener('click',this.clickHandler_ComboBox,this,true);
		
		var documentClickHandler = Alipw.createFuncProxy(this.documentClickHandler_ComboBox,this);
		var windowResizeHandler = Alipw.createFuncProxy(this.windowResizeHandler_ComboBox,this);
		var documentMouseWheelScrollHandler = Alipw.createFuncProxy(this.documentMouseWheelScrollHandler_ComboBox,this);
		
		Alipw.getDoc().bind('click',documentClickHandler);
		Alipw.getWin().bind('resize',windowResizeHandler);
		if(Alipw.isIE || Alipw.isOpera || Alipw.isWebKit){
			Alipw.getDoc().bind('mousewheel',documentMouseWheelScrollHandler);
		}else{
			Alipw.getDoc().bind('DOMMouseScroll',documentMouseWheelScrollHandler);
		}
		this.addEventListener('destroy',function(){
			Alipw.getDoc().unbind('click',documentClickHandler);
			Alipw.getWin().unbind('resize',windowResizeHandler);
			if(Alipw.isIE || Alipw.isOpera || Alipw.isWebKit){
				Alipw.getDoc().unbind('mousewheel',documentMouseWheelScrollHandler);
			}else{
				Alipw.getDoc().unbind('DOMMouseScroll',documentMouseWheelScrollHandler);
			}
			this.fieldEl = null;
		},this);
		
		if(this.fieldEl && this.fieldEl[0]){
			this.el.insertBefore(this.fieldEl);
		}else{
			this.fieldEl = jQuery('<input type="hidden" name="' + this.name + '" style="display:none" value="' + (Alipw.isSet(this.value)?this.value:'') + '" />');
			this.fieldEl.insertAfter(this.el);
		}
		
		this.setValue(this.value);
		
		if(!this.enabled){
			this.setEnabled_ComboBox(false);
		}
		
		if(this.store instanceof Alipw.DataStore){
			this.store.addEventListener('change',this.storeChangeHandler_ComboBox,this);
		}
	},
	//protected
	_doLayout:function(){
		Alipw.ComboBox.superclass._doLayout.apply(this,arguments);
	},
	destroy:function(){
		Alipw.ComboBox.superclass.destroy.apply(this,arguments);
		
		if(this.store instanceof Alipw.DataStore){
			this.store.removeEventListener('change',this.storeChangeHandler_ComboBox);
		}
	},
	/**
	 * @public
	 * @description 展开下拉菜单
	 */
	expand:function(){
		if(!this.enabled || this.expanded)return;
		
		this.__isExpanding = true;
		if(!this.list){
			this.list = new Alipw.List({
				floating:true,
				createFieldEl:false,
				showShadow:this.showListShadow,
				subCls:'alipw-combobox-list',
				cls:this.listCls,
				maxHeight:this.listMaxHeight,
				store:this.store,
				width:this.width,
				displayField:this.displayField,
				valueField:this.valueField,
				value:this.value
			});
			
			this.list.addEventListener('itemclick',this.listItemClickHandler_ComboBox,this);
			this.list.addEventListener('select',this.listSelectHandler_ComboBox,this);
			this.list.addEventListener('change',this.listChangeHandler_ComboBox,this);
			this.list.addEventListener('valueChange',this.listValueChangeHandler_ComboBox,this);
			this.addEventListener('destroy',function(){
				if(this.list){
					this.list.destroy();
				}
			},this);
			
			if(this.listAutoWidth){
				this.list._ComboBox_autoWidth = this.list.getContentWidth();
			}
		}
		
		this.list.setVisible(true);
		var comboWidth = this.getWidth();
		if(this.listAutoWidth && comboWidth < this.list._ComboBox_autoWidth){
			this.list.setWidth(this.list._ComboBox_autoWidth);
		}else{
			this.list.setWidth(comboWidth);
		}
		
		var selectedListItem = this.list.selectedItems[0];
		if(selectedListItem){
			this.list.getBody().scrollTop(this.list.selectedItems[0].el[0].offsetTop - parseInt((this.list.getHeight() - selectedListItem.getHeight())/2));
		}
		
		var comboX = this.getX();
		var comboY = this.getY();
		var x = comboX;
		var y = comboY + this.getHeight();
		var winHeight = jQuery(window).height();
		var listHeight = this.list.getHeight();
		
		if(winHeight - (y - jQuery(document).scrollTop()) < listHeight + 10){
			this.list.el.addClass(this.listAboveCls);
			this.el.addClass(this.expandedUpCls);
			this.list.el.removeClass(this.listUnderneathCls);
			this.el.removeClass(this.expandedDownCls);
			
			y = comboY - listHeight;
		}else{
			this.list.el.removeClass(this.listAboveCls);
			this.el.removeClass(this.expandedUpCls);
			this.list.el.addClass(this.listUnderneathCls);
			this.el.addClass(this.expandedDownCls);
		}

		this.list.setPosition(Math.round(x),Math.round(y));

		Alipw.ComponentManager.bringToFront(this.list);
		
		this.expanded = true;
		this.el.addClass(this.expandedCls);
		this.__isExpanding = false;
	},
	/**
	 * @public
	 * @description 收起下拉菜单
	 */
	collapse:function(){
		if(!this.expanded)return;
		
		if(this.list){
			this.list.setVisible(false);
		}
		this.expanded = false;
		this.el.removeClass(this.expandedCls);
		this.el.removeClass(this.expandedUpCls);
		this.el.removeClass(this.expandedDownCls);
	},
	/**
	 * @public
	 * @description 设置combo box中的显示文本
	 * @param {String} text 文本内容
	 */
	setText:function(text){
		this.el.find('.' + this.baseCls + '-text').text(text);
	},
	/**
	 * @public
	 * @description 设置combo box中的值
	 * @param {String} value 值
	 */
	setValue:function(value){
		var valueChanged = value != this.value;
		this.applyValue_ComboBox(value);
		
		if(this.list){
			this.list.setValue(value);
		}else if(valueChanged){
			this.fireEvent('valueChange',{},false);
			this.fieldEl.triggerHandler('alipw-valueChange');
		}
	},
	/**
	 * @public
	 * @description 设置combo box中的数据寄存器
	 * @param {Alipw.DataStore} store 数据寄存器
	 */
	setStore:function(store){
		if(this.store instanceof Alipw.DataStore){
			this.store.removeEventListener('change',this.storeChangeHandler_ComboBox);
		}
		
		this.store = store;
		this.storeChangeHandler_ComboBox();
		
		if(this.store instanceof Alipw.DataStore){
			this.store.addEventListener('change',this.storeChangeHandler_ComboBox,this);
		}
	},
	/**
	 * @public
	 * @description 更新数据寄存器
	 */
	updateStore:function(){
		if(!this.store)return;
		var data = this.store.getData();
		
		if(this.fieldEl[0].nodeName == 'SELECT'){
			this.fieldEl.empty();
			Alipw.each(data,function(i,item){
				this.fieldEl.append('<option value="' + item[this.valueField] + '">' + item[this.displayField] + '</option>');
			},this);
		}
		
		this.setValue(this.value);
		if(this.value == null && data[0]){
			this.setValue(data[0][this.valueField]);
		}
		if(this.list){
			this.collapse();
			this.list.destroy();
			this.list = null;
		}
	},
	enable:function(){
		Alipw.ComboBox.superclass.enable.apply(this,arguments);
		this.setEnabled_ComboBox(true);
	},
	disable:function(){
		Alipw.ComboBox.superclass.disable.apply(this,arguments);
		this.setEnabled_ComboBox(false);
	},
	//private
	setEnabled_ComboBox:function(enable){
		if(enable){
			this.el.removeClass(this.disabledCls);
			if(this.fieldEl && this.fieldEl[0]){
				this.fieldEl[0].disabled = false;
			}
		}else{
			this.el.addClass(this.disabledCls);
			if(this.fieldEl && this.fieldEl[0]){
				this.fieldEl[0].disabled = true;
			}
		}
	},
	//private
	applyValue_ComboBox:function(value){
		if(!Alipw.isSet(value) || !(this.store instanceof Alipw.DataStore))return;
		this.value = null;
		this.setText('');
		this.fieldEl.val('');
		
		var data = this.store.getData();
		Alipw.each(data,function(i,o){
			if(value == o[this.valueField]){
				this.setText(o[this.displayField]);
				this.value = value;
				this.fieldEl.val(value);
				return false;//break the loop
			}
		},this);
	},
	//private
	clickHandler_ComboBox:function(e){
		if(this.destroyed)return;
		if(this.expanded){
			this.collapse();
		}else{
			this.expand();
		}
	},
	//private
	documentClickHandler_ComboBox:function(e){
		if(this.destroyed)return;
		
		if(Alipw.isInNode(e.target,this.el[0]) || (this.list && Alipw.isInNode(e.target,this.list.el[0]) )){
			return;
		}
		this.collapse();
	},
	//private
	windowResizeHandler_ComboBox:function(e){
		if(this.destroyed)return;
		
		if(this.__isExpanding)return;
		this.collapse();
	},
	//private
	documentMouseWheelScrollHandler_ComboBox:function(e){
		if(this.destroyed)return;
		
		if(this.list){
			if(Alipw.isInNode(e.target,this.list.el[0])){
//				e.preventDefault();
//				
//				var detail;
//				if(Alipw.isIE || Alipw.isOpera || Alipw.isWebKit){
//					detail = -1 * e.wheelDelta / 40;
//				}else{
//					detail = e.detail;
//				}
//				this.list.scrollY(detail * 10);
			}else{
				this.collapse();
			}
		}
	},
	//private
	listItemClickHandler_ComboBox:function(e){
		if(this.destroyed)return;
		this.collapse();
	},
	//private
	listSelectHandler_ComboBox:function(e){
		if(this.destroyed)return;
		this.fireEvent('select',{
			index:e.index,
			item:e.item
		},false);
	},
	//private
	listValueChangeHandler_ComboBox:function(e){
		if(this.destroyed)return;
		var list = e.currentTarget;
		this.applyValue_ComboBox(list.value);
		this.fireEvent('valueChange',{},false);
		this.fieldEl.triggerHandler('alipw-valueChange');
	},
	//private
	listChangeHandler_ComboBox:function(e){
		if(this.destroyed)return;
		this.fireEvent('change',{},false);
		this.fieldEl.trigger('change');
	}
});