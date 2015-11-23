<?php
	$server = dirname(__FILE__)."/../";
	require_once $server."/configs.php";
	//$manager = new ManagerActions();
	
	if( !ManagerActions::isLoggedIn() && !isset( $_POST['username'] ) && !isset( $_POST['pw'] ) ){
		
		ManagerActions::authenticate();

	}else{
		
		if( !ManagerActions::isLoggedIn() ){
		
			$sent_user = $_POST['username'];
			$sent_pw = $_POST['pw'];
			
			if( ManagerActions::loginSuccess( $sent_user, $sent_pw )  ){	//if true will set 2 session variables and log to file
				//give access to page if user is a key in array and the value matches the PW			
				include $server."/pages/html/manager_body.php";
	
			}else{
				//wrong guess make sleep to prevent brute force
				sleep(4);
				ManagerActions::authenticate();
			}
			
		}else{
			include $server."/pages/html/manager_body.php";
		}
	}//end else
?>
