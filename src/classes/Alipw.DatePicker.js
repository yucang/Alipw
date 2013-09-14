/**
 * @constructor Alipw.DatePicker
 * @extends Alipw.BorderContainer
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 日期拾取器。
 * @demo http://aliyun-ued.com/alipw/samples/datepicker.html
 * @example
 * 
 */

Alipw.DatePicker = Alipw.extend(Alipw.BorderContainer,
/** @lends Alipw.DatePicker.prototype */
{
	/**
	 * @property
	 * @type Mixed HTML Element/Selector
	 * @description [config option]将DatePicker应用于指定的文本输入框。
	 * @default null
	 */
	applyTo:null,
	/**
	 * @property
	 * @type Number
	 * @description [config option]定义DatePicker的宽度。
	 * @default 260
	 */
	width:260,
	/**
	 * @property
	 * @type String
	 * @description [config option]HTML元素的class名称的基本前缀。
	 * @default 'alipw-datepicker'
	 */
	baseCls:"alipw-datepicker",
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]是否自动渲染。
	 * @default false
	 */
	autoRender:false,
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]是否浮动。
	 * @default true
	 */
	floating:true,
	/**
	 * @property
	 * @type Boolean
	 * @description [config option]是否显示阴影。
	 * @default true
	 */
	showShadow:true,
	/**
	 * @property
	 * @type Date
	 * @description [config option]当前日期。
	 * @default null
	 */
	date:null,
	/**
	 * @property
	 * @type Date
	 * @description [config option]当前被选择的日期。
	 * @default null
	 */
	selectedDate:null,
	/**
	 * @property
	 * @type Date
	 * @description [config option]定义可选的最大日期
	 * @default null
	 */
	maxDate:null,
	/**
	 * @property
	 * @type Date
	 * @description [config option]定义可选的最小日期
	 * @default null
	 */
	minDate:null,
	/**
	 * @property
	 * @type String
	 * @description [config option]年的显示文本。
	 * @default '年'
	 */
	yearText:'年',
	/**
	 * @property
	 * @type String
	 * @description [config option]月的显示文本。
	 * @default '月'
	 */
	monthText:'月',
	/**
	 * @property
	 * @type Array
	 * @description [config option]周的显示文本。
	 * @default ['日','一','二','三','四','五','六']
	 */
	weekText:['日','一','二','三','四','五','六'],
	format:'YYYY-MM-DD',
	constructor:function(){
		Alipw.DatePicker.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.DatePicker.superclass.commitProperties.apply(this,arguments);
		
		if(!this.date){
			this.date = new Date();
		}

		if(this.applyTo){
			this._applyToEl = Alipw.convertEl(this.applyTo);
			var fieldValue = this._applyToEl.val();
			
			if(fieldValue){
				var date = Alipw.utils.Date.parse(fieldValue,this.format);
				if(date && date != 'Invalid Date' && !isNaN(date)){
					this.date = date;
				}
			}
		}
	},
	initialize:function(){
		Alipw.DatePicker.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.DatePicker.superclass.createDom.apply(this,arguments);
		
		this.getBody().append(new Alipw.Template([
			'<div class="{$baseCls}-body-wrap">',
				'<div class="{$baseCls}-navbar">',
					'<span class="{$baseCls}-navbar-info"></span>',
					'<a href="#" class="{$baseCls}-navbar-btn-prevyear"></a>',
					'<a href="#" class="{$baseCls}-navbar-btn-prevmonth"></a>',
					'<a href="#" class="{$baseCls}-navbar-btn-nextyear"></a>',
					'<a href="#" class="{$baseCls}-navbar-btn-nextmonth"></a>',
				'</div>',
				'<div class="{$baseCls}-calendar">',
				'<table>',
					'<thead>',
					'</thead>',
					'<tbody>',
					'</tbody>',
				'</table>',
				'</div>',
			'</div>'
		]).set({
			baseCls:this.baseCls
		}).compile());
		
		
		if(this._applyToEl){
			this._applyToEl.bind("focus",jQuery.proxy(this.applyToElement_DatePicker,this));
			
			var documentHandler = Alipw.createFuncProxy(this.documentClickHandler_DatePicker,this);
			jQuery(document).bind("click",documentHandler);
			this.addEventListener('destroy',function(e){
				jQuery(document).unbind("click",documentHandler);
			},this);
			this.addEventListener("select",function(e){
				var date = e.currentTarget.selectedDate;
				this._applyToEl.val(Alipw.utils.Date.format(date,this.format));
				this.hide();
			},this);
		}
	},
	renderComplete:function(){
		this.setNavigationInfo(this.date.getFullYear() + ' ' + this.yearText + ' ' + (this.date.getMonth() + 1) + ' ' + this.monthText);
		this.renderCalendarHeader();
		this.renderCells(this.date.getFullYear(),this.date.getMonth() + 1);
		
		Alipw.DatePicker.superclass.renderComplete.apply(this,arguments);
		
		this.el.find('.' + this.baseCls + '-navbar-btn-prevyear').click(jQuery.proxy(function(e){
			e.preventDefault();
			var current = [this.date.getFullYear(),this.date.getMonth() + 1];
			var dateTo = [current[0] - 1,current[1]];
			this.setDate(new Date(dateTo[0],dateTo[1] - 1));
			this.updateNavigationInfo();
		},this));
		this.el.find('.' + this.baseCls + '-navbar-btn-prevmonth').click(jQuery.proxy(function(e){
			e.preventDefault();
			var current = [this.date.getFullYear(),this.date.getMonth() + 1];
			var dateTo = current[1] == 1 ? [current[0] - 1,12]:[current[0],current[1] - 1];
			this.setDate(new Date(dateTo[0],dateTo[1] - 1));
			this.updateNavigationInfo();
		},this));
		this.el.find('.' + this.baseCls + '-navbar-btn-nextyear').click(jQuery.proxy(function(e){
			e.preventDefault();
			var current = [this.date.getFullYear(),this.date.getMonth() + 1];
			var dateTo = [current[0] + 1,current[1]];
			this.setDate(new Date(dateTo[0],dateTo[1] - 1));
			this.updateNavigationInfo();
		},this));
		this.el.find('.' + this.baseCls + '-navbar-btn-nextmonth').click(jQuery.proxy(function(e){
			e.preventDefault();
			var current = [this.date.getFullYear(),this.date.getMonth() + 1];
			var dateTo = current[1] == 12 ? [current[0] + 1,1]:[current[0],current[1] + 1];
			this.setDate(new Date(dateTo[0],dateTo[1] - 1));
			this.updateNavigationInfo();
		},this));
		
		
		this.el.find('.' + this.baseCls + '-calendar table').click(jQuery.proxy(function(e){
			e.preventDefault();
			if(e.target.nodeName == 'TD'){
				var selectedIndex = e.target.getAttribute('cellIndex');
				if(e.target.getAttribute('celldisabled') == 'true'){
					return;
				}
				this.selectedDate = new Date(this._calendarData[selectedIndex].year,this._calendarData[selectedIndex].month - 1,this._calendarData[selectedIndex].day);
				this.fireEvent('select',{},false);
			}
		},this));
		
		this.el.find('.' + this.baseCls + '-calendar table').mouseover(jQuery.proxy(function(e){
			if(e.target.nodeName == 'TD' && jQuery(e.target).attr('celldisabled') != 'true'){
				jQuery(e.target).addClass(this.baseCls + '-cell-over');
			}
		},this));
		
		this.el.find('.' + this.baseCls + '-calendar table').mouseout(jQuery.proxy(function(e){
			if(e.target.nodeName == 'TD' && jQuery(e.target).attr('celldisabled') != 'true'){
				jQuery(e.target).removeClass(this.baseCls + '-cell-over');
			}
		},this));
	},
	/**
	 * @public
	 * @description 设定头部导航部分文本。
	 * @param {String} text 显示文本
	 */
	setNavigationInfo:function(text){
		this.el.find('.' + this.baseCls + '-navbar-info').text(text);
	},
	updateNavigationInfo:function(){
		this.setNavigationInfo(this.date.getFullYear() + ' ' + this.yearText + ' ' + (this.date.getMonth() + 1) + ' ' + this.monthText);
	},
	renderCalendarHeader:function(){
		var html = '';
		html += '<tr>';
		for(var i=0;i<7;i++){
			html += '<th>' + this.weekText[i] + '</th>';
		}
		html += '</tr>';
		this.el.find('.'+ this.baseCls + '-calendar table thead').empty().append(html);
	},
	renderCells:function(year,month){
		if(!year){
			year = this.date.getFullYear();
		}
		
		if(!month){
			month = this.date.getMonth() + 1;
		}
		
		var html = '';
		html += '<tr>';
		var cellData = this.getDays_DatePicker(year,month);
		this._calendarData = cellData;
		var cellCls;
		
		var today = new Date();
		todayYear = today.getFullYear();
		todayMonth = today.getMonth() + 1;
		todayDay = today.getDate();
		for(var i=0,len=cellData.length;i<len;i++){
			if(i != 0 && i % 7 == 0){
				html += '</tr><tr>';
			}
			if(cellData[i].isLastMonth){
				cellCls = this.baseCls + '-lastmonth';
			}else if(cellData[i].isNextMonth){
				cellCls = this.baseCls + '-nextmonth';
			}else if(cellData[i].year == todayYear && cellData[i].month == todayMonth && cellData[i].day == todayDay){
				cellCls = this.baseCls + '-today';
			}else{
				cellCls = '';
			}
			
			if(cellData[i].disabled){
				cellCls += ' ' + this.baseCls + '-cell-disabled';
			}

			html += '<td class="' + cellCls + '" cellIndex="' + i + '" celldisabled="' + cellData[i].disabled.toString() + '">' + cellData[i].day.toString() + '</td>';
		}
		html += '</tr>';
		this.el.find('.'+ this.baseCls + '-calendar table tbody').empty().append(html);
	},
	/**
	 * @public
	 * @description 设定当前的日期。
	 * @param {Date} date 日期
	 */
	setDate:function(date){
		this.date = date;
		this.renderCells(this.date.getFullYear(), this.date.getMonth() + 1);
	},
	/**
	 * @public
	 * @description 设定最小日期。
	 * @param {Date} date 日期
	 */
	setMinDate:function(date){
		this.minDate = date;
		this.renderCells();
	},
	/**
	 * @public
	 * @description 设定最大日期。
	 * @param {Date} date 日期
	 */
	setMaxDate:function(date){
		this.maxDate = date;
		this.renderCells();
	},
	//private
	getDays_DatePicker:function(year,month){
		var days = new Array();
		
		var getDayNum = function(year,month){
			var leap = (year%100==0 ? res=(year%400==0 ? 1 : 0) : res=(year%4==0 ? 1: 0));
			var daysNum = new Array(31,28+leap,31,30,31,30,31,31,30,31,30,31);
			return daysNum[month - 1];
		};
		
		//Zeller
		/*
		var c = parseInt(year / 100);
		var y = year - c * 100;
		y = month > 2 ? y : (y - 1);
		var m = month > 2 ? month : (month + 12);
		var d = 1;
		var w = y + parseInt( y /4 ) + parseInt( c / 4 ) - 2 * c + parseInt( 26 * ( m + 1 ) / 10 ) + d - 1;
		w = w % 7;
		if(w < 0)w = w + 7;
		*/
		
		var weekday = (new Date(year,month - 1)).getDay();
		var lastMonth = month == 1 ? 12 : (month - 1);
		var lastMonthYear =  month == 1 ? year - 1 : year;
		var lastMonthDaysInCurCalNum = weekday == 0 ? 7 : weekday;
		var lastMonthDayNum;
		
		if(lastMonthDaysInCurCalNum > 0){
			if(month == 1){
				lastMonthDayNum = getDayNum(year - 1,lastMonth);
			}else{
				lastMonthDayNum = getDayNum(year,lastMonth);
			}
		
		
			for(var i=lastMonthDayNum-lastMonthDaysInCurCalNum+1 ,len=lastMonthDayNum;i<=len;i++){
				days.push({
					year:lastMonthYear,
					month:lastMonth,
					day:i,
					isLastMonth:true,
					disabled:this.isDateDisabled_DatePicker(new Date(lastMonthYear + '/' + lastMonth + '/' + i))
				});
			}
		}
		
		for(var i=1,len=getDayNum(year,month);i<=len;i++){
			days.push({
				year:year,
				month:month,
				day:i,
				disabled:this.isDateDisabled_DatePicker(new Date(year + '/' + month + '/' + i))
			});
		}
		
		var restCellNum = 42 - days.length;
		var nextMonth = month == 12 ? 1 : (month + 1);
		var nextMonthYear =  month == 12 ? year + 1 : year;
		
		for(var i=1;i<=restCellNum;i++){
			days.push({
				year:nextMonthYear,
				month:nextMonth,
				day:i,
				isNextMonth:true,
				disabled:this.isDateDisabled_DatePicker(new Date(nextMonthYear + '/' + nextMonth + '/' + i))
			});
		}
		
		return days;
	},
	//private
	isDateDisabled_DatePicker:function(date){
		if(this.minDate && date && date < this.minDate){
			return true;
		}
		if(this.maxDate && date && date > this.maxDate){
			return true;
		}
		return false;
	},
	//private
	applyToElement_DatePicker:function(e){
		var input = jQuery(e.currentTarget);
		this.show();
		Alipw.ComponentManager.bringToFront(this);
		
		var winHeight = jQuery(window).height();
		var inputPos = input.offset();
		var height = this.el.outerHeight();
		var inputSize = [input.innerWidth(),input.innerHeight()];
		
		var left = inputPos.left;
		var top;
		
		if(winHeight - (inputPos.top - jQuery(document).scrollTop()) >= height){
			top = inputPos.top + inputSize[1];
		}else{
			top = inputPos.top - height;
		}
		this.setPosition(left,top);
	},
	//private
	documentClickHandler_DatePicker:function(e){
		if(Alipw.isInNode(e.target,this._applyToEl[0]) || e.target == this._applyToEl[0] || Alipw.isInNode(e.target,this.el[0]) || e.target == this.el[0]){
			return;
		}
		this.hide();
	}
});