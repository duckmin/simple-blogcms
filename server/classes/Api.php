<?php	
	
	class Api {
	
		const API_SERVICE_HEADER = "X-Api-Service";	
	
		public static function getServiceFromHeaders(){  //name of service should be in the X-Api_Service request header
			$headers = getallheaders();
			return ( array_key_exists(self::API_SERVICE_HEADER, $headers) )? $headers[self::API_SERVICE_HEADER] : false;
		}
 
		public static function getApiPath($service){
			$path = "";
			preg_match_all("/[A-Z]{1}[a-z0-9_]+/", $service, $route_parts);
			$path_matches = $route_parts[0];
			$last = strtolower(array_pop($path_matches));
	        
	        foreach( $path_matches as $part ){
	            $lower_case = strtolower($part);
	            $path .= "$lower_case/";
	        }
	        $path .= "$last.php";
	        $api_file_path = SERVER_PATH."/api/$path";
	        //echo var_dump($api_file_path);
	        return ( file_exists($api_file_path) )? $api_file_path : false;
		}
	
	}
   
?>
