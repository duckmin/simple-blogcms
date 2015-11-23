<?php
	
	$success = false; 
	$message = "";
	$logged_in = ManagerActions::isLoggedIn();
	
	if( $logged_in && isset($_APIVALS['id']) ){
		
		$id = trim( $_APIVALS["id"] );		
		try{			
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );
			$result = $db_getter->renewPostDate( $id );
			$success = ( $result['nModified'] === 1 )? true : false;
			$message = ( $success )? "Post Moved To Top" : "Could not update post with id $id"; 
		} catch( MongoCursorException $e ) {;
			$message = "error message: ".$e->getMessage()."\n";
		}
		
	}
	echo returnMessage( $success, $message, null );
?>