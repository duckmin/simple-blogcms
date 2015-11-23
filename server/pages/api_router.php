<?php
	$post_data = file_get_contents("php://input");
	if( $post_data === "" ){
		echo "no data provided";
		exit;
	}
		
	$service = Api::getServiceFromHeaders();  //the service is recieved by a request header 
	if( $service === false ){
		echo "API request is missing the ".Api::API_SERVICE_HEADER." request header";
		exit;		
	}
	
	$json_data = json_decode( $post_data, true ); //whatever json we POST is used as the params 
	$_APIVALS = $json_data;
	
	$file = Api::getApiPath($service);
	if( $file !== false ){
		include $file;
   }else{
		echo "$service is not a valid api call";   
   }
    
?>