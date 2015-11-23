<?php
	require_once dirname(__FILE__)."/../configs.php";
		
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
			
			//save resized img canvas to new src
			switch($mime_type){
        		case "image/jpeg":
            		$result = imagejpeg($img_p, $thumb_path, self::$quality); 
        			break;
        		case "image/gif":
           		    $result = imagegif($img_p, $thumb_path, self::$quality); 
      				break;
      			case "image/png":
          			$result = imagepng($img_p, $thumb_path, self::$png_quality); 
          			break;
          	}
			return array( "result"=>$result, "thumb_path"=>$thumb_path, "mime"=>$mime_type );
  		} 
   
	}
   
?>