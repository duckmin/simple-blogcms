<?php

	$result = false;
	$message = "Not Logged In";
	$logged_in = ManagerActions::isLoggedIn();
	
	if( $logged_in && isset($_APIVALS['id']) ){
	
		$id = $_APIVALS["id"];		
		try{	
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );
			$deleted = $db_getter->removeSingleRowById( $id );
			$result = ( $deleted['n'] === 1 )? true : false;
			$message = ($result)? 'Deleted' : "Failed to delete post $id";
				
		} catch( MongoCursorException $e ) {;
			$message = "error message: ".$e->getMessage()."\n";
		}
	
	}
	echo returnMessage( $result, $message, null );

?>