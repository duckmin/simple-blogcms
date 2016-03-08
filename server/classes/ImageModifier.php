<?php
	
	//FOR USE WITH THE GD PHP LIB
	
	class ImageModifier {
		private static $quality = 35;
      private static $png_quality = 4;
      private static $thumbnail_width = 100; //this is px width of thumbnail   
		private static $thumbnail_max_height = 100; 
       
      public static function getThumbNameFromPath( $image_path ){
      	$thumb_file_name = preg_replace ( "/\//", "-", $image_path );
			$thumb_path = TMP_FILE_DIRECTORY."/".$thumb_file_name;
			return $thumb_path;
      } 
      
      public static function makeBackgroundTransparent( $mime_type, $img ){
      	//function must be ran if copying transparent BG png or gif to the 'blank' image before copying src image or else BG will be black
      	if($mime_type === "image/gif" || $mime_type === "image/png"){
				imagecolortransparent($img, imagecolorallocatealpha($img, 0, 0, 0, 127));
			   imagealphablending($img, false);
			   imagesavealpha($img, true);
			}	
      }
        
  		public static function createThumbFromExistingImage( $image_path ){
  			
			$full_img_path = realpath(INDEX_PATH."/$image_path");
			
			//do a check to make sure the given image resolves to the RESOURCE_PATH directory
			if(strpos( $full_img_path, RESOURCE_PATH ) !== 0 ){
				exit;
			}
			
			$thumb_path = self::getThumbNameFromPath( $image_path );
			$img_info = getimagesize($full_img_path);
			$mime_type = $img_info["mime"];
			
			$width = $img_info[0];
			$height = $img_info[1];
			$aspect_width = self::$thumbnail_width;
			$aspect_height = round( $height / $width * $aspect_width );
			$max_height = self::$thumbnail_max_height;
			$is_over_max_height = ( $aspect_height > $max_height )? true : false;
			
			//uploader already validates we only have these types of images in /pics
			switch($mime_type){
        		case "image/jpeg":
         		$img = imagecreatefromjpeg($full_img_path); //jpeg file
        			break;
        		case "image/gif":
        		    $img = imagecreatefromgif($full_img_path); //gif file
   				break;
   			case "image/png":
       			$img = imagecreatefrompng($full_img_path); //png file
       			break;
       	}
			
			$initial_resized_img = imagecreatetruecolor( $aspect_width, $aspect_height ); //frame for img to be copied into
			//preserve transparency 
			self::makeBackgroundTransparent( $mime_type, $initial_resized_img );
			imagecopyresampled($initial_resized_img, $img, 0, 0, 0, 0, $aspect_width, $aspect_height, $width, $height);		
			

			//thumb is more than $max_height tall crop
			if( $is_over_max_height ){  
				$trim_amt = round( ( $aspect_height - $max_height ) / 2 ); //amount to crop on bottom and top 
				$final_img = imagecreatetruecolor( $aspect_width, $max_height );
				//preserve transparency 
				self::makeBackgroundTransparent( $mime_type, $final_img );
				imagecopy(
				    $final_img,
				    $initial_resized_img,
				    0, 0,
				    0, $trim_amt,
				    $aspect_width, $max_height
				);
			}else{
				//no need to crop thumb 
				$final_img = $initial_resized_img;  
			}
			

			//save copied thumbnail into tmp dir
			switch($mime_type){
	     		case "image/jpeg":
					$result = imagejpeg($final_img, $thumb_path, self::$quality);
	         	//$result = imagejpeg($initial_resized_img, $thumb_path, self::$quality);  
	     			break;
	     		case "image/gif":
        		   $result = imagegif($final_img, $thumb_path, self::$quality); 
   				break;
   			case "image/png":
       			$result = imagepng($final_img, $thumb_path, self::$png_quality); 
       			break;
       	}

			return $result;//array( "result"=>$result, "thumb_path"=>$thumb_path, "mime"=>$mime_type );
			
  		}
  		
  		public static function displayExistingThumbnail( $thumb_path ){ 
  		
			$img_info = getimagesize($thumb_path);
			$mime_type = $img_info["mime"];
			
			header("Content-type: $mime_type"); 
			
			//uploader already validates we only have these types of images in /pics
			switch($mime_type){
        		case "image/jpeg":
         		$img = imagecreatefromjpeg($thumb_path); //jpeg file
         		imagejpeg($img); 
        			break;
        		case "image/gif":
        		   $img = imagecreatefromgif($thumb_path); //gif file
        		   imagegif($img); 
   				break;
   			case "image/png":
       			$img = imagecreatefrompng($thumb_path); //png file
       			self::makeBackgroundTransparent( $mime_type, $img );
       			imagepng($img);
       			break;
			}
				
		}
   
	}
	
?>