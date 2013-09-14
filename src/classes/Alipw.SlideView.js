/**
 * @constructor Alipw.SlideView
 * @extends Alipw.BoxComponent
 * @description 滑动播放视图。
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @demo http://aliyun-ued.com/alipw/samples/slideview.html
 * @example
 * 
 */

Alipw.SlideView = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.SlideView.prototype */
{
	baseCls:'alipw-slideview',
	width:400,
	height:300,
	subviews:null,
	interval:5000,
	showIndex:true,
	currentIndex:0,
	autoPlay:false,
	transferEasing:'easeInOutExpo',
	transferDuration:500,
	constructor:function(){
		Alipw.SlideView.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.SlideView.superclass.commitProperties.apply(this,arguments);
		if(!this.subviews){
			this.subviews = new Array();
		}
	},
	initialize:function(){
		Alipw.SlideView.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.SlideView.superclass.createDom.apply(this,arguments);
		this.el.append(new Alipw.Template(
			[
			 '<div class="{$baseCls}-scrollwrap"></div>',
			 '<div class="{$baseCls}-index-bg"></div>',
			 '<div class="{$baseCls}-index"></div>'
			]
		).set({'baseCls':this.baseCls}).compile());
	},
	renderComplete:function(){
		Alipw.SlideView.superclass.renderComplete.apply(this,arguments);
		this.renderSubviews_SlideView();
		this.renderIndex_SlideView();
		if(this.autoPlay){
			this.play();
		}
		
		var scrollwrap = this.el.find('.' + this.baseCls + '-scrollwrap');
		scrollwrap.bind('mouseover',jQuery.proxy(function(){
			clearInterval(this.autoPlayTimer);
		},this));
		scrollwrap.bind('mouseout',jQuery.proxy(function(){
			if(this.isPlaying){
				this.play();
			}
		},this));
	},
	switchTo:function(index){
		clearInterval(this.autoPlayTimer);
		var scrollwrap = this.el.find('.' + this.baseCls + '-scrollwrap');
		var x = this.width * index * -1;
		this.indexBtnItems[this.currentIndex].removeClass(this.baseCls + '-index-selected');
		this.currentIndex = index;
		this.indexBtnItems[index].addClass(this.baseCls + '-index-selected');
		scrollwrap.stop();
		scrollwrap.animate({
			left:x
		},this.transferDuration,this.transferEasing);
		if(this.isPlaying){
			this.play();
		}
	},
	back:function(){
		var index;
		if(this.currentIndex == 0){
			index = this.subviews.length - 1;
		}else{
			index =  this.currentIndex - 1;
		}
		this.switchTo(index);
	},
	forward:function(){
		var index;
		if(this.currentIndex == this.subviews.length - 1){
			index = 0;
		}else{
			index =  this.currentIndex + 1;
		}
		this.switchTo(index);
	},
	//protected
	_doLayout:function(){
		Alipw.SlideView.superclass._doLayout.apply(this,arguments);
	},
	//private
	renderSubviews_SlideView:function(){
		var scrollwrap = this.el.find('.' + this.baseCls + '-scrollwrap');
		Alipw.each(this.subviews,function(i,el){
			var el = $(el);
			var subviewContainer = $('<div class="' + this.baseCls + '-subview"></div>');
			subviewContainer.width(this.width);
			subviewContainer.height(this.height);
			subviewContainer.append(el);
			scrollwrap.append(subviewContainer);
		},this);
	},
	//private
	renderIndex_SlideView:function(){
		var indexContainer = this.el.find('.' + this.baseCls + '-index');
		var indexBg = this.el.find('.' + this.baseCls + '-index-bg');
		if(!this.showIndex){
			indexContainer.hide();
			indexBg.hide();
		}
		this.indexBtnItems = new Array();
		Alipw.each(this.subviews,function(i,el){
			var indexBtn = $('<a hidefocus="true" href="#">' + (i + 1) + '</a>');
			if(i == this.currentIndex){
				indexBtn.addClass(this.baseCls + '-index-selected');
			}
			this.indexBtnItems.push(indexBtn);
			indexBtn.click(jQuery.proxy(function(e){
				e.preventDefault();
				this.switchTo(i);
			},this));
			if(this.showIndex){
				indexContainer.append(indexBtn);
			}
		},this);
	},
	play:function(){
		var _this = this;
		
		clearInterval(this.autoPlayTimer);
		this.autoPlayTimer = setInterval(function(){
			_this.forward();
		},this.interval);
		this.isPlaying = true;
	},
	stop:function(){
		clearInterval(this.autoPlayTimer);
		this.isPlaying = false;
	}
});