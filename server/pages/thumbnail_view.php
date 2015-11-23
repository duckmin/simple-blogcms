<?php

if( $part_count === 2 ){
	$filename = $GLOBALS['url_parts'][1];
	try{
	    $mongo = MongoConnection();
		$gridFS = $mongo->blog->getGridFS();
		$image = $gridFS->findOne( $filename );
		if( $image !== null ){
			$mime_type = $image->file["metadata"]["mime-type"];
			header("Content-type: $mime_type");
			echo $image->getBytes();
		}else{
			//if image is not found output a stock thumb "thumb not available"
			$stock_thumb = INDEX_PATH."/style/resources/no-thumbnail.png";
			$im = imagecreatefrompng($stock_thumb);
            if ($im) {
              header("Content-type: image/png");
              imagepng($im);  
            }
        }           
	}catch( MongoGridFSException $e ){
		echo $e->getMessage();
	}	
}

?>