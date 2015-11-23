<?php
	include_once dirname(__FILE__)."/../server/configs.php";
	
	//will run a function in the same window as form submitting to this action (manager resources tab file upload
    function uploadResponse( $result, $message, $data ){
        $response = json_encode( array( "result"=>$result, "message"=>$message, "data"=>$data ) );
        echo "<script language=\"javascript\" type=\"text/javascript\">".
		"window.top.window.uploadResponseAction($response);".
		"</script>";
    }	
	
	$result = false;
	$message = "";
	$data = null;
	//path of folder file to be placed in 
	
    //if not logged in exit
    $logged_in = ManagerActions::isLoggedIn();
    if( !$logged_in ){ exit; };
    	
	if( count($_FILES) === 0 ){
	    $message = "files were not transmitted, check server settings for file uploads";
	    uploadResponse( $result, $message, $data );
	    exit;
	}
	
    if( !isset($_POST["folder_path"]) ){
	    $message = "no folder_path";
	    uploadResponse( $result, $message, $data );
	    exit;
	}
	
	$folder_path = $_POST["folder_path"];
	
	$uploaded_files = $_FILES["resources"];
	$upload_vars = $GLOBALS["upload_vars"];
	$allowedExts = $upload_vars["allowed_extensions"];
	$allowedTypes = $upload_vars["allowed_mimetypes"];
	$file_arry = array();
    $file_count = count($uploaded_files['name']);
    $file_keys = array_keys($uploaded_files);

    for ($i=0; $i<$file_count; $i++) {
        foreach ($file_keys as $key) {
            $file_arry[$i][$key] = $uploaded_files[$key][$i];
        }
    }
    
    foreach( $file_arry as $key=>$upload ){
        
        $name = $upload["name"];  
        $path_info = pathinfo( $name );
        $extension = strtolower( $path_info["extension"] );
        $mime_type = $upload["type"];
        //add destination path to array so it is possible to check if file exists or not
        $file_arry[$key]["destination_path"] = $destination_path = INDEX_PATH.$folder_path."/".$upload["name"];
        
        //check for upload error
        $error = $upload["error"];  
        if( $error !== 0 ){
            $message = "error uploading ".$upload["name"];
            uploadResponse( $result, $message, $data );
            exit;
        }        
        
        //check valid file names must have no spaces or special chars  
        if( preg_match("/[^A-z0-9\_\-\.]/", $path_info["filename"] ) ){
            $message = $upload["name"]." can have only letters, numbers, hyphens, and underscores as a file name. Please rename";
            uploadResponse( $result, $message, $data );
            exit;
        }
        
        //check to see if file is an allowed extension
        if( !in_array( $mime_type, $allowedTypes ) || !in_array( $extension, $allowedExts ) ){
            $message = $upload["name"]." is not allowed to be uploaded";
            uploadResponse( $result, $message, $data );
            exit;  
        }
        
        //check uploads for size restrictions
        $upload_kbs = $upload["size"]/1024;	
	    //its either in img extensions or its an audio file			
		$is_img = ( in_array( $extension,  $upload_vars["allowed_image_extensions"] ) )? true : false;		
		//used as param #1 in FileGetter::getResourceInfo to tell js on page type of file
		$file_arry[$key]["file_getter_type"] = ( $is_img )? "image" : "audio";
		$max_kbs = ( $is_img )? $upload_vars["max_kb_img_upload"] : $upload_vars["max_mb_audio_upload"]*1000;		
        $to_big = ( (int)$upload_kbs > $max_kbs )? true : false;
        if( $to_big ){
            $message = $upload["name"]." is above the $max_kbs KB limit";
            uploadResponse( $result, $message, $data );
            exit;    
        }
        
        //make sure files do not exist
        if ( file_exists( $destination_path ) ){
            $message = $upload["name"]." already exists in $folder_path";
            uploadResponse( $result, $message, $data );
            exit;
        }
    }
    
    //our files have passed validation now upload 
    $data = array();
    foreach( $file_arry as $upload ){
        move_uploaded_file( $upload["tmp_name"], $upload["destination_path"] );
        $server_path = 	$folder_path."/".$upload["name"];
        $url_path =  BASE_URL.$server_path;	
		$page_json = FileGetter::getResourceInfo( $upload["file_getter_type"], $url_path, $server_path, $upload["name"] );
		array_push( $data, $page_json );
    }
    //echo var_dump($data);
    $message =  "Files Up Loaded";
	$result = true;
    uploadResponse( $result, $message, $data );	
?>







