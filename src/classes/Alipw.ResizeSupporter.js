/**
 * @constructor Alipw.ResizeSupporter
 * @extends Alipw.Nonvisual
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 缩放支持类。该类可应用与盒状可视控件(Alipw.BoxComponent)使其能够通过鼠标拖拽来改变尺寸。
 */

Alipw.ResizeSupporter = Alipw.extend(Alipw.Nonvisual,
/** @lends Alipw.ResizeSupporter.prototype */
{
	target:"",
	minWidth:16,
	minHeight:16,
	maxWidth:"",
	maxHeight:"",
	constructor:function(){
		Alipw.ResizeSupporter.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.ResizeSupporter.superclass.commitProperties.apply(this,arguments);
		
		if(this.target instanceof Alipw.Component){
			this.targetEl = this.target.el;
		}else{
			this.targetEl = Alipw.convertEl(this.target);
		}
	},
	initialize:function(){
		Alipw.ResizeSupporter.superclass.initialize.apply(this,arguments);
		
		if(this.targetEl.css("position") == "static"){
			this.targetEl.addClass("alipw-resizesupporter");
		}

		this.topLeftCorner = jQuery('<div class="alipw-resizesupporter-edge alipw-resizesupporter-edge-top-left"></div>');
		this.topCenterCorner = jQuery('<div class="alipw-resizesupporter-edge alipw-resizesupporter-edge-top-center"></div>');
		this.topRightCorner = jQuery('<div class="alipw-resizesupporter-edge alipw-resizesupporter-edge-top-right"></div>');
		this.middleLeftCorner = jQuery('<div class="alipw-resizesupporter-edge alipw-resizesupporter-edge-middle-left"></div>');
		this.middleRightCorner = jQuery('<div class="alipw-resizesupporter-edge alipw-resizesupporter-edge-middle-right"></div>');
		this.bottomLeftCorner = jQuery('<div class="alipw-resizesupporter-edge alipw-resizesupporter-edge-bottom-left"></div>');
		this.bottomCenterCorner = jQuery('<div class="alipw-resizesupporter-edge alipw-resizesupporter-edge-bottom-center"></div>');
		this.bottomRightCorner = jQuery('<div class="alipw-resizesupporter-edge alipw-resizesupporter-edge-bottom-right"></div>');
		
		this.targetEl
			.append(this.topCenterCorner)
			.append(this.middleLeftCorner)
			.append(this.middleRightCorner)
			.append(this.bottomCenterCorner)
			.append(this.topLeftCorner)
			.append(this.topRightCorner)
			.append(this.bottomLeftCorner)
			.append(this.bottomRightCorner);
		
		this.topLeftCorner.bind("mousedown",jQuery.proxy(this.getReady_ResizeSupporter,this));
		this.topCenterCorner.bind("mousedown",jQuery.proxy(this.getReady_ResizeSupporter,this));
		this.topRightCorner.bind("mousedown",jQuery.proxy(this.getReady_ResizeSupporter,this));
		this.middleLeftCorner.bind("mousedown",jQuery.proxy(this.getReady_ResizeSupporter,this));
		this.middleRightCorner.bind("mousedown",jQuery.proxy(this.getReady_ResizeSupporter,this));
		this.bottomLeftCorner.bind("mousedown",jQuery.proxy(this.getReady_ResizeSupporter,this));
		this.bottomCenterCorner.bind("mousedown",jQuery.proxy(this.getReady_ResizeSupporter,this));
		this.bottomRightCorner.bind("mousedown",jQuery.proxy(this.getReady_ResizeSupporter,this));
		
		//create non-prototype-common functions to bind document
		var moveHandler = Alipw.createFuncProxy(this.move_ResizeSupporter,this);
		var releaseHandler = Alipw.createFuncProxy(this.release_ResizeSupporter,this);

		jQuery(document).bind("mousemove",moveHandler);
		jQuery(document).bind("mouseup",releaseHandler);
		this.addEventListener('destroy',function(){
			jQuery(document).unbind("mousemove",moveHandler);
			jQuery(document).unbind("mouseup",releaseHandler);
		},this);
		
		//for the damn ie 6!
		if(parseInt(Alipw.ie()) < 7){
			var _proxyResize4IE6 = function (){
				this.middleRightCorner.height(this.targetEl.height());
				this.middleLeftCorner.height(this.targetEl.height());
				this.topCenterCorner.width(this.targetEl.width());
				this.bottomCenterCorner.width(this.targetEl.width());
			};
			
			_proxyResize4IE6.call(this);
			this.targetEl.bind("resize",jQuery.proxy(_proxyResize4IE6,this));
			this.addEventListener('destroy',function(){
				this.targetEl.unbind("resize",_proxyResize4IE6);
			},this);
		}
	},
	enable:function(){
		Alipw.ResizeSupporter.superclass.enable.apply(this,arguments);
		this.topLeftCorner.show();
		this.topCenterCorner.show();
		this.topRightCorner.show();
		this.middleLeftCorner.show();
		this.middleRightCorner.show();
		this.bottomLeftCorner.show();
		this.bottomCenterCorner.show();
		this.bottomRightCorner.show();
	},
	disable:function(){
		Alipw.ResizeSupporter.superclass.disable.apply(this,arguments);
		this.topLeftCorner.hide();
		this.topCenterCorner.hide();
		this.topRightCorner.hide();
		this.middleLeftCorner.hide();
		this.middleRightCorner.hide();
		this.bottomLeftCorner.hide();
		this.bottomCenterCorner.hide();
		this.bottomRightCorner.hide();
	},
	//private
	getReady_ResizeSupporter:function(e){
		if(!this.enabled)return;
		
		e.preventDefault();
		e.stopPropagation();
		
		if(e.currentTarget.setCapture){
			e.currentTarget.setCapture();
		}else if(window.captureEvents){  
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		}
		this.ready = true;
		
		if(e.currentTarget.className.indexOf("edge-top-left") != -1){
			this.type = "nw";
		}else if(e.currentTarget.className.indexOf("edge-top-center") != -1){
			this.type = "n";
		}else if(e.currentTarget.className.indexOf("edge-top-right") != -1){
			this.type = "ne";
		}else if(e.currentTarget.className.indexOf("edge-middle-left") != -1){
			this.type = "w";
		}else if(e.currentTarget.className.indexOf("edge-middle-right") != -1){
			this.type = "e";
		}else if(e.currentTarget.className.indexOf("edge-bottom-left") != -1){
			this.type = "sw";
		}else if(e.currentTarget.className.indexOf("edge-bottom-center") != -1){
			this.type = "s";
		}else if(e.currentTarget.className.indexOf("edge-bottom-right") != -1){
			this.type = "se";
		}
		
		var targetW,targetH,tagetX,targetY;
		if(this.target instanceof Alipw.Component){
			targetW = this.target.getWidth();
			targetH = this.target.getHeight();
			targetX = this.target.getX();
			targetY = this.target.getY();
		}else{
			targetW = this.targetEl.width();
			targetH = this.targetEl.height();
			targetX = this.targetEl.offset().left;
			targetY = this.targetEl.offset().top;
		}
		
		var p_topleft = [targetX, targetY];
		var p_topright = [targetX + targetW, targetY];
		var p_bottomleft = [targetX, targetY + targetH];
		var p_bottomright = [targetX + targetW, targetY + targetH];
		
		this.originalPoints = [p_topleft, p_topright, p_bottomleft, p_bottomright];
		
		if(this.target instanceof Alipw.Component && this.target.position == "fixed"){
			this.anchor = [e.clientX, e.clientY];
		}else{
			this.anchor = [e.pageX, e.pageY];
		}
	},
	//private
	move_ResizeSupporter:function(e){
		if(!this.enabled || !this.ready)return;
		e.preventDefault();

		if(!this.resizing){
			this.resizing = true;
			
			if(!this.resizeProxy){
				this.resizeProxy = new Alipw.BorderContainer({
					cls:"alipw-resizeproxy",
					width:this.targetEl.width(),
					height:this.targetEl.height(),
					floating:true,
					position:(this.target instanceof Alipw.Component)?this.target.position:""
				});
				
				this.addEventListener('destroy',function(){
					if(this.resizeProxy){
						this.resizeProxy.destroy();
						this.resizeProxy = null;
					}
				},this);
			}
			
			this.resizeProxy.el.css("cursor",this.type + "-resize");
			Alipw.ComponentManager.bringToFront(this.resizeProxy);
			this.resizeProxy.show();
			
			this.resizeProxy.setPosition(this.originalPoints[0][0],this.originalPoints[0][1]);
		}
		
		var mouseXY = this.resizeProxy.position == "fixed"?[e.clientX,e.clientY]:[e.pageX,e.pageY];
		
		var tWidth,tHeight,baseSpot,needRelocatingX,needRelocatingY;
		if(this.type == "se"){
			tWidth = mouseXY[0] - this.originalPoints[0][0] + (this.originalPoints[3][0] - this.anchor[0]);
			tHeight = mouseXY[1] - this.originalPoints[0][1] + (this.originalPoints[3][1] - this.anchor[1]);
		}else if(this.type == "s"){
			tHeight = mouseXY[1] - this.originalPoints[0][1] + (this.originalPoints[3][1] - this.anchor[1]);
		}else if(this.type == "e"){
			tWidth = mouseXY[0] - this.originalPoints[0][0] + (this.originalPoints[3][0] - this.anchor[0]);
		}else if(this.type == "nw"){
			tWidth = this.originalPoints[3][0] - mouseXY[0] + (this.anchor[0] - this.originalPoints[0][0]);
			tHeight = this.originalPoints[3][1] - mouseXY[1] + (this.anchor[1] - this.originalPoints[0][1]);
			needRelocatingX = true;
			needRelocatingY = true;
			baseSpot = this.originalPoints[3];
		}else if(this.type == "n"){
			tHeight = this.originalPoints[3][1] - mouseXY[1] + (this.anchor[1] - this.originalPoints[0][1]);
			needRelocatingY = true;
			baseSpot = this.originalPoints[2];
		}else if(this.type == "w"){
			tWidth = this.originalPoints[3][0] - mouseXY[0] + (this.anchor[0] - this.originalPoints[0][0]);
			needRelocatingX = true;
			baseSpot = this.originalPoints[1];
		}else if(this.type == "sw"){
			tWidth = this.originalPoints[1][0] - mouseXY[0] + (this.anchor[0] - this.originalPoints[2][0]);
			tHeight = mouseXY[1] - this.originalPoints[1][1] + (this.originalPoints[2][1] - this.anchor[1]);
			needRelocatingX = true;
			baseSpot = this.originalPoints[1];
		}else if(this.type == "ne"){
			tWidth = mouseXY[0] - this.originalPoints[2][0] + (this.originalPoints[1][0] - this.anchor[0]);
			tHeight = this.originalPoints[2][1] - mouseXY[1] + (this.anchor[1] - this.originalPoints[1][1]);
			needRelocatingY = true;
			baseSpot = this.originalPoints[2];
		}
		
		if(this.minWidth && tWidth < this.minWidth){
			tWidth = this.minWidth;
		}else if(this.maxWidth && tWidth > this.maxWidth){
			tWidth = this.maxWidth;
		}
		
		if(this.minHeight && tHeight < this.minHeight){
			tHeight = this.minHeight;
		}else if(this.maxHeight && tHeight > this.maxHeight){
			tHeight = this.maxHeight;
		}
		
		var newPosX = needRelocatingX?this.resizeProxy.setPosition(baseSpot[0] - tWidth):null;
		var newPosY = needRelocatingY?this.resizeProxy.setPosition(null, baseSpot[1] - tHeight):null;
		
		if(Alipw.isSet(tWidth)){
			this.resizeProxy.setWidth(tWidth);
		}
		if(Alipw.isSet(tHeight)){
			this.resizeProxy.setHeight(tHeight);
		}
		
		if(Alipw.isSet(newPosX) || Alipw.isSet(newPosY)){
			this.resizeProxy.setPosition(newPosX,newPosY);
		}
	},
	//private
	release_ResizeSupporter:function(e){
		if(!this.enabled || !this.ready)return;
		
		if(e.currentTarget.releaseCapture){
			e.currentTarget.releaseCapture();  
		}else if(window.releaseEvents){  
			window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		}
		
		if(this.resizing){
			this.resizing = false;
	
			if(this.target instanceof Alipw.Component){
				this.target.setWidth(this.resizeProxy.getWidth());
				this.target.setHeight(this.resizeProxy.getHeight());
				if(this.target.el.css('position') == 'fixed' || this.target.el.css('position') == 'absolute'){
					this.target.setPosition(this.resizeProxy.getX(),this.resizeProxy.getY());
				}
			}else{
				this.targetEl.width(this.resizeProxy.getWidth() - (this.targetEl.outerWidth() - this.targetEl.width()));
				this.targetEl.height(this.resizeProxy.getHeight() - (this.targetEl.outerHeight() - this.targetEl.height()));
				if(this.targetEl.css('position') == 'fixed' || this.targetEl.css('position') == 'absolute'){
					this.targetEl.offset({
						x:this.resizeProxy.getX(),
						y:this.resizeProxy.getY()
					});
				}
			}
		}
		if(this.resizeProxy){
			this.resizeProxy.setVisible(false);
		}
		this.ready = false;
	},
	//private
	getHandledPosition_ResizeSupporter:function(left,top){
		var jWin = jQuery(window);
		var winWidth = jWin.width();
		var winHeight = jWin.height();
		var docWidth = Alipw.getDocWidth();
		var docHeight = Alipw.getDocHeight();
		var targetWidth,targetHeight; 
		targetWidth = this.targetEl.outerWidth();
		targetHeight = this.targetEl.outerHeight();

		
		if(this.target.position == "fixed"){
			if(left < 10){
				left = 10;
			}else if(left + targetWidth > winWidth - 10){
				left = winWidth - targetWidth - 10;
			}
			
			if(top < 10){
				top = 10;
			}else if(top + targetHeight > winHeight - 10){
				top = winHeight - targetHeight - 10;
			}
		}else{
			var conWidth = winWidth > docWidth? winWidth : docWidth;
			var conHeight = winHeight > docHeight? winHeight : docHeight;
			
			if(left < 10){
				left = 10;
			}else if(left + targetWidth > conWidth - 10){
				left = conWidth - targetWidth - 10;
			}

			if(top < 10){
				top = 10;
			}else if(top + targetHeight > conHeight - 10){
				top = conHeight - targetHeight - 10;
			}
		}
		
		return [left,top];
	}
});