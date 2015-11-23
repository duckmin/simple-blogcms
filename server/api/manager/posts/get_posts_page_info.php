<?php

	$logged_in = ManagerActions::isLoggedIn();
	if( $logged_in && isset($_APIVALS["ts"]) ){
        
      $time = floatval( $_APIVALS["ts"] );
	   $time_stamp = $time/1000; //js use milliseconds mongo uses seconds convert milliseconds to seconds
	   
		try{		
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );
			if( isset( $_APIVALS["search"] ) ){
			    $search = $_APIVALS["search"];
			    $cursor = $db_getter->getHomePagePostsFromSearchAfterDate( $time_stamp, $search ); 
			}else{
			    $cursor = $db_getter->getHomePagePostsAfterDate( $time_stamp );
			}
			$posts = iterator_to_array( $cursor );

			if( count( $posts ) > AMOUNT_ON_MAIN_PAGE ){
				array_pop( $posts );  //if we have one extra remove it ( one extra is given because same query used for pagination on other pages, deos not matter here so just remove it 
			}
			
			$parsedown = new Parsedown();				
			$post_views = new PostViews( $parsedown );	
			$modified_array=array();
			$post_template = file_get_contents( TEMPLATE_DIR."/blog_post.txt" );
			foreach( $posts as $row ){ 			
				$modified_row = $post_views->convertRowValues( $row );	
            $row["show_id"] = true; //show_id on template, so manager page JavaScript can identify them
            $post_html = $post_views->makePostHtmlFromData( $row, $post_template );				
				array_push( $modified_array, array("post_data"=>$modified_row, "post_html"=>$post_html) );		
			}
			
			$data=array( "posts"=>$modified_array );
			
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode( array( "result"=>true, "data"=>$data ) );
			
		}catch( MongoCursorException $e ) {
			echo returnMessage( false, 'ERROR:'.$e->getMessage(), null );
		}
	}
	
	/*
	if( $logged_in && isset($_APIVALS["p"]) ){
        
        $page_num = $_APIVALS["p"];
		try{		
			$db = MongoConnection();
			$db_getter = new MongoGetter( $db );
			if( isset( $_APIVALS["search"] ) ){
			    $search = $_APIVALS["search"];
			    $cursor = $db_getter->getPostsFromDbBySearch( $page_num, $search ); 
			}else{
			    $cursor = $db_getter->getBlogManagePosts( $page_num );
			}
			$posts = iterator_to_array( $cursor );

			if( count( $posts ) > AMOUNT_ON_MANAGER_TAB ){
				array_pop( $posts );
				$next=true;
			}else{
				$next=false;
			}
			
			$parsedown = new Parsedown();				
			$post_views = new PostViews( $parsedown );	
			$modified_array=array();
			$post_template = file_get_contents( TEMPLATE_DIR."/blog_post.txt" );
			foreach( $posts as $row ){ 			
				$modified_row = $post_views->convertRowValues( $row );	
                $row["show_id"] = true; //show_id on template, so manager page JavaScript can identify them
                $post_html = $post_views->makePostHtmlFromData( $row, $post_template );				
				array_push( $modified_array, array("post_data"=>$modified_row, "post_html"=>$post_html) );		
			}
			
			$prev=( $page_num>1 )? true : false;
			$data=array( "posts"=>$modified_array, "next"=>$next, "prev"=>$prev );
			
			header('Content-Type: application/json; charset=utf-8');
			echo json_encode( array( "result"=>true, "data"=>$data ) );
			
		}catch( MongoCursorException $e ) {
			echo returnMessage( false, 'ERROR:'.$e->getMessage(), null );
		}
	}
	*/
?>