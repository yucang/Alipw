/**
 * @constructor Alipw.DataGrid
 * @extends Alipw.BoxComponent
 * @author rujian.morj[rujian.morj@aliyun-inc.com]
 * @description 数据表格。
 * @example
 * 
 */

Alipw.DataGrid = Alipw.extend(Alipw.BoxComponent,
/** @lends Alipw.DataGrid.prototype */
{
	applyTo:null,
	baseCls:"alipw-datagrid",
	showHeader: true,
	showFooter: false,
	altGrid: true,
	noneText: '很抱歉, 暂时没有相关数据!',
	gridConfig: [],
	gridData: [],
	cacheData: [],
	constructor:function(){
		Alipw.DataGrid.superclass.constructor.apply(this,arguments);
	},
	commitProperties:function(){
		Alipw.DataGrid.superclass.commitProperties.apply(this,arguments);
	},
	initialize:function(){
		Alipw.DataGrid.superclass.initialize.apply(this,arguments);
	},
	createDom:function(){
		Alipw.DataGrid.superclass.createDom.apply(this,arguments);

		var self = this;

		self.table = jQuery('<table class="' + this.baseCls + '-table"></table>');

		if(jQuery.isArray(self.gridConfig) && self.gridConfig.length > 0){

			self.ths = [];
			self.tds = [];
			jQuery.each(self.gridConfig, function(i, cfg){
				if ( jQuery.isPlainObject(cfg) ){
					var name = cfg['name'],
						field = cfg['field'];

					self.ths.push('<th class="' + self.baseCls + '-field-' + field + '">' + name + '</th>');
					//self.tds.push('<td id="cell_{$row}_{$column}"  class="{$baseCls}-value' + field + '">{$value:' + field + '}</td>');

				}
			});

			self.htr = '<tr>' + self.ths.join('') + '</tr>';
		}

		self.createThead();
		self.createTfoot();
		self.createTbody();
		self.el.append(self.table);
	},
	createThead: function(){
		var self = this;

		if(self.showHeader){
			self.thead = jQuery('<thead class="' + self.baseCls + '-thead"></thead>').append(self.htr);

			self.table.append(self.thead);
		}
	},
	createTfoot: function(){
		var self = this;
		if(self.showFooter){
			self.tfoot = jQuery('<tfoot class="' + self.baseCls + '-tfoot"></tfoot>').append(self.htr);
			self.table.append(self.tfoot);
		}
	},
	createTbody: function(){
		var self = this;
		self.tbody = jQuery('<tbody class="' + self.baseCls + '-tbody"></tbody>');
		self.table.append(self.tbody);
		
	},
	update:function (data) {
		var self = this;

		self.gridData = data;
		self.tbody.empty();

		if(jQuery.isArray(data) && data.length > 0){
			self.tds = [];

			jQuery.each(data, function(row, val){

				self.item = $('<tr></tr>');
	
				if(self.altGrid && row%2 > 0){
					self.item.addClass('alipw-datagrid-alt');
				}

				jQuery.each(self.gridConfig, function(column, cfg){
					
					var name = cfg.name,
						field = cfg.field,
						value = val[field];
	
					var showValue = (cfg['showValue']) ? cfg['showValue'] : '{$value}';
	
					var tpl = new Alipw.Template([
						'<td id="cell_{$row}_{$column}" class="{$baseCls}-value-{$field}">',
							showValue,
						'</td>'
					]);

					tpl.set({
						baseCls: self.baseCls,
						row: row,
						column: column,
						name: name,
						field: field,
						value: value
					});

					var item = tpl.compile();

					if(jQuery.isPlainObject(cfg.style)){
						item.css(cfg.style);
					}
	
					if(jQuery.isFunction(cfg.handlers)){
						item.empty();
						values = self.gridData[row];
						cfg.handlers(item, values);
					}
	
					self.item.append(item);
	
				});
	
				self.tbody.append(self.item);
			});
		}
		else{
			var noneTpl = new Alipw.Template([
				'<tr><td id="cell_none" class="{$baseCls}-value-none" colspan="{$colspan}">{$noneText}</td></tr>'
			]);
			noneTpl.set({
				baseCls: self.baseCls,
				colspan: self.gridConfig.length,
				noneText: self.noneText
			});

			self.tbody.append(noneTpl.compile());
		}
	},
	renderComplete:function(){
		Alipw.DataGrid.superclass.renderComplete.apply(this,arguments);
		
		var self = this;
		self.update(self.gridData);
	}
});