<?php
	$result = false;
	$message = "";
	$logged_in = ManagerActions::isLoggedIn();
	
	if( $logged_in ){ //logged in
		$img_extensions = $GLOBALS["upload_vars"]["allowed_image_extensions"];
		$json = $_APIVALS;
		$file_path = $json["file_path"];
		$server_path = INDEX_PATH.$file_path;
		$path_info = pathinfo( $server_path );
		$extension = $path_info["extension"];
		
		if( is_file( $server_path ) ){
			
			if( isset($json["thumbnail_key"]) && in_array( $extension, $img_extensions ) ){
				//if deleting img check and delete thumbnail
				$thumbnail_key = $json["thumbnail_key"];  //use the time modifed + image name as a key in DB to ensure unique identifier for image
				$db = MongoConnection();
				try{
				    $grid = $db->blog->getGridFS();
				    $remove = $grid->remove( array("filename" => $thumbnail_key ) );
				    $message .= "Removed ".$remove["n"]." Thumbnail,";
				}catch( MongoGridFSException $e ){
					$message .= "Mongo Error ";
					//$message .= $e->getMessage();
				}
			}
			$deleted = unlink( $server_path );
			$result = $deleted;
			$message .= ($deleted)? " File Deleted" : " File Not Deleted";
		}else{
			$message = "File Not Found";
		}
	
	}
	echo returnMessage( $result, $message, null );

?>