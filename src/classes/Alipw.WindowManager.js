/**
 * @class
 * @type singleton
 * @author zhangwen.cao[zhangwen.cao@aliyun-inc.com]
 * @description 窗口管理器。
 */
Alipw.WindowManager = function(){
	var wins = new Array(); //windows storage
	
	var pub = 
	/** @lends Alipw.WindowManager */
	{
		/**
		 * @static
		 * @property
		 * */
		zseed:8000,
		
		/**
		 * @static
		 * @function
		 * */
		register:function(win){
			if(win instanceof Alipw.Window){
				wins.push(win);
			}
		},
		/**
		 * @static
		 * @function
		 * */
		unregister:function(win){
			Alipw.removeItemFromArray(win, wins);
			
			if(wins.length == 0){

			}
			//this.updateZIndex();
		}
	};
	
	return pub;
}();