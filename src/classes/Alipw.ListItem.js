/**
 * @constructor Alipw.ListItem
 * @extends Alipw.BoxComponent
 * @description List控件中的列表项目。
 * @example
 * 
 */

Alipw.ListItem = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.ListItem.prototype */
{
	baseCls:'alipw-listitem',
	overCls:'alipw-listitem-over',
	downCls:'alipw-listitem-down',
	selectedCls:'alipw-listitem-selected',
	index:null,
	selected:false,
	autoHeight:false,
	visibleRender:false,
	height:14,
	text:'',
	data:null,
	constructor:function(){
		Alipw.ListItem.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.ListItem.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.ListItem.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.ListItem.superclass.createDom.apply(this,arguments);
		this.el.append(new Alipw.Template(
			[
			 '<span class="{$baseCls}-text"></span>'
			]
		).set({'baseCls':this.baseCls}).compile());
	},
	renderComplete:function(){
		Alipw.ListItem.superclass.renderComplete.apply(this,arguments);
		this.setText(this.text);
		
		this.addEventListener('click',this.clickHandler,this,true);
	},
	//protected
	_doLayout:function(){
		Alipw.ListItem.superclass._doLayout.apply(this,arguments);
	},
	getTextWidth:function(){
		return this.el.find('.' + this.baseCls + '-text').outerWidth(true) + this.el.innerWidth() - this.el.width();
	},
	setText:function(text){
		this.el.find('.' + this.baseCls + '-text').text(this.text);
	},
	select:function(isUserOperation){
		this.el.addClass(this.selectedCls);
		this.selected = true;
		this.fireEvent('select',{
			isUserOperation:isUserOperation
		},false);
	},
	unselect:function(){
		this.el.removeClass(this.selectedCls);
		this.selected = false;
		this.fireEvent('unselect',{},false);
	},
	//private
	clickHandler:function(e){
		e.preventDefault();
		this.fireEvent('itemclick',{},false);
	}
});