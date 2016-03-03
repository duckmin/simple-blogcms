<?php
			
	$url_parts = $GLOBALS['url_parts'];
	//trim off 'thumb' first url part
	array_shift( $url_parts );
	$img_path = implode("/", $url_parts);
	$thumb_path = ImageModifier::getThumbNameFromPath( $img_path );
	//if( !file_exists( $thumb_path ) ){
		ImageModifier::createThumbFromExistingImage( $img_path );
	//}
	ImageModifier::displayExistingThumbnail( $thumb_path )
	
?>