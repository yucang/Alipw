/**
 * @constructor
 * @extends Alipw.Component
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 分页控件。
 * @demo http://aliyun-ued.com/alipw/samples/pagination.html
 */

Alipw.Pagination = Alipw.extend(Alipw.Component,
/**
 * @lends Alipw.Pagination.prototype
 */
{
	baseCls:'alipw-pagination',
	total:0,
	pageSize:20,
	pageTotal:0,
	pageItemTemplate:'<a href="#">{$pageText}</a>',
	totalInfoTemplate:'共{$total}条记录',
	currentPage:1,
	maxSiblingItemNum:10,
	prevText:'上一页',
	nextText:'下一页',
	jumpText:'跳转',
	showTotalInfo:false,
	allowPageJump:false,
	constructor:function(config){
		Alipw.Pagination.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Pagination.superclass.commitProperties.apply(this,arguments);
		this.total = parseInt(this.total);
		this.pageSize = parseInt(this.pageSize);
		if(!this.total || this.total < 0)this.total = 0;
		if(!this.pageSize || this.pageSize < 0)this.pageSize = 0;
	},
	initialize:function(){
		Alipw.Pagination.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.Pagination.superclass.createDom.apply(this,arguments);
	},
	render:function(obj){
		Alipw.Pagination.superclass.render.apply(this,arguments);
	},
	renderComplete:function(updating){
		Alipw.Pagination.superclass.renderComplete.apply(this,arguments);
		this.createPageItems_Pagination();
		this.setCurrentPage(this.currentPage);
		this.addEventListener('click',this.pageItemClickHandler_Pagination,this,true);
		this.addEventListener('mouseover',this.pageItemMouseOverHandler_Pagination,this,true);
		this.addEventListener('mouseout',this.pageItemMouseOutHandler_Pagination,this,true);
	},
	setCurrentPage:function(pageIndex, isUserOperation){
		if(pageIndex > this.pageTotal){
			pageIndex = this.pageTotal;
		}
		
		if(typeof(pageIndex) != 'number' || pageIndex <= 0){
			pageIndex = 1;
		}
		
		var pageChanged = pageIndex != this.currentPage;
		var lastPage = this.currentPage;
		this.currentPage = pageIndex;
		
		this.renderPageItems_Pagination();
		
		if(pageIndex > 0){
			if(lastPage > 0 && this.pageItems[lastPage - 1]){
				this.pageItems[lastPage - 1].removeClass(this.baseCls + '-current');
			}
			if(this.pageItems[pageIndex - 1]){
				this.pageItems[pageIndex - 1].addClass(this.baseCls + '-current');
			}
		}
		
		if(pageChanged){
			this.fireEvent('pageChange',{},false);
			
			if(isUserOperation){
				this.fireEvent('change',{},false);
			}
		}
	},
	getPageTotal:function(){
		if(this.total == 0 || this.pageSize == 0)return 0;
		
		this.pageTotal = parseInt(this.total / this.pageSize) + (this.total % this.pageSize > 0 ? 1 : 0);
		return this.pageTotal;
	},
	updatePage:function(options){
		this.getPageTotal();
		this.renderPageItems_Pagination();
		if(this.pageTotal == 0 ){
			this.setCurrentPage(0);
		}else if(this.currentPage > this.pageTotal){
			this.setCurrentPage(this.pageTotal);
		}
	},
	//protected
	_doLayout:function(){
		Alipw.BoxComponent.superclass._doLayout.apply(this,arguments);
	},
	//private
	createPageItems_Pagination:function(){		
		this.pageItems = new Array();
		
		this.leftEllipsis = jQuery('<span class="' + this.baseCls + '-ellipsis">…</span>');
		this.rightEllipsis = jQuery('<span class="' + this.baseCls + '-ellipsis">…</span>');
		this.prevBtn = new Alipw.Template(this.pageItemTemplate).set({'pageText':this.prevText}).compile();
		this.prevBtn.addClass(this.baseCls + '-prev');
		this.nextBtn = new Alipw.Template(this.pageItemTemplate).set({'pageText':this.nextText}).compile();
		this.nextBtn.addClass(this.baseCls + '-next');
		this.jumpBtn = new Alipw.Template(this.pageItemTemplate).set({'pageText':this.jumpText}).compile();
		this.jumpBtn.addClass(this.baseCls + '-jump');
		
		this.jumpInputBox = jQuery('<input type="text" class="' + this.baseCls + '-jump-input"/>');
		//number only
		this.jumpInputBox.bind('keypress',jQuery.proxy(function(e){
			if(e.keyCode == 13 && Alipw.isNumeric(this.jumpInputBox.val())){
				this.setCurrentPage(parseInt(this.jumpInputBox.val()),true);
				return;
			}
			
			var charCode;
			if(Alipw.isIE){
				charCode = e.keyCode;
			}else{
				charCode = e.charCode;
			}
			if((charCode < 48 || charCode > 57) && charCode != 0){
				e.preventDefault();
			}
		},this));
		var validate = jQuery.proxy(function(e){
			value = this.jumpInputBox.val();
			if(!Alipw.isNumeric(value)){
				this.jumpInputBox.val('');
			}
		},this);
		this.jumpInputBox.bind('keyup keypress change', validate);
		
		this.totalInfo = jQuery('<span class="' + this.baseCls + '-info"></span>');
		this.totalInfo.html(new Alipw.Template(this.totalInfoTemplate).set({'total':this.total}).html);
	},
	//private
	renderPageItems_Pagination:function(){
		this.totalInfo.html(new Alipw.Template(this.totalInfoTemplate).set({'total':this.total}).html);
		
		//remove existing items
		for(var i in this.pageItems){
			if(Alipw.isIntegral(i)){
				this.pageItems[i].detach();
				this.pageItems[i].removeClass(this.baseCls + '-hover');
			}
		}
		
		if(this.total <= 0){
			if(this.currentPage > 0 && this.pageItems[this.currentPage - 1]){
				this.pageItems[this.currentPage - 1].removeClass(this.baseCls + '-current');
			}
			this.leftEllipsis.detach();
			this.rightEllipsis.detach();
			this.prevBtn.detach();
			this.nextBtn.detach();
			this.jumpBtn.detach();
			this.jumpInputBox.detach();
			if(this.showTotalInfo){
				this.el.append(this.totalInfo);
			}
			return;
		}
		
		if(this.currentPage <= 0){
			return;
		}
		
		var range = this.getDisplayedItemsIndex_Pagination();
		
		var start,end;
		if(range){
			start = range[0];
			end = range[1];
		}else{
			start = 0;
			end = this.pageTotal - 1;
		}

		for(var i=start;i <= end;i++){
			this.el.append(this.getPageItem_Pagination(i));
		}

		this.prevBtn.removeClass(this.baseCls + '-hover');
		this.nextBtn.removeClass(this.baseCls + '-hover');
		this.jumpBtn.removeClass(this.baseCls + '-hover');
		
		var hasEllipsis = false;
		if(range && range[0] != 0){
			if(range[0] > 1){
				this.el.prepend(this.leftEllipsis);
				hasEllipsis = true;
			}else{
				this.leftEllipsis.detach();
			}
			this.el.prepend(this.getPageItem_Pagination(0));
		}else{
			this.leftEllipsis.detach();
		}
		
		if(range && range[1] < this.pageTotal - 1){
			if(range[1] < this.pageTotal - 2){
				this.el.append(this.rightEllipsis);
				hasEllipsis = true;
			}else{
				this.rightEllipsis.detach();
			}
			this.el.append(this.getPageItem_Pagination(this.pageTotal - 1));
		}else{
			this.rightEllipsis.detach();
		}
		
		if(this.currentPage != 1 && this.pageTotal > 0){
			this.el.prepend(this.prevBtn);
		}else{
			this.prevBtn.detach();
		}
		if(this.currentPage != this.pageTotal){
			this.el.append(this.nextBtn);
		}else{
			this.nextBtn.detach();
		}
		
		if(this.showTotalInfo){
			this.el.prepend(this.totalInfo);
		}
		
		if(this.allowPageJump && hasEllipsis){
			this.el.append(this.jumpInputBox);
			this.el.append(this.jumpBtn);
		}else{
			this.jumpInputBox.detach();
			this.jumpBtn.detach();
		}
	},
	//private
	pageItemClickHandler_Pagination:function(e){
		e.preventDefault();
		var index = this.getPageItemIndexByTarget_Pagination(e.target);
		if(index > -1){
			this.setCurrentPage(index + 1, true);
		}else if(index == -100){
			if(this.currentPage > 1){
				this.setCurrentPage(this.currentPage - 1, true);
			}
		}else if(index == -101){
			if(this.currentPage < this.pageTotal){
				this.setCurrentPage(this.currentPage + 1, true);
			}
		}else if(index == -102){
			var jumpPage = this.jumpInputBox.val();
			if(Alipw.isNumeric(jumpPage)){
				this.setCurrentPage(parseInt(jumpPage), true);
			}
		}
	},
	//private
	pageItemMouseOverHandler_Pagination:function(e){
		var index = this.getPageItemIndexByTarget_Pagination(e.target);
		if(index > -1){
			this.pageItems[index].addClass(this.baseCls + '-hover');
		}else if(index == -100){
			this.prevBtn.addClass(this.baseCls + '-hover');
		}else if(index == -101){
			this.nextBtn.addClass(this.baseCls + '-hover');
		}else if(index == -102){
			this.jumpBtn.addClass(this.baseCls + '-hover');
		}
	},
	//private
	pageItemMouseOutHandler_Pagination:function(e){
		var index = this.getPageItemIndexByTarget_Pagination(e.target);
		if(index > -1){
			this.pageItems[index].removeClass(this.baseCls + '-hover');
		}else if(index == -100){
			this.prevBtn.removeClass(this.baseCls + '-hover');
		}else if(index == -101){
			this.nextBtn.removeClass(this.baseCls + '-hover');
		}else if(index == -102){
			this.jumpBtn.removeClass(this.baseCls + '-hover');
		}
	},
	//private
	getPageItemIndexByTarget_Pagination:function(target){
		var index = -1;
		
		if(target == this.prevBtn[0]){
			index = -100;
		}else if(target == this.nextBtn[0]){
			index = -101;
		}else if(target == this.jumpBtn[0]){
			index = -102;
		}else if(target.id.indexOf(this.id + '-index-') == 0){
			index = parseInt(target.id.split(this.id + '-index-')[1]);
		}
		
		if(target == this.el[0]){
			return -1;
		}else if(index == -1){
			return this.getPageItemIndexByTarget_Pagination(target.parentNode);
		}else{
			return index;
		}
	},
	//private
	getDisplayedItemsIndex_Pagination:function(){
		if(this.pageTotal <= this.maxSiblingItemNum || this.currentPage == 0){
			return null;
		}
		
		var currentIndex = this.currentPage - 1;
		var leftSiblingNum,rightSiblingNum;
		if(this.maxSiblingItemNum % 2 == 0){
			leftSiblingNum = rightSiblingNum = this.maxSiblingItemNum / 2;
		}else{
			leftSiblingNum = parseInt(this.maxSiblingItemNum / 2);
			rightSiblingNum = this.maxSiblingItemNum - leftSiblingNum;
		}
		
		if(currentIndex - leftSiblingNum < 0){
			leftSiblingNum = currentIndex;
			rightSiblingNum = this.maxSiblingItemNum - leftSiblingNum;
		}else if(currentIndex + rightSiblingNum > this.pageTotal - 1){
			rightSiblingNum = this.pageTotal - 1 - currentIndex;
			leftSiblingNum = this.maxSiblingItemNum - rightSiblingNum;
		}
		
		var firstIndex = currentIndex - leftSiblingNum;
		var lastIndex = currentIndex + rightSiblingNum;
		
		return [firstIndex,lastIndex];
	},
	//private
	getPageItem_Pagination:function(index){
		if(this.pageItems && !this.pageItems[index]){
			this.pageItems[index] = new Alipw.Template(this.pageItemTemplate).set({'pageText':index+1}).compile();
			this.pageItems[index].attr('id',this.id + '-index-' + index);
		}
		return this.pageItems[index];
	}
});