<?php
	$server = dirname(__FILE__)."/../server";

	include_once $server."/configs.php";
	
	//$db = MongoConnection();
	//$db_getter = new MongoGetter( $db ); 
	/*$most_recent = $db_getter->getMostRecentPostTimestamp();
	//echo print_r($most_recent);
	$start = $most_recent["lastModified"]->sec;
	$start_date = date("Y-m-d", $start );
	$end = strtotime("$start_date -12 months");
	//echo date("Y-m-d H:i:s", $end )."<br>"; 
	
	$s1 = strtotime("2015-11-27 +23 hours 59 minutes 59 seconds");
	$e1 = strtotime("2015-11-27");
	
	echo date("Y-m-d H:i:s", $s1 )."<br>";
	echo date("Y-m-d H:i:s", $e1 )."<br>";
	
	$distinct_hashtags = $db_getter->getDistinctHashtagsForDateRange( $start, $end );
	echo print_r( $distinct_hashtags );

	//test query for distinct hashtag range
	//db.posts.distinct('hashtags',{lastModified:{$lt:ISODate("2015-11-24T23:59:59.999Z"),$gt:ISODate("2015-11-24T00:00:00.000Z")}})
	*/
	
	//$aside_views = new AsideViews();
	//$aside_controller = new AsideController( $db_getter, $aside_views );
	//$aside_controller->getPastYearsHashtagsLinksBox();
	
	
	//start hashtag count operation test
	/*
	$max = 2;
	
	$count_holder = $aside_controller->getPopularHashtagFullCountArray();
	echo print_r($count_holder );
	arsort($count_holder);
	$slice = ( count($count_holder) > $max )? array_slice($count_holder, 0, $max) : $count_holder;
	echo print_r($slice);
	*/
	//$aside_controller->getMostPopularHashtagsLinksBox();
	
	

		
	class ImageModifier {
		private static $quality = 35;
      private static $png_quality = 4;
      private static $thumbnail_width = 100; //this is px width of thumbnail        
        
  		public static function createThumbFromExistingImage( $image_path ){
  			//FOR USE WITH THE GD PHP LIB
			$path_info = pathinfo( $image_path );
			$thumb_file_name = $path_info["filename"].".".$path_info["extension"];
			$thumb_path = TMP_FILE_DIRECTORY."/".$thumb_file_name;

			$img_info = getimagesize($image_path);
			$mime_type = $img_info["mime"];
			$width = $img_info[0];
			$height = $img_info[1];
			$aspect_width = self::$thumbnail_width;
			$aspect_height = round( $height / $width * $aspect_width );
			
			//uploader already validates we only have these types of images in /pics
			switch($mime_type){
        		case "image/jpeg":
         		$img = imagecreatefromjpeg($image_path); //jpeg file
        			break;
        		case "image/gif":
        		    $img = imagecreatefromgif($image_path); //gif file
   				break;
   			case "image/png":
       			$img = imagecreatefrompng($image_path); //png file
       			break;
       	}
			$img_p = imagecreatetruecolor( $aspect_width, $aspect_height ); //frame for img to be copied into
			
			//preserve transparency 
			if($mime_type == "image/gif" or $mime_type == "image/png"){
				imagecolortransparent($img_p, imagecolorallocatealpha($img_p, 0, 0, 0, 127));
			    imagealphablending($img_p, false);
			    imagesavealpha($img_p, true);
			}
			
			imagecopyresampled($img_p, $img, 0, 0, 0, 0, $aspect_width, $aspect_height, $width, $height);
			
			//echo image
			header("Content-type: $mime_type"); 
			switch($mime_type){
     		case "image/jpeg":
         		
         		imagejpeg($img_p); 
         		//$result = imagejpeg($img_p, $thumb_path, self::$quality); 
     			break;
     		case "image/gif":
        		    //$result = imagegif($img_p, $thumb_path, self::$quality); 
   				break;
   			case "image/png":
       			//$result = imagepng($img_p, $thumb_path, self::$png_quality); 
       			break;
       	}
			//return $result;//array( "result"=>$result, "thumb_path"=>$thumb_path, "mime"=>$mime_type );
  		} 
   
	}
	
	//header("Content-type: image/jpeg"); 
	ImageModifier::createThumbFromExistingImage( INDEX_PATH."/pics/ello/civc.jpg" );
   
?>