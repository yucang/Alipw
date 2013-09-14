/**
 * @constructor Alipw.Slider
 * @extends Alipw.Component
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 滑动条数据选择器。
 * @demo http://aliyun-ued.com/alipw/samples/slider.html
 * @example
 * 
 */

Alipw.Slider = Alipw.extend(Alipw.Component,
/** @lends Alipw.Slider.prototype */
{
	/**
	 * @property
	 * @type Number
	 * @default 200
	 * @description [config option]定义Slider的宽度。
	 */
	width:200,
	/**
	 * @property
	 * @type String
	 * @default 'horizontal'
	 * @description [config option]定义Slider的类型（水平或竖直），可选值有'horizontal','vertical'。
	 */
	type:"horizontal",
	/**
	 * @property
	 * @type String
	 * @default 'head'
	 * @description [config option]定义Slider值域的方向。可选值有'head','foot'。若为'head'，则水平模式的左侧为最小值，右侧为最大值，垂直方向的顶部为最小值，底部为最大值；若为'foot'，则反之。
	 */
	valueFrom:"head",
	/**
	 * @property
	 * @type Number
	 * @default 0
	 * @description [config option][property]作为配置选项，定义Slider的初始值。作为属性，指示Slider当前的值。
	 */
	value:0,
	/**
	 * @property
	 * @type Number
	 * @default 0
	 * @description [config option]作为配置选项，定义Slider的初始值。作为属性，指示Slider当前的值。
	 */
	values:null,
	/**
	 * @property
	 * @type Number
	 * @default 0
	 * @description [config option]定义Slider值域内的最小步长。若为0，则视为不设置最小步长。此设置仅在values属性为设置或者values数组长度为0时才有效。
	 */
	step:0,
	/**
	 * @property
	 * @type Boolean
	 * @default true
	 * @description [config option]定义是否填充选值区域。
	 */
	showFill:true,
	/**
	 * @property
	 * @type Number
	 * @default 0
	 * @description [config option]定义Slider的起始值。
	 */
	minValue:0,
	/**
	 * @property
	 * @type Number
	 * @default 100
	 * @description [config option]定义Slider的终点值。
	 */
	maxValue:100,
	/**
	 * @property
	 * @type String
	 * @default 'alipw-slider'
	 * @description [config option]定义class名称的基本前缀。
	 */
	baseCls:"alipw-slider",
	constructor:function(){
		Alipw.Slider.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.Slider.superclass.commitProperties.apply(this,arguments);
		if(!this.values){
			this.values = new Array();
		}
		
		if(this.values.length == 0 && this.step){
			var len = parseInt((this.maxValue - this.minValue) / this.step);
			this.values = new Array();
			for(var i=1;i<=len;i++){
				this.values.push(this.minValue + i * this.step);
			}
		}
	},
	initialize:function(){
		Alipw.Slider.superclass.initialize.apply(this,arguments);
		this.sliderDragManager = new Object();//name space
	},
	createDom:function(){
		Alipw.Slider.superclass.createDom.apply(this,arguments);
		this.el.append(['<div class="' + this.baseCls + '-wrap">',
			                '<div class="' + this.baseCls + '-track">',
	                     		'<span class="' + this.baseCls + '-track-left">',
	                     			'<span class="' + this.baseCls + '-track-right">',
	                     				'<span class="' + this.baseCls + '-track-center">',
	                     				'</span>',
	                     			'</span>',
	                     		'</span>',
	                     		'<div class="' + this.baseCls + '-track-fill">',
		                     		'<span class="' + this.baseCls + '-track-fill-left">',
		                     			'<span class="' + this.baseCls + '-track-fill-right">',
		                     				'<span class="' + this.baseCls + '-track-fill-center">',
		                     				'</span>',
		                     			'</span>',
		                     		'</span>',
	                     		'</div>',
	                     	'</div>',
	                     	'<div class="' + this.baseCls + '-block">',
		                     	'<span class="' + this.baseCls + '-block-left">',
	                     			'<span class="' + this.baseCls + '-block-right">',
	                     				'<span class="' + this.baseCls + '-block-center">',
		                     				'<span class="' + this.baseCls + '-block-bg">',
		                     				'</span>',
	                     				'</span>',
	                     			'</span>',
	                     		'</span>',
	                     	'</div>',
                     	'</div>'].join(""));
		
		if(this.type == "vertical"){
			this.el.find("." + this.baseCls + "-wrap").addClass("alipw-slider-vertical");
		}
		
		this._block = this.el.find("." + this.baseCls + "-block");
		this._fill = this.el.find("." + this.baseCls + "-track-fill");
		this._track = this.el.find("." + this.baseCls + "-track");
		
		var _this = this;
		
		this._track.setHeight = function(height){
			if(_this.type !== "vertical"){
				return;
			}
			
			var innerCon = _this.el.find("." + _this.baseCls + "-track-center");
			var innerHeight =  innerCon.height();
			var outerHeight = _this.el.find("." + _this.baseCls + "-track").outerHeight();
			var d = outerHeight - innerHeight;
			innerCon.height(height - d);
		};
		
		this._fill.setHeight = function(height){
			if(_this.type !== "vertical"){
				return;
			}
			
			var innerCon = _this.el.find("." + _this.baseCls + "-track-fill-center");
			var innerHeight =  innerCon.height();
			var outerHeight = _this.el.find("." + _this.baseCls + "-track-fill").outerHeight();
			var d = outerHeight - innerHeight;
			innerCon.height(height - d);
		};
		
		this._block.setHeight = function(height){
			if(_this.type !== "vertical"){
				return;
			}
			
			var innerCon = _this.el.find("." + _this.baseCls + "-block-center");
			var innerHeight =  innerCon.height();
			var outerHeight = _this.el.find("." + _this.baseCls + "-block").outerHeight();
			var d = outerHeight - innerHeight;
			innerCon.height(height - d);
		};
		
		this._block.centerBg = function(){
			var blockInnerHeight = _this.el.find("." + _this.baseCls + "-block-center").height();
			var bg = _this.el.find("." + _this.baseCls + "-block-bg");
			bg.css("margin-top",parseInt((blockInnerHeight - bg.height())/2));
		};
	},
	renderComplete:function(){
		Alipw.Slider.superclass.renderComplete.apply(this,arguments);
		
		var _this = this;
		if(!this.showFill){
			this._fill.hide();
		}
		
		if(this.valueFrom == "foot"){
			if(this.type == "vertical"){
				this._fill.css({
					top:"auto",
					bottom:"0"
				});
			}else{
				this._fill.css({
					left:"auto",
					right:"0"
				});
			}
		}
		
		this._block.hover(function(e){
			$(e.currentTarget).addClass(_this.baseCls + "-block-hover");
		},function(e){
			$(e.currentTarget).removeClass(_this.baseCls + "-block-hover");
		});
		
		this._track.bind("mousedown",jQuery.proxy(this.trackMouseDownHander_Slider,this));
		
		this._block.bind("mousedown",function(e){
			e.preventDefault();
			$(e.currentTarget).addClass(_this.baseCls + "-block-down");
			
			_this.getReady_Slider(e);
		});
		
		jQuery(document).bind("mousemove",jQuery.proxy(this.move_Slider,this));
		jQuery(document).bind("mouseup",jQuery.proxy(this.release_Slider,this));
		
		jQuery(document).bind("mouseup",function(e){
			_this._block.removeClass(_this.baseCls + "-block-down");
		});
		
		this.setValue(this.value);
	},
	//protected
	_doLayout:function(){
		Alipw.Slider.superclass._doLayout.apply(this,arguments);
		if(this.width){
			if(this.type == "vertical"){
				this.el.height(this.width);
			}else{
				this.el.width(this.width);
			}
		}
		
		if(this.type == "vertical"){
			//set the height of the track
			this._track.setHeight(this.width);
			
			//center the block background
			this._block.centerBg();
		}
	},
	setValue:function(value){
		this.applyValue_Slider(value);
	},
	//private
	applyValue_Slider:function(value,isUserOperation){
		if(value > this.maxValue){
			value = this.maxValue;
		}else if(value < this.minValue){
			value = this.minValue;
		}
		
		this.adjustBlockPosition_Slider(value);
		
		if(value != this.value){
			this.value = value;
			this.fireEvent("valueChange",{
				value:value
			},false);
			
			if(isUserOperation){
				this.fireEvent("change",{
					value:value
				},false);
			}
		}
	},
	//private
	adjustBlockPosition_Slider:function(value){
		var left = this.getCoordXByValue_Slider(value);

		if(this.type == "vertical"){
			this._block.offset({
				top:left
			});
			this._block.css('top',parseInt(this._block.css('top')) + 'px');
			if(this.valueFrom == "foot"){
				this._fill.setHeight(this.el.offset().top + this.el.height() - left - parseInt(this._block.outerHeight()/2));
			}else{
				this._fill.setHeight(left - this.el.offset().top + parseInt(this._block.outerHeight()/2));
			}
		}else{
			this._block.offset({
				left:left
			});
			this._block.css('left',parseInt(this._block.css('left')) + 'px');
			
			if(this.valueFrom == "foot"){
				this._fill.width(this.el.offset().left + this.el.width() - left - parseInt(this._block.outerWidth()/2));
			}else{
				this._fill.width(left - this.el.offset().left + parseInt(this._block.outerWidth()/2));
			}
		}
	},
	//private
	getReady_Slider:function(e){
		if(!this.enabled)return;
		
		e.preventDefault();
		this.sliderDragManager.ready = true;
		this.sliderDragManager._dx = this._block.offset().left - e.pageX;
		this.sliderDragManager._dy = this._block.offset().top - e.pageY;
	},
	//private
	move_Slider:function(e){
		if(!this.enabled || !this.sliderDragManager.ready)return;
		e.preventDefault();
		
		var v = this.type == "vertical";

		if(!this.sliderDragManager.dragging){
			this.sliderDragManager.dragging = true;
		}

		var value = this.getValueByCoord_Slider(v?(e.pageY + this.sliderDragManager._dy):(e.pageX + this.sliderDragManager._dx));
		this.applyValue_Slider(value,true);
	},
	//private
	release_Slider:function(e){
		if(!this.enabled)return;
		
		this.sliderDragManager.dragging = false;
		this.sliderDragManager.ready = false;
	},
	//private
	getCoordXByValue_Slider:function(value){
		var v = this.type == "vertical";
		
		var blockWidth = v?this._block.outerHeight():this._block.outerWidth();
		var slideCoord = v?this.el.offset().top:this.el.offset().left;
		var slideWidth = v?this.el.height():this.el.width();
		var left;
		
		if(this.valueFrom == "head"){
			left = slideCoord + ((value - this.minValue) / (this.maxValue - this.minValue)) * (slideWidth - blockWidth);
		}else if(this.valueFrom == "foot"){
			left = slideCoord + slideWidth - blockWidth - ((value - this.minValue) / (this.maxValue - this.minValue)) * (slideWidth - blockWidth);
		}
		left = parseInt(left);
		
		return left;
	},
	//private
	getValueByCoord_Slider:function(left){
		var v = this.type == "vertical";
		
		var blockWidth = v?this._block.outerHeight():this._block.outerWidth();
		var slideCoord = v?this.el.offset().top:this.el.offset().left;
		var slideWidth = v?this.el.height():this.el.width();
		
		if(left < slideCoord){
			left = slideCoord;
		}else if(left + blockWidth > slideCoord + slideWidth){
			left = slideCoord + slideWidth - blockWidth;
		}
		
		var value;
		if(this.valueFrom == "head"){
			value = this.minValue + (this.maxValue - this.minValue) * ((left - slideCoord)/(slideWidth - blockWidth));
		}else if(this.valueFrom == "foot"){
			value = this.minValue + (this.maxValue - this.minValue) * ((slideCoord + slideWidth - blockWidth - left)/(slideWidth - blockWidth));
		}
		
		var d = -1;//for chrome weird bug.
		var nearestValue;
		if(this.values.length > 0){
			for(var i=0,len=this.values.length;i<len;i++){
				if(this.values[i] > this.minValue && this.values[i] < this.maxValue ){
					if(d == -1 || Math.abs(value - this.values[i]) < d){		
						d = Math.abs(value - this.values[i]);
						nearestValue = this.values[i];
					}
				}
			}
			
			if(Math.abs(value - this.minValue) < d){
				d = Math.abs(value - this.minValue);
				nearestValue = this.minValue;
			}
			
			if(Math.abs(value - this.maxValue) < d){
				d = Math.abs(value - this.maxValue);
				nearestValue = this.maxValue;
			}
			
			value = nearestValue;
		}
		
		return value;
	},
	//private
	trackMouseDownHander_Slider:function(e){
		var v = this.type == "vertical";
		var blockSize = [this._block.outerWidth(),this._block.outerHeight()];
		var value = this.getValueByCoord_Slider(v?(e.pageY - parseInt(blockSize[1] / 2)):(e.pageX - parseInt(blockSize[0] / 2)));
		this.applyValue_Slider(value,true);
	}
});