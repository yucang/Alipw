/**
 * @constructor Alipw.Taskbar
 * @extends Alipw.BorderContainer
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 任务条。用于寄存已打开的Alipw.Window实例。
 * @example
 */

Alipw.Taskbar = Alipw.extend(Alipw.BorderContainer,
/** @lends Alipw.Taskbar.prototype */
{
	baseCls:'alipw-taskbar',
	itemCls:'',
	commitProperties:function(){
		Alipw.Taskbar.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.Taskbar.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.Taskbar.superclass.createDom.apply(this,arguments);
	},
	renderComplete:function(){
		Alipw.Taskbar.superclass.renderComplete.apply(this,arguments);
		
		this.addEventListener('itemclick',function(e){
			e.stopPropagation();
			if(e.target.actived){
				e.target.deactivate();
				e.target.win.minimize(e.target.win.animated);
			}else{
				e.target.activate();
				e.target.win.restore(e.target.win.animated);
				Alipw.ComponentManager.bringToFront(e.target.win);
			}
		},this);
	},
	//protected
	_doLayout:function(){
		Alipw.Taskbar.superclass._doLayout.apply(this,arguments);
	},
	getBarItemByWindow:function(win){
		var taskbarItem;
		Alipw.each(this.items,function(index,item){
			if(item.win == win){
				taskbarItem = item;
				return false;
			}
		});
		return taskbarItem;
	},
	addItem:function(win){
		if(!(win instanceof Alipw.Window) || win.destroyed)return;
		
		var alreadyInTaskbar = false;
		Alipw.each(this.items,function(index,item){
			if(item.win == win){
				alreadyInTaskbar = true;
				return false;
			}
		});
		if(alreadyInTaskbar)return;
		
		var taskbarItem = new Alipw.TaskbarItem({
			win:win,
			text:win.title,
			renderTo:this
		});
		
		return taskbarItem;
	},
	removeItem:function(win){
		if(!(win instanceof Alipw.Window) || win.destroyed)return;
		
		Alipw.each(this.items,function(index,item){
			if(item.win == win){
				this.removeChild(item);
				return false;
			}
		},this);
	}
});