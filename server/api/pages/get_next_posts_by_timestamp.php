<?php
	
	if( isset( $_APIVALS["ts"] ) ){
		$time = floatval( $_APIVALS["ts"] );
		$time_stamp = $time/1000; //js use milliseconds mongo uses seconds convert milliseconds to seconds		
		
		try{			
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );
			$post_data = $db_getter->getPreviousPostsFromTimestamp( $time_stamp );
			$post_template = file_get_contents( TEMPLATE_DIR."/blog_post_preview.txt" );
			$post_view = new PostViews( new Parsedown );
			
			foreach( $post_data as $post ){
				echo $post_view->makePostPreviewHtmlFromData( $post, $post_template );
			}
			
		} catch( MongoCursorException $e ) {;
			echo "error message: ".$e->getMessage()."\n";
		}
		
	}
	
?>