<?php
	
	$logged_in = ManagerActions::isLoggedIn();
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
?>