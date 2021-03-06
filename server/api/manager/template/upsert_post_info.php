<?php

	$success = false; 
	$message = "";
	$valid_inputs = true;
	$logged_in = ManagerActions::isLoggedIn();	
	//if not logged in all validations will skip and go straight to message
	
	if( $valid_inputs && $logged_in ){  //if all required fields are set set up vars
		$json = $_APIVALS;
		//$procedure = (int)$_APIVALS["procedure"];
		$new_document = ( array_key_exists("id", $json) && $json["id"] === "" )? true : false;

		$title = trim( strip_tags( $json["title"] ) );
		$desc = trim( strip_tags( $json["description"] ) );
		
		$title_length = strlen( $title );
		$desc_length = strlen( $desc );
	}else{
		$valid_inputs = false;
		$message = "Not Logged In";
	}
	
	if( $valid_inputs && $title_length < 1 ){
		$valid_inputs = false;
		$message = "Title must not be blank";
	}
	
	if( $valid_inputs && $title_length > MAX_TITLE_LENGTH ){
		$valid_inputs = false;
		$message = "Title longer than ".MAX_TITLE_LENGTH." characters";
	}
	
	//only allow letters nums and spaces in title
	if( $valid_inputs && preg_match( "/[\"']/", $title ) ){
		$valid_inputs = false;
		$message = "Title can have no quotations";
	}
	
	//make sure title has atleast 2 word or letter char 
	if( $valid_inputs && strlen( preg_replace( "/[^\w\d]/", "", $title ) ) < 2 ){
		$valid_inputs = false;
		$message = "Title must have atleast 2 letter or digit characters";
	}
	
	if( $valid_inputs && $desc_length > MAX_DESC_LENGTH ){
		$valid_inputs = false;
		$message = "Description longer than ".MAX_DESC_LENGTH." characters";
	}
	
	$post_data = $json["post_data"];
	$post_data_length = count( $post_data );
	
	if( $valid_inputs && $post_data_length <= 0 ){
		$valid_inputs = false;
		$message = "Template is empty";
	}
	
	if( $valid_inputs ){
		
		$blogdown = new Parsedown();
		$post_views = new PostViews( $blogdown );
		$post_hashtags = $post_views->extractHashtagsFromPostData( $post_data );  //any #hash in markdown block will get saved so it can be searched on
		$search_hashtags = array_unique ( array_map("strtolower", $post_hashtags) ); //lower case al hashes so they can be used to search with but not dislay
		$preview_text = $post_views->getPreviewTextFromMarkdown( $post_data ); //takes all paragraphs from markdown blocks of post_data and returns a 150 word string for use in preview
		
		try {
			
			$m = MongoConnection();
			$db_name = MONGO_DB_NAME;
			$db = $m->$db_name;
			$collection = $db->posts;
			$author = $_SESSION['user'];
			$title_key = $post_views->generateTitleKey($title);
			
			//procedure 1 create new listing with post_data
			if( $new_document ){
				$mongo_id = new MongoId();			
				$document = array( 
					'_id'=>$mongo_id,					
		   	    	'title'=>$title,
		   	    	'title_key'=>$title_key,
			   		'description'=>$desc,
			   		'post_data'=> $post_data,
			   		'lastModified'=>new MongoDate(),
			   		'author'=>$author,
			   		'hashtags'=>$search_hashtags,
			   		'display_hashtags'=>$post_hashtags,
			   		'preview_text'=>$preview_text
				);
				$write_result = $collection->insert($document);				
				$written = ( $write_result['ok'] >= 1 )? true : false;			
				$success = $written; 
				$message = ( $written )? "Post Published" : "Post Not Saved";
			}
			
			//procedure2 update listings meta data
			if( !$new_document && $json["id"] !== "" ){  //if id is not blank we are updating existing doc
				$mongo_id = new MongoId( $json["id"] ); 
				$update_array = array( 
					'$set'=> array( 
						"title"=>$title, 
						'title_key'=>$title_key,
						"description"=>$desc,
						'post_data'=> $post_data, 
						'hashtags'=>$search_hashtags,
			   		'display_hashtags'=>$post_hashtags,
						'preview_text'=>$preview_text
					) 
				);	
				$write_result = $collection->update( array( "_id"=>$mongo_id ), $update_array );
				$written = ( $write_result['nModified'] === 1 )? true : false;				
				$success = $written;
				$message = ( $written )? "Post Details Edited" : "No Changes Made To Post";
			}			
		
		} catch( MongoCursorException $e ) {
			
			$message = "error message: ".$e->getMessage()."\n";
			
		}
	}
    
	echo returnMessage( $success, $message, null );
	
	
?>