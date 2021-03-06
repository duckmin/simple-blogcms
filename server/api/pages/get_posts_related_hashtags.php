<?php

	if( isset( $_APIVALS["hashtags"] ) ){
		$json = $_APIVALS;
		$hashtags = $json["hashtags"]; //hashtags of current post
		$id = $json["id"]; //id of current post
		$page_ids = $json["page_ids"];//array of all ids loaded on this page
		
		try{			
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );
			$post_data = $db_getter->getRecentRelatedHashTags( $page_ids, $hashtags );
			$post_template = file_get_contents( TEMPLATE_DIR."/post_preview.txt" );
			$post_view = new PostViews( new Parsedown );
			
			foreach( $post_data as $post ){
				echo $post_view->makePostPreviewHtmlFromData( $post, $post_template );
			}
			
		} catch( MongoCursorException $e ) {;
			//echo "error message: ".$e->getMessage()."\n";
		}
		
	}

?>