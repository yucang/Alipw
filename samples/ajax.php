<?php
class Ajax
{
	public function __construct(){
		sleep(2);
		if($_REQUEST['value'] > 1000){
			$code	= 200;
			$msg	= '服务器通过校验';
		}else{
			$code	= -1;
			$msg	= '服务器校验未通过';
		}
		$return	= array(
			'code'	=> $code,
			'msg'	=> $msg,
			//重定向地址
			'redirect'	=> null
		);
		
		echo json_encode($return);
	}
}
$ajax	= new Ajax;
$action	= $_REQUEST['action'];
!empty($action) && $ajax->$action();
