<?php

	$path = $_APIVALS['dir_path'];
	
	$files = FileGetter::listFolderContents( $path );
	$list = "";
	$img_exts = $GLOBALS["upload_vars"]["allowed_image_extensions"];
	$audio_exts = $GLOBALS["upload_vars"]["allowed_audio_extensions"];
	$return_info = array();
	
	for( $i = 0; $i < count( $files ); $i++ ){
		$item = $files[ $i ];
		
		if( isset( $item['folder'] ) ){
			$dir_path = $path."/".$item['folder'];
			$data = FileGetter::getDirectoryInfo( $dir_path );
			array_push( $return_info, $data );
		}
		
		if( isset( $item['file'] ) ){
			$file_path = INDEX_PATH.$path."/".$item['file'];
			$extension = pathinfo( $file_path , PATHINFO_EXTENSION );		
			$server_path = 	$path."/".$item['file'];
			$resource_path = BASE_URL.$server_path;	
			if( in_array( $extension, $img_exts ) ){			
				$data = FileGetter::getResourceInfo( "image", $resource_path, $server_path, $item['file'] );
				array_push( $return_info, $data );
			}
			
			if( in_array( $extension, $audio_exts ) ){			
				$data = FileGetter::getResourceInfo( "audio", $resource_path, $server_path, $item['file'] );
				array_push( $return_info, $data );
			}
		}
	}
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode( $return_info );
	
?>