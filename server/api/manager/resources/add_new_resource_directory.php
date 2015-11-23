<?php

	$result = false;
	$message = "";
	$data = null;
	$logged_in = ManagerActions::isLoggedIn();
	
	if( $logged_in ){
		
		$json = $_APIVALS;
		$folder_name = $json["folder_name"];
		$folder_path = $json["folder_path"];
		$illegal_chars = preg_match( "/[\/\s\\\\]/", $folder_name ); //4 /'s in a row match backslash
		
		if( !$illegal_chars && strlen( $folder_name ) > 0 ){
			$f_path = $folder_path."/".$folder_name;
			$folder_pwd = INDEX_PATH."/".$f_path;
			if( !is_dir( $folder_pwd ) ){
				if( mkdir( $folder_pwd, 0774 ) ){
					$message = "Folder Added";
					$result = true;
					$data = FileGetter::getDirectoryInfo( $f_path );
				}else{
					$message = "Create Folder Failed";
				}
			}else{
				$message = $folder_name." is already in folder in ".$folder_path;		
			}
		}else{
			$message = "Folder name can contain no spaces, or slashes";	
		}
	
	}
	echo returnMessage( $result, $message, $data );
	
?>