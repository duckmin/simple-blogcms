<?php 
	
	$logged_in = ManagerActions::isLoggedIn();
	
	if( $logged_in && isset($_APIVALS["id"]) ){
		try{
			$id = $_APIVALS["id"];
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );	
			$data = $db_getter->getSingleRowById( $id );
			$resp = json_encode( $data );
			echo $resp;
		}catch( MongoException $e ){
			//echo $e->getMessage();     
		}		
	}
?>