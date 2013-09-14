/**
 * @constructor Alipw.Gallery
 * @extends Alipw.BoxComponent
 * @description A gallery
 * @example
 * var gallery = new Alipw.Gallery({
 * 	renderTo:"galleryWrapper",
 * 	width:640,
 * 	height:480,
 * 	dataProvider:[
 * 		["pictures/1.jpg","pictures/1_s.jpg"],
 * 		["pictures/2.jpg","pictures/2_s.jpg"],
 * 		["pictures/3.jpg","pictures/3_s.jpg"],
 * 		["pictures/4.jpg","pictures/4_s.jpg"]
 * 	]
 * });
 */

Alipw.Gallery = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.Gallery.prototype */
{
	/**
	 * @property
	 * */
	initIndex:0,
	/**
	 * @property
	 * @description defaults to 640
	 * */
	width:640,
	/**
	 * @property
	 * @description defaults to 480
	 * */
	height:480,
	/**
	 * @property
	 * @description defaults to 80
	 * */
	thumbWidth:80,
	/**
	 * @property
	 * @description defaults to 60
	 * */
	thumbHeight:60,
	/**
	 * @property
	 * @description defaults to null
	 * */
	picMaxWidth:null,
	/**
	 * @property
	 * @description defaults to null
	 * */
	picMaxHeight:null,
	/**
	 * @property
	 * */
	dataProvider:[],
	/**
	 * @property
	 * */
	dataProxy:null,
	/**
	 * @property
	 * */
	maxDisplayPage:5,
	/**
	 * @property
	 * */
	gap:10,
	/**
	 * @property
	 * */
	thumbBarPosition:"top",
	/**
	 * @property
	 * */
	prevText:"上一张",
	/**
	 * @property
	 * */
	nextText:"下一张",
	/**
	 * @property
	 * */
	showBigNavBtn:true,
	/**
	 * @property
	 * */
	baseCls:"aliyun-com-gallery",
	constructor:function(){
		Alipw.Gallery.superclass.constructor.apply(this,arguments);
	},
	initialize:function(){
		Alipw.Gallery.superclass.initialize.apply(this,arguments);
		
		this._pageBegin = 0;
		this._pageEnd = 0;
		
		if(this.dataProxy && this.dataProxy.total){
			this.totalLen = this.dataProxy.total;
			this._pageEnd = parseInt(this.dataProvider.length / this.dataProxy.limit) - 1;
			
			this.dataProxy.addEventListener("complete",this.dataLoadHandler,this);
		}else if(this.dataProvider){
			this.totalLen = this.dataProvider.length;
		}
	},
	createDom:function(){
		Alipw.Gallery.superclass.createDom.apply(this,arguments);
		var thumbbarHTML = ['<div class="' + this.baseCls + '-thumbs">',
		            			'<a href="javascript:void(0)" hidefocus="true" class="' + this.baseCls + '-prevBtn"></a>',
		            			'<a href="javascript:void(0)" hidefocus="true" class="' + this.baseCls + '-nextBtn"></a>',
		            			'<div class="' + this.baseCls + '-scrollWrapper">',
		                			'<ul></ul>',
		                		'</div>',
		                	'</div>'].join("");
		
		var picHolderHTML = ['<div class="' + this.baseCls + '-pic">',
			                     '<div class="' + this.baseCls + '-pic-wrap">',
			                     	'<img />',
			                     	'<a href="javascript:void(0)" hidefocus="true" title="' + this.prevText + '" class="' + this.baseCls + '-prevBtn-big"></a>',
			                     	'<a href="javascript:void(0)" hidefocus="true" title="' + this.nextText + '" class="' + this.baseCls + '-nextBtn-big"></a>',
			                     '</div>',
		                     '</div>'].join("");
		
		if(this.thumbBarPosition == "top"){
			this.el.append([
	            '<div class="' + this.baseCls + '-wrap">',
	            	thumbbarHTML,
	            	picHolderHTML,
	            '</div>'].join(""));
		}else if(this.thumbBarPosition == "bottom"){
			this.el.append([
	            '<div class="' + this.baseCls + '-wrap">',
	            	picHolderHTML,
	            	thumbbarHTML,
	            '</div>'].join(""));
		}
	},
	renderComplete:function(){
		Alipw.Gallery.superclass.renderComplete.apply(this,arguments);
		
		this.thumbCon = this.el.find("." + this.baseCls + "-thumbs");

		var thumConHeight = this.thumbHeight + this.gap * 2 + 4;
		this.thumbCon.height(thumConHeight);
		
		var prevBtn = this.el.find("." + this.baseCls + "-prevBtn");
		var nextBtn = this.el.find("." + this.baseCls + "-nextBtn");
		
		prevBtn.bind("click",[this],this.prevBtnClickHandler);
		nextBtn.bind("click",[this],this.nextBtnClickHandler);
		
		prevBtn.height(this.thumbHeight + 4 - 2);
		nextBtn.height(this.thumbHeight + 4 - 2);
		
		var ul = this.el.find("." + this.baseCls + "-scrollWrapper>ul");
		this.scrollWrapper = ul.parent();
		
		this.thumbItems = new Array();
		
		var items = new Array();
		var img;
		for(var i=0,len=this.dataProvider.length;i<len;i++){
			items[i] = this.createThumbItem(i);
			items[i].setSrc(this.dataProvider[i][1]);
			this.thumbItems.push(items[i]);
			ul.append(items[i]);
		}
		
		var imgWidth = this.width - this.gap * 2;
		if(this.picMaxWidth && imgWidth > this.picMaxWidth){
			imgWidth = this.picMaxWidth;
		}
		var imgHeight = this.height - thumConHeight - this.gap * 2;
		if(this.picMaxHeight && imgHeight > this.picMaxHeight){
			imgHeight = this.picMaxHeight;
		}
		
		this.bigPicCon = this.el.find("." + this.baseCls + "-pic");
		
		this.bigImg = this.bigPicCon.find("img");
		this.bigImg.css("opacity","0");
		this.bigImg.bind("load",[imgWidth,imgHeight],this.adjustPicSize);
		this.bigImg.bind("load","bigPic",jQuery.proxy(this.picCompleteHandler,this));
			
		this.bigPicCon.css({
			width: imgWidth + this.gap * 2 + "px",
			height: imgHeight + this.gap * 2 + "px"
		});
		this.bigPicConWrap = this.bigPicCon.find("." + this.baseCls + "-pic-wrap");
		this.bigPicConWrap.css({
			width: imgWidth + "px",
			height: imgHeight + "px",
			padding: this.gap + "px"
		});
		
		var bigPrevBtn = this.el.find("." + this.baseCls + "-prevBtn-big");
		var bigNextBtn = this.el.find("." + this.baseCls + "-nextBtn-big");
		
		if(!this.showBigNavBtn){
			bigPrevBtn.hide();
			bigNextBtn.hide();
		}
		bigPrevBtn.bind("click",[this],this.prevBtnClickHandler);
		bigNextBtn.bind("click",[this],this.nextBtnClickHandler);
		
		if(this.dataProxy && (!this.dataProvider || this.dataProvider.length < 1)){
			this.dataProvider = [];
			this.loadItems(0);
		}else{
			this.gotoPic(this.initIndex);
		}
	},
	/**
	 * @public
	 * */
	gotoPic:function(index){
		var _this = this;
		
		if(this.currentIndex == index){
			//return;
		}
		
		if(index == "next"){
			if(this.currentIndex < this.thumbItems.length-1){
				index = this.currentIndex + 1;
			}else{
				//index = 0;
				return;
			}
		}else if(index == "prev"){
			if(this.currentIndex > 0){
				index = this.currentIndex - 1;
			}else{
				//index = this.thumbItems.length -1;
				return;
			}
		}
		
		if(!this.dataProvider[index]){
			return;
		}
		
		var lastIndex = this.currentIndex;
		this.currentIndex = index;
		
		if(this.thumbItems[lastIndex]){
			this.thumbItems[lastIndex].removeClass("on");
			this.thumbItems[lastIndex].stop();
			this.thumbItems[lastIndex].animate({
				opacity:0.4
			},300);
		}
		
		this.thumbItems[index].addClass("on");
		this.thumbItems[index].stop();
		this.thumbItems[index].animate({
			opacity:1
		},100);
		
		this.scrollWrapper.stop();
		var sLeft = (this.thumbWidth + 4 + this.gap) * index - (this.thumbCon.width() - (this.thumbWidth + this.gap + 4))/2;
		var maxSLeft = (this.thumbWidth + 4 + this.gap) * this.totalLen - this.thumbCon.width();
		
		var lessThanOnePage = false;
		if(maxSLeft < 0){
			sLeft = maxSLeft / 2;
			lessThanOnePage = true;
		}else if(sLeft < 0){
			sLeft = 0;
		}else if(sLeft > maxSLeft){
			sLeft = maxSLeft;
		}
		
		//if the blank area appears
		if(!lessThanOnePage){
			if((this.thumbWidth + 4 + this.gap) * this.thumbItems.length - sLeft < this.thumbCon.width()){
				this.loadItems(this._pageEnd + 1);
				this.clearThumbItems("header");
			}else if(this._leftSpacer - sLeft > 0){
				this.loadItems(this._pageBegin - 1);
				this.clearThumbItems("footer");
			}
		}
		
		if(sLeft >= 0){
			this.scrollWrapper.animate({
				scrollLeft: sLeft
			},600, "easeOutExpo");
		}else{
			this.scrollWrapper.attr("scrollLeft",0);
			this.scrollWrapper.find("ul").css("margin-left",(-sLeft) + "px");
		}
		
		this.bigPicConWrap.removeClass("load-complete");
		
		if(this.isLoadingBigPic){
			this.bigImg.stop();
			this.bigImg.css("opacity","0");
			this.bigImg.css("filter","alpha(opacity=0)");
			this.bigImg.attr("src","");
			this.bigImg.attr("src",_this.dataProvider[index][0]);
		}else{
			this.isLoadingBigPic = true;
			this.bigImg.stop();
			this.bigImg.animate({
				opacity:0
			},300,function(){
					_this.bigImg.attr("src","");
					_this.bigImg.attr("src",_this.dataProvider[index][0]);
			});
		}
	},
	//private
	itemClickHandler:function(e){
		var _this = e.data[0];
		var index = e.data[1];
		
		_this.gotoPic(index);
	},
	//private
	adjustPicSize:function(e){
		Alipw.adjustImgSize(e.currentTarget, e.data[0], e.data[1]);
	},
	//private
	picCompleteHandler:function(e){
		var target = $(e.currentTarget);
		
		//target.stop(); cannot add stop() here in IE6/7/8 and it's not necessary
		
		if(e.data == "bigPic"){
			this.isLoadingBigPic = false;
		};
		
		target.animate({
			opacity: 1
		},300,function(){
			target.css("filter","");
		});
		
		target.parent().addClass("load-complete");
	},
	//private
	itemMouseOverHandler:function(e){
		var _this = e.data[0];
		var index = e.data[1];
		
		if(index == _this.currentIndex){
			return;
		}
		
		jQuery(e.currentTarget).stop();
		jQuery(e.currentTarget).animate({
			opacity:1
		},100);
	},
	//private
	itemMouseOutHandler:function(e){
		var _this = e.data[0];
		var index = e.data[1];
		
		if(index == _this.currentIndex){
			return;
		}
		
		jQuery(e.currentTarget).stop();
		jQuery(e.currentTarget).animate({
			opacity:0.4
		},300);
	},
	//private
	prevBtnClickHandler:function(e){
		var _this = e.data[0];
		
		_this.gotoPic("prev");
	},
	//private
	nextBtnClickHandler:function(e){
		var _this = e.data[0];
		
		_this.gotoPic("next");
	},
	//private
	dataLoadHandler:function(e){
		var count;
		var proxy = e.currentTarget;
		eval(e.content);
		if(count){
			proxy.total = count;
			this.totalLen = count;
		}
		
		var len = this.dataProvider.length;
		this.dataProvider = this.dataProvider.concat(data);
		
		if(this.dataProvider.length > this.dataProxy.total){
			var num = this.dataProvider.length - this.dataProxy.total;
			var start = this.dataProvider.length - num;
			this.dataProvider.splice(start, num);
		}
		
		var from = len;
		var to = from+data.length;
		if(to > this.totalLen){
			to = this.totalLen;
		}
		
		var ul = this.el.find("." + this.baseCls + "-scrollWrapper>ul");
		for(var i=from;i<to;i++){
			if(!this.thumbItems[i]){
				this.thumbItems[i] = this.createThumbItem(i);
				ul.append(this.thumbItems[i]);
			}
			this.thumbItems[i].setSrc(this.dataProvider[i][1]);
		}
		
		if(!Alipw.isSet(this.currentIndex)){
			this.gotoPic(this.initIndex);
		}
	},
	//private
	createThumbItem:function(index){
		var i = index;
		var item = jQuery('<li style="margin-right:' + this.gap + 'px; width:' + this.thumbWidth + 'px; height:' + this.thumbHeight + 'px;"><div class="' + this.baseCls + '-highlightArrow"></div></li>');

		var img = jQuery('<img style="width:' + this.thumbWidth + 'px; height:' + this.thumbHeight + 'px" />');
		img.css("opacity","0");
		img.css("filter","alpha(opacity=0)");
		img.bind("load",[this.thumbWidth,this.thumbHeight], this.adjustPicSize);
		img.bind("load",jQuery.proxy(this.picCompleteHandler,this));
		item.bind("click", [this,i], this.itemClickHandler);
		item.bind("mouseover", [this,i], this.itemMouseOverHandler);
		item.bind("mouseout", [this,i], this.itemMouseOutHandler);
		
		item.append(img);
		
		item.setSrc = function(url){
			jQuery(this).find("img").attr("src",url);
		};
		
		return item;
	},
	//private
	loadItems:function(index){
		var limit = this.dataProxy.limit;
		var ul = this.el.find("." + this.baseCls + "-scrollWrapper>ul");
		if(index < this._pageBegin){
			for(var i=index*limit+limit-1,to=index*limit;i>=to;i--){
				if(this.thumbItems[i] && this.thumbItems[i]._removed){
					ul.prepend(this.thumbItems[i]);
					
					this.thumbItems[i]._removed = false;
				}
			}
			this._leftSpacer -= this.dataProxy.limit * (this.thumbWidth + 4 + this.gap);
			ul.css("margin-left",this._leftSpacer + "px");
			this._pageBegin -= 1;
		}else{
			var loadNum = limit;
			var undisplayedNum = this.totalLen - limit * (this._pageEnd + 1);
			if(undisplayedNum < limit){
				loadNum = undisplayedNum;
			}

			var newItem;
			
			for(var i=0;i<loadNum;i++){
				newItem = this.createThumbItem(limit * index + i);
				this.thumbItems.push(newItem);
				ul.append(newItem);
			}
			
			this._pageEnd += 1;
			if(this.dataProxy){
				this.dataProxy.load(index);
			}
		}
	},
	//private
	clearThumbItems:function(from){
		if(!this._leftSpacer){
			this._leftSpacer = 0;
		}
		
		var ul = this.el.find("." + this.baseCls + "-scrollWrapper>ul");
		var limit = this.dataProxy.limit;
		var total = this.dataProxy.total;
		if(this._pageEnd - this._pageBegin + 1 > this.maxDisplayPage){
			if(from == "header"){
				for(var i=this._pageBegin * limit,to=this._pageBegin * limit + limit;i<to;i++){
					if(this.thumbItems[i] && !this.thumbItems[i]._removed){
						this.thumbItems[i]._removed = true;
						this.thumbItems[i].parent()[0].removeChild(this.thumbItems[i][0]);
					}
				}
				this._leftSpacer += this.dataProxy.limit * (this.thumbWidth + 4 + this.gap);
				ul.css("margin-left",this._leftSpacer + "px");
				this._pageBegin += 1;
			}else{
				var to;
				if((this._pageEnd + 1) * limit > total){
					to = total;
				}else{
					to = (this._pageEnd + 1) * limit;
				}
				for(var i=this._pageEnd * limit;i<to;i++){
					if(this.thumbItems[i] && !this.thumbItems[i]._removed){
						this.thumbItems[i]._removed = true;
						//this.thumbItems[i].parent()[0].removeChild(this.thumbItems[i][0]);
						
						this.thumbItems[i].remove();
					}
				}
				
				var num = this.thumbItems.length-this._pageEnd * limit;
				var start = this._pageEnd * limit;
				this.thumbItems.splice(start,num);
				this.dataProvider.splice(start,num);
				
				this._pageEnd -= 1;
			}
		}
	}
});